import { describe, it, expect, afterEach, vi } from 'vitest'
import fs from 'node:fs'
import path from 'node:path'
import { createGenerator, type UserConfig } from '@unocss/core'
import { presetMini, presetWind4 } from 'unocss'
import presetLiftKitDefault, { presetLiftKit } from '../src/index'

type Dict = Record<string, string>
const SIZES = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl']

function themeOf(options?: Parameters<typeof presetLiftKit>[0]) {
  return presetLiftKit(options).theme as Record<string, Dict>
}

function shortcutsOf() {
  return presetLiftKit().shortcuts as Array<[string, string]>
}

/** CSS の宣言ブロック("a:b;c:d;")をプロパティ→値の連想に直す。値の空白は畳む */
function parseDeclarations(body: string) {
  const props: Record<string, string> = {}
  for (const [, name, value] of body.matchAll(/([\w-]+)\s*:\s*([^;]+?)\s*;?\s*(?=;|$|[\w-]+\s*:)/g)) {
    props[name] = value.replace(/\s+/g, ' ').trim()
  }
  return props
}

/**
 * typography.css の最上位にある単純なクラス定義(.name { ... })を、クラス名→宣言の連想に直す。
 * @media などの at-rule の中身は対象外。同じクラスが複数回出たら、後のもので上書きする(CSS のカスケードと同じ)
 */
function parseTopLevelClasses(css: string) {
  const text = css.replace(/\/\*[\s\S]*?\*\//g, '')
  const classes = new Map<string, Record<string, string>>()
  let depth = 0
  let prelude = ''
  let bodyStart = 0
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (ch === '{') {
      if (depth === 0) bodyStart = i + 1
      depth++
    } else if (ch === '}') {
      depth--
      if (depth === 0) {
        const selector = prelude.trim()
        if (/^\.[\w-]+$/.test(selector)) {
          const name = selector.slice(1)
          classes.set(name, { ...classes.get(name), ...parseDeclarations(text.slice(bodyStart, i)) })
        }
        prelude = ''
      }
    } else if (depth === 0) {
      if (ch === ';') prelude = '' // @import など波括弧を持たない文
      else prelude += ch
    }
  }
  return classes
}

/**
 * 指定したプリセット群で CSS を生成する(プリフライトは含めない)。
 * presetLiftKit は theme の型を絞って返すため、UserConfig['presets'](Preset<object>)へは
 * そのまま代入できない(rules の型の変性)。テストでは型を緩めて渡す
 */
async function generate(presets: unknown[], classes: string) {
  const uno = await createGenerator({ presets: presets as UserConfig['presets'] })
  return uno.generate(classes, { preflights: false })
}

afterEach(() => {
  vi.restoreAllMocks()
})

describe('プリセットの基本', () => {
  it('名前を持ち、default export は presetLiftKit と同じで、injectVars: false のときだけプリフライトを持たない', () => {
    expect(presetLiftKit().name).toBe('@liftkit-vue/preset-unocss')
    expect(presetLiftKitDefault).toBe(presetLiftKit)
    expect(presetLiftKit().preflights).toHaveLength(1)
    expect(presetLiftKit({}).preflights).toHaveLength(1)
    expect(presetLiftKit({ injectVars: true }).preflights).toHaveLength(1)
    expect(presetLiftKit({ injectVars: false }).preflights).toEqual([])
  })
})

describe('プリフライト(theme-css の注入)', () => {
  // preflight の context は使われないため、型を絞らずに呼べる形で受ける
  const getCSS = (preflight: { getCSS: (context: never) => unknown } | undefined) => preflight!.getCSS({} as never)

  it('theme-css の liftkit-core.css と typography.css を、この順で結合して返す', async () => {
    const css = (await getCSS(presetLiftKit().preflights?.[0])) as string
    expect(css).toContain('--lk-scalefactor')
    expect(css).toContain('--display1-font-size')
    expect(css.indexOf('--lk-scalefactor')).toBeLessThan(css.indexOf('.display1'))
  })

  it('typography.css の @import だけを取り除く(core 側には手を加えない)', async () => {
    vi.spyOn(fs, 'readFileSync').mockImplementation(((file: fs.PathOrFileDescriptor) => {
      const name = String(file)
      if (name.endsWith('liftkit-core.css')) return ":root { --lk-test: 1; }"
      if (name.endsWith('typography.css')) return "@import './base.css';\n@import \"other.css\"\n.display1 { color: red; }"
      throw new Error(`想定外のファイル: ${name}`)
    }) as typeof fs.readFileSync)

    const css = (await getCSS(presetLiftKit().preflights?.[0])) as string
    expect(css).not.toContain('@import')
    // 空白の量は実装の詳細なので、空白を畳んで内容と順序だけを確かめる
    expect(css.replace(/\s+/g, ' ').trim()).toBe(':root { --lk-test: 1; } .display1 { color: red; }')
  })

  it('CSS を読み込めないときは警告を出し、空の CSS を返す(例外にはしない)', async () => {
    vi.spyOn(fs, 'readFileSync').mockImplementation(() => {
      throw new Error('ENOENT')
    })
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const css = await getCSS(presetLiftKit().preflights?.[0])
    expect(css).toBe('')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('[@liftkit-vue/preset-unocss]'))
  })
})

