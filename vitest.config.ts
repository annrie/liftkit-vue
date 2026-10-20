import { defineConfig } from 'vitest/config'

// モノレポ全体のテストをルートから一括で実行する(`pnpm test`)。
// - 配置: パッケージ固有のテストは packages/<pkg>/test/ 、パッケージをまたぐ整合性テストはルートの test/ に置く。
//   どちらも `*.test.ts`。
// - 既定は node 環境(純粋ロジック用。高速)。DOM が必要なテストだけ、ファイル先頭に
//   `// @vitest-environment happy-dom` を付けて opt-in する。
// - Vue の SFC(.vue)はここでは読み込まない(@vitejs/plugin-vue はルートの依存にしない)。
//   コンポーネントのテストが必要になったら、plugin-vue の追加を別途判断すること。
export default defineConfig({
  test: {
    environment: 'node',
    // CSS を `?raw` で文字列として読むテスト(トークン名の整合性確認)のため、対象の CSS だけ処理対象にする。
    // 既定では CSS は空文字に置き換えられる
    css: { include: [/liftkit-tokens\.css/] },
    include: ['packages/*/test/**/*.{test,spec}.ts', 'test/**/*.{test,spec}.ts'],
    server: {
      deps: {
        // @material/material-color-utilities 0.4.0 の ESM は拡張子なしの相対 import を含み、
        // Node の ESM ローダーでは解決できない("Cannot find module .../dynamic_scheme")。
        // Vite に変換させて解決するため、外部化せずインライン化する。
        inline: ['@material/material-color-utilities', 'material-dynamic-colors'],
      },
    },
  },
})
