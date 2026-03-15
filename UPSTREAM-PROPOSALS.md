# LiftKit-Vue 改善提案 — Nuxt UI / Tailwind v4 互換性

**日付**: 2026-03-15
**発見元**: docustation プロジェクト（Docus 5 + Nuxt UI v4 + Tailwind v4）
**ステータス**: 提案

---

## 背景

LiftKit-Vue を Nuxt UI v4 + Tailwind v4 環境で使用した際、CSS カスケードの競合が多数発生。
`!important` オーバーライドや unscoped `<style>` の手動追加が必要となり、
LiftKit のデザイントークンの価値を活かしきれない状態になった。

根本原因を調査し、以下の改善を提案する。

---

## 提案1: liftkit-core.css の要素セレクタを分離

### 問題

`packages/core/src/css/liftkit-core.css` に含まれる要素レベルセレクタが、
Nuxt UI の `<UButton>`, `<UInput>` 等すべてのコンポーネントを上書きする。

**競合する要素セレクタ:**

```css
/* L494-498: 全要素のグローバルリセット */
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

/* L513-533: 全ボタンの外見を強制変更 */
button {
  display: inline-block;
  border: 1px solid rgba(0, 0, 0, 0);
  border-radius: 100em;
  overflow: hidden;
  padding: var(--button-padY) 1em;
  font-weight: 500;
  /* ... */
}

/* L471-477: html/body の背景色・テキスト色を強制 */
html, body {
  max-width: 100vw;
  color: var(--lk-onbackground);
  background: var(--lk-background);
}

/* L500-503: リンクの外見を強制 */
a {
  color: inherit;
  text-decoration: none;
}
```

### 影響

- Nuxt UI の `<UButton>` が `border-radius: 100em`（pill shape）に変形
- `overflow: hidden` により UButton のドロップダウンが切れる
- `padding: 0; margin: 0` が全要素に適用され、Tailwind ユーティリティが無効化
- `<a>` のスタイルリセットが Nuxt UI のリンクコンポーネントと競合

### 提案

`liftkit-core.css` を2つに分割:

```
liftkit-core.css  →  liftkit-tokens.css   （:root 変数のみ）
                  →  liftkit-reset.css    （要素セレクタ、リセット）
```

**liftkit-tokens.css**: `:root { ... }` + ダークモード変数切替のみ。安全にどの環境でも使える。

**liftkit-reset.css**: `*`, `button`, `body`, `a`, `html` の要素セレクタ。
LiftKit コンポーネントのみを使う環境向け。Nuxt UI 等の外部 UI フレームワーク使用時は読み込まない。

---

## 提案2: @liftkit-vue/nuxt モジュールに CSS 制御オプションを追加

### 問題

`packages/nuxt/src/module.ts` L14-15:

```ts
const coreCssPath = resolve(runtimeDir, '../../core/src/css/index.css')
nuxt.options.css.push(coreCssPath)
```

コア CSS を無条件で全注入しており、特定部分のみインポートする手段がない。

### 提案

モジュールオプションに CSS 制御を追加:

```ts
export interface ModuleOptions {
  /**
   * CSS インジェクション設定
   * - 'full': 全 CSS を注入（デフォルト、現在の動作）
   * - 'tokens': デザイントークン（変数）のみ
   * - 'none': CSS を注入しない（ユーザーが手動管理）
   */
  css?: 'full' | 'tokens' | 'none'

  /**
   * 要素リセット CSS を含めるか
   * false にすると *, button, body, a 等の要素セレクタを除外
   * Nuxt UI 等の外部 UI フレームワーク使用時は false 推奨
   */
  includeReset?: boolean

  /**
   * コンポーネントの自動インポートを有効化
   */
  components?: boolean
}
```

