// @vitest-environment happy-dom
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { Hct, argbFromHex } from '@material/material-color-utilities'
import {
  provideTheme,
  useTheme,
  type PaletteState,
  type ThemeContext,
  type ThemeState,
} from '../../src/composables/useTheme'
import { LkColors } from '../../src/utils/debugUtils'
// ?raw で CSS を文字列として読む(Node の fs に依存しない。型は vite/client が提供する)
import tokensCss from '../../src/css/liftkit-tokens.css?raw'

// ---- テスト用の道具 ---------------------------------------------------------

const mounted: VueWrapper[] = []

/** provideTheme() を呼ぶルートと、useTheme() を呼ぶ子をマウントする */
function mountTheme(initialPalette?: Partial<PaletteState>) {
  let ctx!: ThemeContext
  let childCtx!: ThemeContext
  let initialTheme = ''

  const Child = defineComponent({
    setup() {
      childCtx = useTheme()
      return () => h('i')
    },
  })
  const Root = defineComponent({
    setup() {
      ctx = provideTheme(initialPalette)
      // onMounted(= パレットから生成) より前の、素の既定値を控えておく
      initialTheme = JSON.stringify(ctx.theme.value)
      return () => h('div', [h(Child)])
    },
  })
  const wrapper = mount(Root)
  mounted.push(wrapper)
  return { wrapper, ctx, childCtx, initialTheme }
}

/** window.matchMedia('(prefers-color-scheme: dark)') を差し替え、OS 設定の変更を再現できるようにする */
function installMatchMedia(initialDark: boolean) {
  let dark = initialDark
  const listeners = new Set<(event: unknown) => void>()
  const mediaQueryList = {
    get matches() {
      return dark
    },
    media: '(prefers-color-scheme: dark)',
    addEventListener: vi.fn((_type: string, listener: (event: unknown) => void) => {
      listeners.add(listener)
    }),
    removeEventListener: vi.fn((_type: string, listener: (event: unknown) => void) => {
      listeners.delete(listener)
    }),
  }
  const original = window.matchMedia
  window.matchMedia = vi.fn(() => mediaQueryList) as unknown as typeof window.matchMedia
  return {
    mediaQueryList,
    listenerCount: () => listeners.size,
    setSystemDark(value: boolean) {
      dark = value
      listeners.forEach((listener) => listener({ matches: value }))
    },
    restore() {
      window.matchMedia = original
    },
  }
}

/** '#rrggbb' の HCT 上の明度(tone)。生成された色が狙いの明度に収まっているかの確認に使う */
function toneOf(hex: string) {
  return Hct.fromInt(argbFromHex(hex)).tone
}

function cssVar(name: string) {
  return document.documentElement.style.getPropertyValue(name)
}

let media: ReturnType<typeof installMatchMedia>

beforeEach(() => {
  media = installMatchMedia(false)
})

afterEach(() => {
  while (mounted.length) mounted.pop()!.unmount()
  media.restore()
  document.documentElement.removeAttribute('style')
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

// ---- provide / inject ------------------------------------------------------

describe('provideTheme / useTheme', () => {
  it('子の useTheme() は、ルートが provide したのと同じ context を返す', () => {
    const { ctx, childCtx } = mountTheme()
    expect(childCtx).toBe(ctx)
  })

  it('provide されていない場所の useTheme() は、分かりやすいエラーで失敗する', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})
    expect(() => useTheme()).toThrow('useTheme() must be used inside a component wrapped with provideTheme()')
  })

  it('初期パレットは既定値に、渡した分だけを上書きしてマージする', () => {
    const { ctx } = mountTheme({ primary: '#ff0000' })
    expect(ctx.palette.value.primary).toBe('#ff0000')
    expect(ctx.palette.value.secondary).toBe('#badcff')
    expect(ctx.palette.value.neutral).toBe('#000000')
    expect(ctx.colorModePreference.value).toBe('auto')
  })

  it('インスタンス間で既定値のオブジェクトを共有しない', () => {
    const a = mountTheme()
    a.ctx.palette.value.primary = '#00ff00'
    const b = mountTheme()
    // b の素の既定値は、a が書き換えた後でも元のまま
    expect(b.ctx.palette.value.primary).toBe('#035eff')
    expect(JSON.parse(b.initialTheme).light.primary).toBe('#004ee7')
  })
})