describe('theme', () => {
  it('colors の値はすべて var(--lk-<キー>) で、キーは小文字', () => {
    const colors = themeOf().colors
    const entries = Object.entries(colors)
    expect(entries.length).toBeGreaterThan(40)
    for (const [key, value] of entries) {
      expect(key, key).toMatch(/^[a-z]+$/)
      expect(value, key).toBe(`var(--lk-${key})`)
    }
    expect(colors).toMatchObject({ primary: 'var(--lk-primary)', onsurface: 'var(--lk-onsurface)' })
  })

  it('spacing と borderRadius は同じ10段階のサイズを var(--lk-size-*) に対応させる', () => {
    const { spacing, borderRadius } = themeOf()
    for (const size of SIZES) {
      expect(spacing[size], `spacing.${size}`).toBe(`var(--lk-size-${size})`)
      expect(borderRadius[size], `borderRadius.${size}`).toBe(`var(--lk-size-${size})`)
    }
    expect(Object.keys(spacing)).toEqual(SIZES)
    // borderRadius だけは full / none を追加で持つ
    expect(Object.keys(borderRadius).filter((key) => !SIZES.includes(key)).sort()).toEqual(['full', 'none'])
    expect(borderRadius.full).toBe('100em')
    expect(borderRadius.none).toBe('0em')
  })

  it('boxShadow は sm〜2xl の5段階を var(--lk-shadow-*) に対応させる', () => {
    expect(themeOf().boxShadow).toEqual({
      'sm': 'var(--lk-shadow-sm)',
      'md': 'var(--lk-shadow-md)',
      'lg': 'var(--lk-shadow-lg)',
      'xl': 'var(--lk-shadow-xl)',
      '2xl': 'var(--lk-shadow-2xl)',
    })
    // injectVars の有無でテーマは変わらない
    expect(themeOf({ injectVars: false })).toEqual(themeOf({ injectVars: true }))
  })
})

describe('rules(実際の CSS 生成)', () => {
  it('text-<サイズ> は10段階すべてで font-size: var(--lk-size-*) を出す', async () => {
    const { css, matched } = await generate([presetLiftKit({ injectVars: false })], SIZES.map((s) => `text-${s}`).join(' '))
    expect(matched.size).toBe(SIZES.length)
    for (const size of SIZES) {
      expect(css).toContain(`.text-${size}{font-size:var(--lk-size-${size});}`)
    }
  })

  it('leading-<step> は4段階で line-height: var(--lk-*) を出す', async () => {
    const steps = ['eighthstep', 'quarterstep', 'halfstep', 'wholestep']
    const { css } = await generate([presetLiftKit({ injectVars: false })], steps.map((s) => `leading-${s}`).join(' '))
    for (const step of steps) {
      expect(css).toContain(`.leading-${step}{line-height:var(--lk-${step});}`)
    }
  })

  it('範囲外のサイズ・段階や、前後に余計な文字がある名前にはマッチしない', async () => {
    const { css, matched } = await generate(
      [presetLiftKit({ injectVars: false })],
      'text-5xl text-sm2 xtext-sm leading-fullstep leading-halfsteps',
    )
    expect(matched.size).toBe(0)
    expect(css).toBe('')
  })
})