使用例:

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@liftkit-vue/nuxt'],
  liftkit: {
    css: 'tokens',        // デザイントークンのみ
    includeReset: false,   // Nuxt UI との競合を防止
    components: true,      // LiftKit コンポーネントは使用
  }
})
```

---

## 提案3: @layer lk-base のスコープ見直し

### 問題

`packages/theme-css/css/index.css` で全ユーティリティが `@layer lk-base` に包まれている:

```css
@layer lk-base {
    @import "./liftkit-core.css";    /* ← 要素リセットも含む */
    @import "./align-items.css";
    @import "./display.css";
    @import "./margins.css";
    @import "./padding.css";
    /* ... 35ファイル */
}
```

CSS Cascade Layers の仕様により:
- `@layer lk-base` 内のスタイルは、**レイヤー外**の Tailwind v4 ユーティリティより常に低優先度
- しかし `!important` 宣言は**逆転**: `@layer lk-base` 内の `!important` が Tailwind の `!important` に勝つ
- 2000+ のユーティリティクラスが Tailwind v4 の同名クラスと名前衝突の可能性

### 提案

A. **liftkit-core.css を @layer の外に出す**（変数定義はレイヤー不要）:

```css
/* 変数はレイヤー外で定義 */
@import "./liftkit-tokens.css";

@layer lk-base {
    /* ユーティリティクラスのみ */
    @import "./align-items.css";
    @import "./display.css";
    /* ... */
}
```

B. **Tailwind v4 環境では @layer lk-base を使わない選択肢を提供**:

```css
/* tailwind-compat モード: @layer なし、@theme + @utility のみ */
@import "./liftkit-tokens.css";

@theme { /* Tailwind v4 ブリッジ */ }
@utility display1 { /* タイポグラフィ */ }
```

---

## 提案4: npm パッケージの workspace:* 依存を修正

### 問題

`@liftkit-vue/nuxt@0.1.0`（npm 公開版）の `package.json`:

```json
{
  "dependencies": {
    "@liftkit-vue/core": "workspace:*"
  }
}
```

`workspace:*` はビルド時に解決されるべきだが、npm 公開版にそのまま含まれている。
結果、`pnpm add @liftkit-vue/nuxt` が `ERR_PNPM_WORKSPACE_PKG_NOT_FOUND` で失敗する。

### 提案

pnpm の `publishConfig` または `pnpm pack` / `pnpm publish` 時のプロトコル変換を確認。
`pnpm publish` は通常 `workspace:*` → `^0.1.0` に自動変換するが、
手動で `npm publish` した場合は変換されない。

**対応:**

```json
// packages/nuxt/package.json
{
  "dependencies": {
    "@liftkit-vue/core": "^0.1.0"
  }
}
```

または `pnpm -r publish` を使用して一括公開する。

---

## 提案5: Tailwind v4 互換パッケージの新設

### 問題

現在の `@liftkit-vue/theme-css` は:
- `@layer lk-base` でユーティリティを包む（Tailwind v4 と競合）
- `liftkit-core.css` の要素リセットを含む（UI フレームワークと競合）
- `@theme` + `@utility` は有用だが、競合部分と分離できない

### 提案

`@liftkit-vue/theme-tailwind` パッケージを新設（または theme-css にモード追加）:

```
@liftkit-vue/theme-tailwind
├── css/
│   ├── index.css          ← エントリーポイント
│   ├── tokens.css         ← :root 変数のみ（安全）
│   ├── theme.css          ← @theme セクション
│   └── utilities.css      ← @utility セクション
```

使用方法:

```css
/* main.css */
@import '@liftkit-vue/theme-tailwind';  /* 競合なし */
@import 'tailwindcss';
@import '@nuxt/ui';
```

---

## 優先度

| # | 提案 | 影響度 | 実装コスト | 優先度 |
|---|------|--------|-----------|--------|
| 1 | liftkit-core.css の分割 | 高 | 低 | **最優先** |
| 4 | npm workspace:* 修正 | 高 | 低 | **最優先** |
| 2 | Nuxt モジュール CSS オプション | 高 | 中 | 高 |
| 3 | @layer lk-base 見直し | 中 | 中 | 中 |
| 5 | Tailwind v4 互換パッケージ | 中 | 中 | 中 |

---

## docustation での暫定対応

上記提案が実装されるまでの間、docustation では以下の暫定対応を行っている:

1. `@import '@liftkit-vue/theme-css'` を廃止
2. `liftkit-tokens.css` を手動作成（`:root` 変数のみ抽出）
3. `liftkit-bridge.css` を手動作成（`@theme` + `@utility` のみ抽出）
4. `main.css` で上記2ファイルを選択的にインポート

この対応により、`!important` オーバーライドの大部分を除去できた。

**コミット**: `7b34bfe` (refactor(css): LiftKit CSS統合を選択的インポートに再構築)