// ---- テーマ(トーン)の生成 -------------------------------------------------

describe('パレットからのテーマ生成', () => {
  it('マウント時に既定パレットから生成し、ライトは tone 40、ダークは tone 80 付近の primary になる', () => {
    const { ctx } = mountTheme()
    const { light, dark } = ctx.theme.value
    expect(light.primary).not.toBe('#004ee7') // 既定の固定値ではなく、パレットから作り直した値
    expect(Math.abs(toneOf(light.primary) - 40)).toBeLessThan(1.5)
    expect(Math.abs(toneOf(dark.primary) - 80)).toBeLessThan(1.5)
    expect(Math.abs(toneOf(light.onPrimary) - 98)).toBeLessThan(1.5)
    expect(Math.abs(toneOf(dark.onPrimary) - 20)).toBeLessThan(1.5)
    for (const hex of [light.primary, dark.primary, light.surface, dark.surface]) {
      expect(hex).toMatch(/^#[0-9a-f]{6}$/)
    }
  })

  it('役割ごとのトークン: primary は inversePrimary、secondary/tertiary は Fixed、状態色は Fixed なし', () => {
    const { ctx } = mountTheme()
    const { light, dark } = ctx.theme.value
    for (const mode of [light, dark]) {
      expect(mode.inversePrimary).toMatch(/^#/)
      for (const role of ['primary', 'secondary', 'tertiary']) {
        const Role = role[0].toUpperCase() + role.slice(1)
        for (const key of [`${role}Fixed`, `${role}FixedDim`, `on${Role}Fixed`, `on${Role}FixedVariant`]) {
          expect(mode[key], key).toMatch(/^#[0-9a-f]{6}$/)
        }
      }
      for (const role of ['error', 'warning', 'success', 'info']) {
        const Role = role[0].toUpperCase() + role.slice(1)
        for (const key of [role, `on${Role}`, `${role}Container`, `on${Role}Container`]) {
          expect(mode[key], key).toMatch(/^#[0-9a-f]{6}$/)
        }
        expect(mode[`${role}Fixed`], `${role}Fixed`).toBeUndefined()
      }
    }
  })

  it('neutral は surface 系、neutralvariant は outline 系を作り、ライトとダークで明るさが逆転する', () => {
    const { ctx } = mountTheme()
    const { light, dark } = ctx.theme.value
    expect(light.surfaceContainerLowest).toBe('white')
    expect(Math.abs(toneOf(light.background) - 99)).toBeLessThan(1.5)
    expect(Math.abs(toneOf(dark.background) - 10)).toBeLessThan(1.5)
    expect(toneOf(light.surface)).toBeGreaterThan(toneOf(dark.surface))
    expect(toneOf(light.onSurface)).toBeLessThan(toneOf(dark.onSurface))
    expect(Math.abs(toneOf(light.outline) - 60)).toBeLessThan(1.5)
    expect(Math.abs(toneOf(dark.outline) - 50)).toBeLessThan(1.5)
  })

  it('パレットに無い名前のキーは、既定の4トークン(キー・on・Container・onContainer)になる', async () => {
    const { ctx } = mountTheme()
    await ctx.updateTheme({ ...ctx.palette.value, brand: '#ff8800' })
    const { light, dark } = ctx.theme.value
    for (const mode of [light, dark]) {
      for (const key of ['brand', 'onBrand', 'brandContainer', 'onBrandContainer']) {
        expect(mode[key], key).toMatch(/^#[0-9a-f]{6}$/)
      }
    }
    expect(Math.abs(toneOf(light.brand) - 40)).toBeLessThan(1.5)
    expect(Math.abs(toneOf(dark.brand) - 80)).toBeLessThan(1.5)
  })

  it('一部のキーだけで updateTheme すると、他のトークンは変えない', async () => {
    const { ctx } = mountTheme()
    const before: ThemeState = JSON.parse(JSON.stringify(ctx.theme.value))
    await ctx.updateTheme({ primary: '#e91e63' } as PaletteState)
    const after = ctx.theme.value
    expect(after.light.primary).not.toBe(before.light.primary)
    expect(after.light.secondary).toBe(before.light.secondary)
    expect(after.dark.surface).toBe(before.dark.surface)
    expect(after.light.error).toBe(before.light.error)
  })

  it('不正な色の updateTheme は reject し、テーマを一部だけ書き換えることはない', async () => {
    const { ctx } = mountTheme()
    const before = JSON.stringify(ctx.theme.value)
    await expect(ctx.updateTheme({ primary: '#e91e63', secondary: 'not-a-color' } as PaletteState)).rejects.toThrow()
    expect(JSON.stringify(ctx.theme.value)).toBe(before)
  })

  it('palette のプロパティを書き換えると、次の tick でテーマが作り直される', async () => {
    const { ctx } = mountTheme()
    const before = ctx.theme.value.light.primary
    ctx.palette.value.primary = '#00a050'
    await nextTick()
    expect(ctx.theme.value.light.primary).not.toBe(before)
    expect(Math.abs(toneOf(ctx.theme.value.light.primary) - 40)).toBeLessThan(1.5)
  })
})

// ---- カラーモード -----------------------------------------------------------

describe('カラーモード', () => {
  it('auto のあいだは OS の設定(ライト/ダーク)に従う', () => {
    media.restore()
    media = installMatchMedia(true)
    const dark = mountTheme()
    expect(dark.ctx.colorModePreference.value).toBe('auto')
    expect(dark.ctx.colorMode.value).toBe('dark')

    media.restore()
    media = installMatchMedia(false)
    const light = mountTheme()
    expect(light.ctx.colorMode.value).toBe('light')
  })

  it('setColorMode で OS 設定を上書きでき、auto に戻すと OS 設定に戻る', () => {
    media.restore()
    media = installMatchMedia(true)
    const { ctx } = mountTheme()

    ctx.setColorMode('light')
    expect(ctx.colorModePreference.value).toBe('light')
    expect(ctx.colorMode.value).toBe('light')

    ctx.setColorMode('dark')
    expect(ctx.colorMode.value).toBe('dark')

    media.setSystemDark(false)
    ctx.setColorMode('auto')
    expect(ctx.colorModePreference.value).toBe('auto')
    expect(ctx.colorMode.value).toBe('light')
  })

  it('OS 設定の変更に追従するのは auto のときだけ', () => {
    const { ctx } = mountTheme()
    expect(ctx.colorMode.value).toBe('light')

    media.setSystemDark(true)
    expect(ctx.colorMode.value).toBe('dark')

    ctx.setColorMode('light')
    media.setSystemDark(true)
    media.setSystemDark(false)
    media.setSystemDark(true)
    expect(ctx.colorMode.value).toBe('light')
  })

  it('アンマウントで OS 設定のリスナーを外す', () => {
    const { wrapper, ctx } = mountTheme()
    expect(media.listenerCount()).toBe(1)
    expect(media.mediaQueryList.addEventListener).toHaveBeenCalledWith('change', expect.any(Function))

    wrapper.unmount()
    mounted.splice(mounted.indexOf(wrapper), 1)
    expect(media.listenerCount()).toBe(0)

    media.setSystemDark(true)
    expect(ctx.colorMode.value).toBe('light')
  })
})

// ---- CSS 変数への反映 ------------------------------------------------------

describe('CSS 変数への反映', () => {
  it('マウント後、ライトとダークの全トークンが :root に --light__*_lkv / --dark__*_lkv として入る(キーは小文字)', async () => {
    const { ctx } = mountTheme()
    await nextTick()
    const { light, dark } = ctx.theme.value

    expect(cssVar('--light__primary_lkv')).toBe(light.primary)
    expect(cssVar('--dark__primary_lkv')).toBe(dark.primary)
    expect(cssVar('--light__onprimary_lkv')).toBe(light.onPrimary)
    expect(cssVar('--dark__surfacecontainerhighest_lkv')).toBe(dark.surfaceContainerHighest)
    for (const key of Object.keys(light)) {
      expect(cssVar(`--light__${key.toLowerCase()}_lkv`), key).not.toBe('')
    }
    for (const key of Object.keys(dark)) {
      expect(cssVar(`--dark__${key.toLowerCase()}_lkv`), key).not.toBe('')
    }
  })

  it('ダークモードでは --light__* にもダークの値が入り、ライトへ戻すと元に戻る', async () => {
    const { ctx } = mountTheme()
    await nextTick()
    const { light, dark } = ctx.theme.value
    expect(light.primary).not.toBe(dark.primary)

    ctx.setColorMode('dark')
    await nextTick()
    expect(cssVar('--light__primary_lkv')).toBe(dark.primary)
    expect(cssVar('--dark__primary_lkv')).toBe(dark.primary)

    ctx.setColorMode('light')
    await nextTick()
    expect(cssVar('--light__primary_lkv')).toBe(light.primary)
    expect(cssVar('--dark__primary_lkv')).toBe(dark.primary)
  })

  it('パレットを変えると CSS 変数も新しい色に更新される', async () => {
    const { ctx } = mountTheme()
    await nextTick()
    const before = cssVar('--light__primary_lkv')

    ctx.palette.value.primary = '#00a050'
    await nextTick()
    await nextTick()
    expect(cssVar('--light__primary_lkv')).toBe(ctx.theme.value.light.primary)
    expect(cssVar('--light__primary_lkv')).not.toBe(before)
  })
})

// ---- 元になる1色からの生成 -------------------------------------------------

describe('updateThemeFromMaster', () => {
  it('1色から primary/secondary/tertiary/neutral と情報系3色を作り、他のパレット値は残す', async () => {
    const { ctx } = mountTheme()
    const before = { ...ctx.palette.value }
    await ctx.updateThemeFromMaster('#6750a4')

    const after = ctx.palette.value
    for (const key of ['primary', 'secondary', 'tertiary', 'neutral', 'info', 'warning', 'success']) {
      expect(after[key], key).toMatch(/^#[0-9a-f]{6}$/i)
      expect(after[key], `${key} が変わっている`).not.toBe(before[key])
    }
    expect(after.neutralvariant).toBe(before.neutralvariant)
    expect(after.error).toBe(before.error)

    // パレットの変更は watch 経由でテストにも反映される
    await nextTick()
    expect(Math.abs(toneOf(ctx.theme.value.light.primary) - 40)).toBeLessThan(1.5)
  })

  it('解釈できない色を渡すと console.error に出し、パレットは変えない', async () => {
    const { ctx } = mountTheme()
    const before = { ...ctx.palette.value }
    // material-dynamic-colors は #rrggbb 以外の文字列を「画像の URL」とみなして fetch する。
    // テスト中に実際のネットワークへ出ないよう、fetch を失敗する偽物に差し替える
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    await ctx.updateThemeFromMaster('definitely-not-a-color')
    expect(error).toHaveBeenCalled()
    expect(ctx.palette.value).toEqual(before)
  })
})

// ---- core の CSS(liftkit-tokens.css)との整合 -------------------------------

describe('core の CSS との整合', () => {
  it('CSS が参照する --light__*_lkv / --dark__*_lkv は、すべて useTheme が CSS 変数として出力するキーに存在する', async () => {
    const { ctx } = mountTheme()
    await nextTick()
    const refs = [...tokensCss.matchAll(/var\(--(light|dark)__([a-z]+)_lkv\)/g)]
    expect(refs.length).toBeGreaterThan(100)

    const missing = refs
      .filter(([, mode, key]) => cssVar(`--${mode}__${key}_lkv`) === '')
      .map(([ref]) => ref)
    expect(missing).toEqual([])
  })

  it('LkColors のすべての色に --lk-<色> が定義され、同じ名前の --light__ / --dark__ 変数を指す', () => {
    for (const token of LkColors) {
      expect(tokensCss, `--lk-${token}`).toContain(`--lk-${token}: var(--light__${token}_lkv);`)
      expect(tokensCss, `--lk-${token} (dark)`).toContain(`--lk-${token}: var(--dark__${token}_lkv);`)
    }
  })
})