describe('shortcuts(タイポグラフィ)', () => {
  it('名前が重複せず、通常・bold のペアで揃っている', () => {
    const names = shortcutsOf().map(([name]) => name)
    expect(new Set(names).size).toBe(names.length)
    expect(names).toHaveLength(24)
    for (const name of names.filter((n) => !n.endsWith('-bold'))) {
      expect(names, `${name}-bold`).toContain(`${name}-bold`)
    }
  })

  it('すべてのショートカットが、実際のフォントサイズ・行間・字間・太さの宣言に展開される', async () => {
    const names = shortcutsOf().map(([name]) => name)
    const { css, matched } = await generate([presetMini(), presetLiftKit({ injectVars: false })], names.join(' '))
    expect([...matched].sort()).toEqual([...names].sort())
    for (const name of names) {
      const rule = css.split('\n').find((line) => line.startsWith(`.${name}{`))
      expect(rule, name).toBeDefined()
      for (const property of ['font-size:', 'line-height:', 'letter-spacing:', 'font-weight:']) {
        expect(rule, `${name} の ${property}`).toContain(property)
      }
    }
  })

  it('24個すべてが、typography.css の同名クラスと font-size / line-height / letter-spacing / font-weight で一致する', async () => {
    const typographyCss = fs.readFileSync(path.resolve(import.meta.dirname, '../../theme-css/css/typography.css'), 'utf-8')
    const classes = parseTopLevelClasses(typographyCss)
    // タイポグラフィのクラス = font-size を持つクラス(weight-400・italic・mono などの補助クラスを除く)
    const typographyClasses = [...classes].filter(([, props]) => 'font-size' in props).map(([name]) => name)
    const names = shortcutsOf().map(([name]) => name)
    expect([...names].sort()).toEqual([...typographyClasses].sort())

    const { css } = await generate([presetMini(), presetLiftKit({ injectVars: false })], names.join(' '))
    const generated = new Map<string, Record<string, string>>()
    for (const line of css.split('\n')) {
      const match = /^\.([\w-]+)\{(.*)\}$/.exec(line)
      if (match) generated.set(match[1], parseDeclarations(match[2]))
    }

    // 生成側の取り出しが空振りして「何も比べていない」状態で通ることを防ぐ
    expect(generated.size).toBe(names.length)
    expect(classes.get('title2')).toMatchObject({ 'font-size': 'var(--title2-font-size)', 'font-weight': '400' })

    const compared = ['font-size', 'line-height', 'letter-spacing', 'font-weight']
    const mismatches: string[] = []
    for (const name of names) {
      for (const property of compared) {
        const fromShortcut = generated.get(name)?.[property]
        const fromCss = classes.get(name)?.[property]
        if (fromShortcut === undefined || fromShortcut !== fromCss) {
          mismatches.push(`${name} ${property}: shortcut=${fromShortcut} typography.css=${fromCss}`)
        }
      }
    }
    expect(mismatches).toEqual([])
  })

  it('capline だけは大文字化(text-transform: uppercase)し、字間が正になる(presetWind4 で確認)', async () => {
    // presetMini には uppercase ユーティリティが無く、ショートカット内の uppercase が黙って捨てられる。
    // 大文字化まで確かめるには presetWind4(playground と同じ構成)を使う
    const { css } = await generate([presetWind4(), presetLiftKit({ injectVars: false })], 'capline capline-bold body')
    const rule = (name: string) => css.split('\n').find((line) => line.startsWith(`.${name}{`))!
    for (const name of ['capline', 'capline-bold']) {
      expect(rule(name), name).toContain('text-transform:uppercase;')
      expect(rule(name), name).toContain('letter-spacing:0.0618em;')
    }
    expect(rule('body')).not.toContain('text-transform')
    expect(rule('body')).toContain('letter-spacing:-0.011em;')
  })
})

describe('他のプリセットとの組み合わせ', () => {
  it('presetMini と併用すると、色・余白・角丸・ガター・影が LiftKit のトークンを指す', async () => {
    const { css } = await generate(
      [presetMini(), presetLiftKit({ injectVars: false })],
      'bg-primary text-onsurface border-outline p-md gap-xs rounded-lg shadow-md',
    )
    expect(css).toContain('.bg-primary{background-color:var(--lk-primary);}')
    expect(css).toContain('.text-onsurface{color:var(--lk-onsurface);}')
    expect(css).toContain('.border-outline{border-color:var(--lk-outline);}')
    expect(css).toContain('.p-md{padding:var(--lk-size-md);}')
    expect(css).toContain('.gap-xs{gap:var(--lk-size-xs);}')
    expect(css).toContain('.rounded-lg{border-radius:var(--lk-size-lg);}')
    expect(css).toContain('--un-shadow:var(--lk-shadow-md);')
  })

  it('presetWind4(playground と同じ構成)でも色とタイポグラフィのショートカットが LiftKit の変数を指す', async () => {
    const { css } = await generate(
      [presetWind4(), presetLiftKit({ injectVars: false })],
      'bg-primary text-sm display1 body',
    )
    expect(css).toContain('var(--lk-primary)')
    expect(css).toContain('.text-sm{font-size:var(--lk-size-sm);}')
    expect(css).toMatch(/\.display1\{font-size:var\(--display1-font-size\);/)
    expect(css).toMatch(/\.body\{font-size:1em;/)
  })
})
