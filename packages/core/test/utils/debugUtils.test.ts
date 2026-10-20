import { describe, it, expect } from 'vitest'
import { LkColors, LkColorsWithOnTokens } from '../../src/utils/debugUtils'
import { getColorsWithoutOnTokens, getOnToken } from '../../src/utils/colorUtils'
import { readColorTypeUnion } from '../helpers/typeUnion'

describe('LkColors', () => {
  it('重複がなく、すべて小文字英字のトークン名で、型だけの特別値 "transparent" は含まない', () => {
    expect(new Set(LkColors).size).toBe(LkColors.length)
    expect(LkColors.every((color) => /^[a-z]+$/.test(color))).toBe(true)
    expect(LkColors).not.toContain('transparent')
  })

  it('型 LkColor から "transparent" を除いた集合と一致する(型と実行時リストのずれ検出)', () => {
    const typeTokens = readColorTypeUnion('LkColor').filter((token) => token !== 'transparent')
    expect(typeTokens.length).toBeGreaterThan(0)
    expect([...LkColors].sort()).toEqual([...typeTokens].sort())
  })
})

describe('LkColorsWithOnTokens', () => {
  it('LkColors の部分集合で重複がなく、各色の on トークンも LkColors に存在する', () => {
    expect(new Set(LkColorsWithOnTokens).size).toBe(LkColorsWithOnTokens.length)
    for (const color of LkColorsWithOnTokens) {
      expect(LkColors, color).toContain(color)
      expect(color.startsWith('on'), `${color} は on トークンではない`).toBe(false)
      expect(LkColors, `${color} の on トークン`).toContain(getOnToken(color))
    }
  })

  it('getColorsWithoutOnTokens() とは互いに素(同じ色が両方に入らない)', () => {
    const without = new Set(getColorsWithoutOnTokens())
    expect(LkColorsWithOnTokens.filter((color) => without.has(color))).toEqual([])
  })
})

// ---- 「on トークンを持つ色」の一覧は3か所で別々に定義されている ------------------
//  (1) debugUtils.ts の LkColorsWithOnTokens(公開。22色)
//  (2) colorUtils.ts 内部のリスト(26色)。公開 API では getColorsWithoutOnTokens() の補集合として現れる
//  (3) lk-color.d.ts の型 LkColorWithOnToken(transparent を除いて23色)
// 3つは現在一致していない。下のテストは「その食い違いの現状」を固定しているだけで、仕様ではない。
// 実装を揃えたときは、このテストを消して、下の it.todo を実テストにすること。
describe('on トークンを持つ色の一覧: 3つの定義の食い違い(現状の固定であり仕様ではない)', () => {
  const sorted = (list: Iterable<string>) => [...list].sort()
  const minus = (a: Iterable<string>, b: Iterable<string>) => sorted([...a].filter((x) => !new Set(b).has(x)))

  const withoutOn = getColorsWithoutOnTokens()
  const colorUtilsList = LkColors.filter((color) => !withoutOn.includes(color)) // (2)
  const publicList = LkColorsWithOnTokens // (1)
  const typeList = readColorTypeUnion('LkColorWithOnToken').filter((token) => token !== 'transparent') // (3)

  it('件数: 公開リスト 22 / 内部リスト 26 / 型 23', () => {
    expect([publicList.length, colorUtilsList.length, typeList.length]).toEqual([22, 26, 23])
  })

  it('内部リストだけが持つ色 = 公開リストに無い4色、型に無い3色(fixed 系)。逆方向の差はない', () => {
    expect(minus(colorUtilsList, publicList)).toEqual(['primaryfixed', 'secondaryfixed', 'surfacecontainer', 'tertiaryfixed'])
    expect(minus(colorUtilsList, typeList)).toEqual(['primaryfixed', 'secondaryfixed', 'tertiaryfixed'])
    expect(minus(publicList, colorUtilsList)).toEqual([])
    expect(minus(typeList, colorUtilsList)).toEqual([])
  })

  it('公開リストと型の差は surfacecontainer の1色だけ(公開リストに無い)', () => {
    expect(minus(typeList, publicList)).toEqual(['surfacecontainer'])
    expect(minus(publicList, typeList)).toEqual([])
  })

  it('公開リストと getColorsWithoutOnTokens() の和集合は全色を覆わず、4色がどちらにも入らない', () => {
    const covered = new Set([...publicList, ...withoutOn])
    expect(sorted(LkColors.filter((color) => !covered.has(color)))).toEqual([
      'primaryfixed',
      'secondaryfixed',
      'surfacecontainer',
      'tertiaryfixed',
    ])
  })

  // 本来満たすべき不変条件(未達。揃えたら実テストにする)
  it.todo('公開リスト LkColorsWithOnTokens と、colorUtils 内部のリスト(getColorsWithoutOnTokens の補集合)が一致する')
  it.todo('型 LkColorWithOnToken(transparent を除く)と公開リスト LkColorsWithOnTokens の集合が一致する')
  it.todo('LkColorsWithOnTokens と getColorsWithoutOnTokens() の和集合が LkColors 全体を覆い、互いに素である')
})
