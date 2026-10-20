// ?raw で型定義ファイルを文字列として読む(Node の fs に依存しない。型は vite/client が提供する)
import lkColorTypes from '../../src/types/lk-color.d.ts?raw'

/**
 * src/types/lk-color.d.ts から、型エイリアス(ユニオン)のリテラル一覧を取り出す。
 * 型と実行時のリスト(LkColors など)がずれていないかを確かめるために使う。
 */
export function readColorTypeUnion(name: string): string[] {
  const text = lkColorTypes
  const start = text.indexOf(`type ${name} =`)
  if (start < 0) throw new Error(`type ${name} が lk-color.d.ts に見つからない`)
  const body = text.slice(start + `type ${name} =`.length)
  // 次のドキュメントコメント・次の type 宣言・グローバル宣言の終わりまでが、このユニオン
  const end = body.search(/\/\*\*|\n\s*type\s|\n\}/)
  const chunk = end === -1 ? body : body.slice(0, end)
  return [...chunk.matchAll(/"([^"]+)"/g)].map((m) => m[1])
}
