import { describe, it, expect, expectTypeOf } from 'vitest'
import { getColorsWithoutOnTokens, getOnToken } from '../../src/utils/colorUtils'
import { LkColors, LkColorsWithOnTokens } from '../../src/utils/debugUtils'
import { readColorTypeUnion } from '../helpers/typeUnion'

describe('getColorsWithoutOnTokens', () => {
  it('LkColors の部分集合で、重複がなく、元の並び順を保つ', () => {
    const result = getColorsWithoutOnTokens()
    expect(new Set(result).size).toBe(result.length)
    const indexes = result.map((color) => LkColors.indexOf(color))
    expect(indexes.every((i) => i >= 0)).toBe(true)
    expect(indexes).toEqual([...indexes].sort((a, b) => a - b))
  })

  it('on トークンを持つ基本色は含まず、on 系・shadow・scrim・outline などは含む', () => {
    const result = getColorsWithoutOnTokens()
    for (const color of ['primary', 'primarycontainer', 'surface', 'surfacecontainer', 'inversesurface', 'background', 'primaryfixed'] as LkColor[]) {
      expect(result, `${color} は含まれない`).not.toContain(color)
    }
    for (const color of ['onprimary', 'onsurface', 'inverseonsurface', 'shadow', 'scrim', 'outline', 'outlinevariant', 'surfacedim', 'surfacebright'] as LkColor[]) {
      expect(result, `${color} は含まれる`).toContain(color)
    }
  })

  it('debugUtils の LkColorsWithOnTokens に載る色はすべて除外される(2つのリストの食い違い検出)', () => {
    const result = getColorsWithoutOnTokens()
    for (const color of LkColorsWithOnTokens) {
      expect(result, `${color} は除外されるはず`).not.toContain(color)
    }
  })

  it('呼ぶたびに新しい配列を返し、LkColors 自体を書き換えない', () => {
    const before = [...LkColors]
    const first = getColorsWithoutOnTokens()
    first.push('primary')
    const second = getColorsWithoutOnTokens()
    expect(second).not.toBe(first)
    expect(second).not.toContain('primary')
    expect(LkColors).toEqual(before)
    expectTypeOf(second).toEqualTypeOf<LkColor[]>()
  })
})

describe('getOnToken', () => {
  it('通常の色には on を前置する(コンテナ・状態色も同じ)', () => {
    const cases: Array<[LkColor, string]> = [
      ['primary', 'onprimary'],
      ['primarycontainer', 'onprimarycontainer'],
      ['secondary', 'onsecondary'],
      ['tertiarycontainer', 'ontertiarycontainer'],
      ['error', 'onerror'],
      ['success', 'onsuccess'],
      ['warningcontainer', 'onwarningcontainer'],
      ['info', 'oninfo'],
      ['background', 'onbackground'],
      ['surface', 'onsurface'],
      ['surfacevariant', 'onsurfacevariant'],
    ]
    for (const [token, expected] of cases) {
      expect(getOnToken(token), token).toBe(expected)
    }
  })

  it('surface 系のコンテナ・dim・bright は onsurface に集約され、inverse 系・outline 系・shadow/scrim は個別の対応を持つ', () => {
    const tokens: LkColor[] = [
      'surfacecontainerlowest', 'surfacecontainerlow', 'surfacecontainer',
      'surfacecontainerhigh', 'surfacecontainerhighest', 'surfacedim', 'surfacebright',
    ]
    expect(tokens.map((t) => getOnToken(t))).toEqual(tokens.map(() => 'onsurface'))
    expect(getOnToken('inversesurface')).toBe('inverseonsurface')
    expect(getOnToken('inverseonsurface')).toBe('inversesurface')
    expect(getOnToken('inverseprimary')).toBe('onprimarycontainer')
    expect(getOnToken('outline')).toBe('onsurfacevariant')
    expect(getOnToken('outlinevariant')).toBe('onsurfacevariant')
    expect(getOnToken('shadow')).toBe('white')
    expect(getOnToken('scrim')).toBe('white')
  })

  it('fixed 系: fixed ⇄ onfixed、fixeddim → onfixedvariant の対応を3つの色で保つ', () => {
    for (const role of ['primary', 'secondary', 'tertiary']) {
      expect(getOnToken(`${role}fixed` as LkColor), `${role}fixed`).toBe(`on${role}fixed`)
      expect(getOnToken(`on${role}fixed` as LkColor), `on${role}fixed`).toBe(`${role}fixed`)
      expect(getOnToken(`${role}fixeddim` as LkColor), `${role}fixeddim`).toBe(`on${role}fixedvariant`)
    }
  })

  it('on トークンを渡すと on を外した色が返る', () => {
    expect(getOnToken('onprimary')).toBe('primary')
    expect(getOnToken('oninfocontainer')).toBe('infocontainer')
    expect(getOnToken('onsurfacevariant')).toBe('surfacevariant')
  })

  it('既知の例外: LkColors に無い値を返すのは shadow/scrim(white) と on*fixedvariant だけ', () => {
    // on*fixedvariant は "on" を外すだけで "*fixedvariant" になり、LkColors に存在しない色名を返す。
    // 現状の挙動をそのまま固定している。実装を直したときはこのテストも意図的に更新すること。
    const outside = LkColors.filter((color) => !LkColors.includes(getOnToken(color) as LkColor))
    expect(outside.sort()).toEqual([
      'onprimaryfixedvariant',
      'onsecondaryfixedvariant',
      'ontertiaryfixedvariant',
      'scrim',
      'shadow',
    ])
    expect(getOnToken('onprimaryfixedvariant')).toBe('primaryfixedvariant')
  })

  it('型の LkColorWithOnToken の各色は、型の LkOnColor に含まれる on トークンへ対応する', () => {
    const withOn = readColorTypeUnion('LkColorWithOnToken').filter((token) => token !== 'transparent')
    const onColors = readColorTypeUnion('LkOnColor')
    expect(withOn.length).toBeGreaterThan(0)
    for (const token of withOn) {
      expect(onColors, `${token} → ${getOnToken(token as LkColor)}`).toContain(getOnToken(token as LkColor))
    }
  })

  it('想定外の入力でも例外を投げず、規則どおりに変換する', () => {
    expect(getOnToken('' as LkColor)).toBe('on')
    expect(getOnToken('foo' as LkColor)).toBe('onfoo')
    expect(getOnToken('onfoo' as LkColor)).toBe('foo')
  })
})
