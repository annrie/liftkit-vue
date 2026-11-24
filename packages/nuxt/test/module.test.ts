import { describe, it, expect, beforeEach, vi } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import type { ModuleOptions } from '../src/module'

// @nuxt/kit のうち、Nuxt の実体が無いと動かない3つだけを差し替える。
// - defineNuxtModule: 定義オブジェクトをそのまま返し、setup を直接呼べるようにする
// - addComponent / addPlugin: 呼び出しを記録するだけにする
// createResolver は本物を使う(パス解決が正しいことも確かめたいため)
const { addComponent, addPlugin } = vi.hoisted(() => ({ addComponent: vi.fn(), addPlugin: vi.fn() }))

vi.mock('@nuxt/kit', async (importOriginal) => ({
  ...(await importOriginal<typeof import('@nuxt/kit')>()),
  defineNuxtModule: (definition: unknown) => definition,
  addComponent,
  addPlugin,
}))

const { default: nuxtModule } = await import('../src/module')

interface ModuleDefinition {
  meta: { name: string; configKey: string }
  defaults: ModuleOptions
  setup: (options: ModuleOptions, nuxt: unknown) => void
}
const definition = nuxtModule as unknown as ModuleDefinition

const coreRoot = path.resolve(import.meta.dirname, '../../core/src')

/** setup を実行して、変更された Nuxt のオプションを返す */
function setupOptions(options: Partial<ModuleOptions> = {}) {
  const nuxt = { options: { css: [] as string[], build: { transpile: [] as string[] } } }
  definition.setup({ ...definition.defaults, ...options }, nuxt)
  return nuxt.options
}

/** setup を実行して、Nuxt の css 配列に積まれたパスを返す */
const runSetup = (options: Partial<ModuleOptions> = {}) => setupOptions(options).css

const cssNames = (paths: string[]) => paths.map((file) => path.basename(file))

beforeEach(() => {
  addComponent.mockClear()
  addPlugin.mockClear()
})

describe('メタ情報と既定値', () => {
  it('モジュール名・設定キー・既定のオプション', () => {
    expect(definition.meta).toEqual({ name: '@liftkit-vue/nuxt', configKey: 'liftkit' })
    expect(definition.defaults).toEqual({ css: 'full', includeReset: true, components: true })
  })
})

describe('CSS の注入', () => {
  it("css: 'none' なら何も注入せず、css: 'tokens' ならトークンだけを注入する(includeReset の値は無関係)", () => {
    expect(runSetup({ css: 'none' })).toEqual([])
    for (const includeReset of [true, false]) {
      const css = runSetup({ css: 'tokens', includeReset })
      expect(css, `includeReset: ${includeReset}`).toEqual([path.join(coreRoot, 'css/liftkit-tokens.css')])
    }
  })

  it("css: 'full' + includeReset: true なら index.css(トークン・リセット・ユーティリティ一式)だけを注入する", () => {
    expect(runSetup({ css: 'full', includeReset: true })).toEqual([path.join(coreRoot, 'css/index.css')])
  })

  it("css: 'full' + includeReset: false はリセットを含まず、index.css のユーティリティを漏れなく個別に注入する", () => {
    const css = runSetup({ css: 'full', includeReset: false })
    const names = cssNames(css)

    expect(names[0]).toBe('liftkit-tokens.css')
    expect(names.at(-1)).toBe('lk-components.css')
    expect(names).not.toContain('liftkit-reset.css')
    expect(names).not.toContain('index.css')
    expect(new Set(css).size).toBe(css.length)

    // index.css が読み込む自前の CSS(リセットと外部の normalize を除く)と、一致しているはず
    const indexCss = fs.readFileSync(path.join(coreRoot, 'css/index.css'), 'utf-8')
    const imported = [...indexCss.matchAll(/@import\s+"\.\/([^"]+)";/g)]
      .map((m) => m[1])
      .filter((file) => file !== 'liftkit-reset.css')
    expect([...names].sort()).toEqual([...imported].sort())
  })

  it('注入する CSS ファイルはどのモードでも実在する', () => {
    const all = [
      ...runSetup({ css: 'full', includeReset: true }),
      ...runSetup({ css: 'full', includeReset: false }),
      ...runSetup({ css: 'tokens' }),
    ]
    expect(all.length).toBeGreaterThan(30)
    for (const file of all) {
      expect(fs.existsSync(file), file).toBe(true)
    }
  })
})

describe('依存の変換', () => {
  it('拡張子なしの import を含み Node が直接読めない依存を、常に Vite の変換対象にする', () => {
    for (const options of [{}, { css: 'none' as const }, { components: false }]) {
      expect(setupOptions(options).build.transpile, JSON.stringify(options)).toEqual(['@material/material-color-utilities'])
    }
  })
})

