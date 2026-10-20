import { describe, it, expect, expectTypeOf } from 'vitest'
import { propsToDataAttrs } from '../../src/utils/utilities'

describe('propsToDataAttrs', () => {
  it('キーを kebab-case にして data-lk-<base>-<key> の形に変換する(base はそのまま使い、props が空なら空)', () => {
    expect(propsToDataAttrs({ variant: 'fill', startIcon: 'plus', opticIconShift: true }, 'button')).toEqual({
      'data-lk-button-variant': 'fill',
      'data-lk-button-start-icon': 'plus',
      'data-lk-button-optic-icon-shift': 'true',
    })
    expect(propsToDataAttrs({ size: 'sm' }, 'select-trigger')).toEqual({ 'data-lk-select-trigger-size': 'sm' })
    expect(propsToDataAttrs({}, 'icon')).toEqual({})
  })

  it('値は必ず文字列にする(false・0・空文字も落とさない)', () => {
    const result = propsToDataAttrs({ disabled: false, count: 0, label: '', ratio: 1.618, big: 10n }, 'x')
    expect(result).toEqual({
      'data-lk-x-disabled': 'false',
      'data-lk-x-count': '0',
      'data-lk-x-label': '',
      'data-lk-x-ratio': '1.618',
      'data-lk-x-big': '10',
    })
    expect(Object.values(result).every((value) => typeof value === 'string')).toBe(true)
    expectTypeOf(result).toEqualTypeOf<Record<string, string>>()
  })

  it('undefined・null・関数・オブジェクト・配列は出力しない', () => {
    const result = propsToDataAttrs(
      {
        a: undefined,
        b: null,
        c: () => 'fn',
        d: { nested: 1 },
        e: [1, 2],
        keep: 'yes',
      },
      'card',
    )
    expect(result).toEqual({ 'data-lk-card-keep': 'yes' })
  })

  it('連続する大文字は区切らず、小文字→大文字の境目だけにハイフンを入れる', () => {
    const result = propsToDataAttrs({ fooBarBaz: 1, URLValue: 2, aB: 3 }, 'x')
    expect(Object.keys(result)).toEqual(['data-lk-x-foo-bar-baz', 'data-lk-x-urlvalue', 'data-lk-x-a-b'])
  })

  it('入力を書き換えず、キーの並びを保つ', () => {
    const props = { zeta: 1, alpha: 2, mid: 3 }
    const snapshot = { ...props }
    const result = propsToDataAttrs(props, 'x')
    expect(props).toEqual(snapshot)
    expect(Object.keys(result)).toEqual(['data-lk-x-zeta', 'data-lk-x-alpha', 'data-lk-x-mid'])
  })
})
