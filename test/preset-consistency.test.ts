import { describe, it, expect } from 'vitest'
import { presetLiftKit } from '../packages/preset-unocss/src/index'
import { LkColors } from '../packages/core/src/utils/debugUtils'

// パッケージをまたぐ整合性テスト。単体のテストでは見つけられない「パッケージ間のずれ」を検出する。
// - preset-unocss が公開する色 ⇔ core の色トークン(LkColors)
// - preset-unocss が参照する CSS 変数 ⇔ preset が注入する theme-css が定義する CSS 変数

const preset = presetLiftKit()
const colors = (preset.theme as { colors: Record<string, string> }).colors

/** プリセットが注入する CSS(theme-css の liftkit-core.css + typography.css)*/
async function injectedCss() {
  return (await preset.preflights![0].getCSS({} as never)) as string
}

const definedVars = (css: string) => new Set([...css.matchAll(/(--[\w-]+)\s*:/g)].map((m) => m[1]))
const referencedVars = (text: string) => new Set([...text.matchAll(/var\((--[\w-]+)/g)].map((m) => m[1]))

describe('preset-unocss ⇔ core: 色トークン', () => {
  it('preset の色キーは、すべて core の LkColors に存在する(余計な色がない)', () => {
    const unknown = Object.keys(colors).filter((key) => !LkColors.includes(key as LkColor))
    expect(unknown).toEqual([])
  })

  it('core の色トークンのうち preset に無いのは fixed 系だけ(新しい色を足したら preset にも足す)', () => {
    const missing = LkColors.filter((token) => !(token in colors))
    expect(missing.length).toBeGreaterThan(0)
    expect(missing.filter((token) => !token.includes('fixed'))).toEqual([])
  })
})

describe('preset-unocss ⇔ theme-css: CSS 変数', () => {
  it('preset が参照する var(--…) は、注入される CSS の中で必ず定義されている', async () => {
    const defined = definedVars(await injectedCss())
    expect(defined.size).toBeGreaterThan(100)

    // テーマ(色・余白・角丸・影)とショートカットの文字列から参照を集める
    const fromTheme = referencedVars(JSON.stringify(preset.theme))
    const fromShortcuts = referencedVars(JSON.stringify(preset.shortcuts))
    // rules は [正規表現, 関数] の組なので、実際にクラス名を当てはめて出力の参照を集める
    const sizes = ['3xs', '2xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl']
    const steps = ['eighthstep', 'quarterstep', 'halfstep', 'wholestep']
    const classes = [...sizes.map((s) => `text-${s}`), ...steps.map((s) => `leading-${s}`)]
    const fromRules = new Set<string>()
    for (const className of classes) {
      const outputs = (preset.rules ?? []).flatMap((rule) => {
        const [pattern, handler] = rule as [RegExp, (match: RegExpExecArray) => Record<string, string>]
        const match = pattern.exec(className)
        return match ? [handler(match)] : []
      })
      expect(outputs, `${className} にマッチするルール`).toHaveLength(1)
      referencedVars(JSON.stringify(outputs[0])).forEach((name) => fromRules.add(name))
    }

    const referenced = new Set([...fromTheme, ...fromShortcuts, ...fromRules])
    expect(referenced.size).toBeGreaterThan(60)
    const undefinedVars = [...referenced].filter((name) => !defined.has(name)).sort()
    expect(undefinedVars).toEqual([])
  })
})