describe('ランタイムプラグイン', () => {
  it('CSS・コンポーネントの設定にかかわらず、常に runtime/plugin を1回登録する', () => {
    for (const options of [{}, { css: 'none' as const }, { components: false }]) {
      addPlugin.mockClear()
      runSetup(options)
      expect(addPlugin, JSON.stringify(options)).toHaveBeenCalledTimes(1)
      const [pluginPath] = addPlugin.mock.calls[0]
      expect(pluginPath).toBe(path.resolve(import.meta.dirname, '../src/runtime/plugin'))
      expect(fs.existsSync(`${pluginPath}.ts`)).toBe(true)
    }
  })
})

describe('コンポーネントの自動インポート', () => {
  const registered = () =>
    addComponent.mock.calls.map(([component]) => component as { name: string; filePath: string })

  it('components: false なら登録しない', () => {
    runSetup({ components: false })
    expect(addComponent).not.toHaveBeenCalled()
  })

  it('登録するコンポーネントは、名前に一致する実在の .vue ファイルを指し、名前は重複しない', () => {
    runSetup({ components: true })
    const components = registered()
    expect(components.length).toBeGreaterThan(30)
    expect(new Set(components.map((c) => c.name)).size).toBe(components.length)
    for (const { name, filePath } of components) {
      expect(path.basename(filePath), name).toBe(`${name}.vue`)
      expect(filePath.startsWith(path.join(coreRoot, 'components')), name).toBe(true)
      expect(fs.existsSync(filePath), filePath).toBe(true)
    }
  })

  it('サブディレクトリのコンポーネント(LkDropdown 系)は LkDropdown/ 配下を指す', () => {
    runSetup()
    const dropdown = registered().filter((c) => c.name.startsWith('LkDropdown'))
    expect(dropdown.map((c) => c.name).sort()).toEqual(['LkDropdown', 'LkDropdownMenu', 'LkDropdownTrigger'])
    for (const { name, filePath } of dropdown) {
      expect(filePath, name).toBe(path.join(coreRoot, 'components/LkDropdown', `${name}.vue`))
    }
  })

  it('core の index.ts が公開するコンポーネントのうち、登録されていないのは Select の部品3つだけ', () => {
    // 現状の食い違いをそのまま固定している。意図した除外でないなら module.ts に追加し、このリストを空にすること。
    const indexTs = fs.readFileSync(path.join(coreRoot, 'index.ts'), 'utf-8')
    const exported = [...indexTs.matchAll(/export \{ default as (Lk\w+) \} from '\.\/components\//g)].map((m) => m[1])
    expect(exported.length).toBeGreaterThan(30)

    runSetup()
    const names = new Set(registered().map((c) => c.name))
    expect(exported.filter((name) => !names.has(name)).sort()).toEqual(['LkSelectMenu', 'LkSelectOption', 'LkSelectTrigger'])
    // 逆方向: 登録しているのに core が公開していないものは無い
    expect([...names].filter((name) => !exported.includes(name))).toEqual([])
  })
})

describe('core が公開するファイル', () => {
  // モジュールは core の dist ではなく src の .vue を登録する。npm の公開物に import 先が入っていないと、
  // workspace の中では動くのに、インストールした側のビルドだけが失敗する(0.2.4 で発生)。
  const packageRoot = path.dirname(coreRoot)
  const { files } = JSON.parse(fs.readFileSync(path.join(packageRoot, 'package.json'), 'utf-8')) as { files: string[] }
  const isPublished = (file: string) => files.some((entry) => {
    const relative = path.relative(path.join(packageRoot, entry), file)
    return relative === '' || !relative.startsWith('..')
  })

  const resolveImport = (from: string, specifier: string) => {
    const base = path.resolve(path.dirname(from), specifier)
    return [base, `${base}.ts`, path.join(base, 'index.ts')]
      .find((file) => fs.existsSync(file) && fs.statSync(file).isFile())
  }

  it('登録する部品と CSS、その相対 import の先が、すべて公開対象に含まれる', () => {
    const css = [...runSetup({ includeReset: true }), ...runSetup({ includeReset: false })]
    const queue = [...addComponent.mock.calls.map(([component]) => (component as { filePath: string }).filePath), ...css]
    const visited = new Set<string>()
    const unresolved: string[] = []

    for (let file = queue.pop(); file; file = queue.pop()) {
      if (visited.has(file)) continue
      visited.add(file)
      const source = fs.readFileSync(file, 'utf-8')
      for (const [, specifier] of source.matchAll(/(?:from|import)\s+['"](\.{1,2}\/[^'"]+)['"]/g)) {
        const target = resolveImport(file, specifier)
        if (target) queue.push(target)
        else unresolved.push(`${path.relative(packageRoot, file)} -> ${specifier}`)
      }
    }

    expect(unresolved).toEqual([])
    // たどれていること自体の確認(composables と utils まで届く)
    expect(visited).toContain(path.join(coreRoot, 'composables/useTheme.ts'))
    expect(visited).toContain(path.join(coreRoot, 'utils/utilities.ts'))
    expect([...visited].filter((file) => !isPublished(file)).map((file) => path.relative(packageRoot, file)).sort()).toEqual([])
  })
})
