# LiftKit Vue

A Material Design 3 inspired component library and theming system for Vue 3 + Nuxt 4.

**[日本語版はこちら](#日本語)**

## Overview

LiftKit Vue is a monorepo that provides a complete design system with dynamic color theming powered by Google's Material Color Utilities. It features auto-generated light/dark color schemes, a golden-ratio based spacing scale, and 35+ ready-to-use Vue components.

## Packages

| Package | Description |
|---------|-------------|
| [`@liftkit-vue/core`](./packages/core) | Vue 3 components, composables, and CSS design tokens |
| [`@liftkit-vue/nuxt`](./packages/nuxt) | Nuxt 4 module with auto-imports |
| [`@liftkit-vue/theme-css`](./packages/theme-css) | Pure CSS theme (Tailwind v4 compatible) |
| [`@liftkit-vue/preset-unocss`](./packages/preset-unocss) | UnoCSS preset for the LiftKit design system |

## Installation

```bash
pnpm add @liftkit-vue/core
# or for Nuxt
pnpm add @liftkit-vue/nuxt
# or for UnoCSS
pnpm add @liftkit-vue/preset-unocss
# or for pure CSS
pnpm add @liftkit-vue/theme-css
```

## Quick Start (Nuxt)

Add the module to your `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@liftkit-vue/nuxt'],
})
```

Wrap your app with the theme provider:

```vue
<template>
  <LkTheme source-color="#035eff">
    <NuxtPage />
  </LkTheme>
</template>
```

All components are auto-imported — use them directly in your templates.

### Using with Nuxt UI or other UI frameworks

When using LiftKit alongside external UI frameworks (e.g. Nuxt UI), you can selectively load only the design tokens to avoid CSS conflicts:

```ts
export default defineNuxtConfig({
  modules: ['@liftkit-vue/nuxt'],
  liftkit: {
    css: 'tokens',        // Load only design tokens (CSS variables)
    includeReset: false,   // Exclude element-level resets (*, button, body, a)
    components: true,      // Still auto-import LiftKit components
  },
})
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `css` | `'full' \| 'tokens' \| 'none'` | `'full'` | CSS injection mode |
| `includeReset` | `boolean` | `true` | Include element-level resets (`*`, `button`, `body`, `a`) |
| `components` | `boolean` | `true` | Auto-import LiftKit components |

### CSS Architecture

The core CSS is split into two independent files:

- **`liftkit-tokens.css`** — `:root` CSS custom properties only (`--lk-*` variables). Safe to use in any environment.
- **`liftkit-reset.css`** — Element-level selectors (`*`, `button`, `body`, `a`, `html`). Intended for LiftKit-only projects; skip when using external UI frameworks.

For manual CSS imports (without the Nuxt module):

```css
/* Tokens only — safe with any UI framework */
@import '@liftkit-vue/core/src/css/liftkit-tokens.css';

/* Full — includes element resets (LiftKit-only projects) */
@import '@liftkit-vue/core/src/css/liftkit-core.css';
```

## Features

- **Dynamic Theming**: Generate entire color schemes from a single seed color
- **Auto Color Mode**: Automatically follows OS light/dark preference, or set manually
- **Golden Ratio Scale**: Spacing, typography, and sizing based on `φ = 1.618`
- **35+ Components**: Buttons, cards, tabs, navbar, dropdowns, selects, and more
- **Material Design 3**: Tonal palettes, surface containers, and state layers
- **CSS Custom Properties**: All tokens exposed as `--lk-*` and `--light__*_lkv` / `--dark__*_lkv` variables

## Development

```bash
pnpm install
pnpm dev          # Start playground dev server
pnpm build        # Build all packages
pnpm typecheck    # Run type checking
```

## Requirements

- Node.js >= 20
- pnpm >= 10

## Acknowledgments

This project is built upon the design principles of [LiftKit](https://www.chainlift.io/liftkit) by [Chainlift](https://github.com/Chainlift/liftkit) — a golden-ratio based UI framework with Material Design 3 color system. LiftKit Vue is an unofficial Vue/Nuxt port that brings the LiftKit design philosophy to the Vue ecosystem.

## License

MIT

---

<a id="日本語"></a>

# LiftKit Vue (日本語)

Material Design 3 にインスパイアされた Vue 3 + Nuxt 4 向けコンポーネントライブラリ・テーマシステムです。

## 概要

LiftKit Vue は、Google の Material Color Utilities を活用した動的カラーテーマ機能を備えた完全なデザインシステムを提供するモノレポです。シードカラー1色からライト/ダーク配色を自動生成し、黄金比ベースのスペーシングスケールと 35 以上の Vue コンポーネントを含みます。

## パッケージ

| パッケージ | 説明 |
|-----------|------|
| [`@liftkit-vue/core`](./packages/core) | Vue 3 コンポーネント、コンポーザブル、CSS デザイントークン |
| [`@liftkit-vue/nuxt`](./packages/nuxt) | Nuxt 4 モジュール（自動インポート対応） |
| [`@liftkit-vue/theme-css`](./packages/theme-css) | 純粋 CSS テーマ（Tailwind v4 互換） |
| [`@liftkit-vue/preset-unocss`](./packages/preset-unocss) | LiftKit デザインシステム用 UnoCSS プリセット |

## インストール

```bash
pnpm add @liftkit-vue/core
# または Nuxt 用
pnpm add @liftkit-vue/nuxt
# または UnoCSS 用
pnpm add @liftkit-vue/preset-unocss
# または 純粋 CSS 用
pnpm add @liftkit-vue/theme-css
```

## クイックスタート (Nuxt)

`nuxt.config.ts` にモジュールを追加:

```ts
export default defineNuxtConfig({
  modules: ['@liftkit-vue/nuxt'],
})
```

テーマプロバイダーでラップ:

```vue
<template>
  <LkTheme source-color="#035eff">
    <NuxtPage />
  </LkTheme>
</template>
```

全コンポーネントが自動インポートされます。

### Nuxt UI 等の外部UIフレームワークとの併用

外部UIフレームワーク（Nuxt UI 等）と併用する場合、デザイントークンのみを選択的にロードして CSS 競合を回避できます:

```ts
export default defineNuxtConfig({
  modules: ['@liftkit-vue/nuxt'],
  liftkit: {
    css: 'tokens',        // デザイントークン（CSS変数）のみ
    includeReset: false,   // 要素リセット（*, button, body, a）を除外
    components: true,      // LiftKit コンポーネントは自動インポート
  },
})
```

| オプション | 型 | デフォルト | 説明 |
|-----------|------|---------|------|
| `css` | `'full' \| 'tokens' \| 'none'` | `'full'` | CSS 注入モード |
| `includeReset` | `boolean` | `true` | 要素リセット（`*`, `button`, `body`, `a`）を含めるか |
| `components` | `boolean` | `true` | LiftKit コンポーネントの自動インポート |

### CSS アーキテクチャ

コア CSS は2つの独立したファイルに分割されています:

- **`liftkit-tokens.css`** — `:root` CSS カスタムプロパティのみ（`--lk-*` 変数）。どの環境でも安全に使用可能。
- **`liftkit-reset.css`** — 要素レベルセレクタ（`*`, `button`, `body`, `a`, `html`）。LiftKit 単独プロジェクト向け。外部UIフレームワーク使用時はスキップ。

手動 CSS インポート（Nuxt モジュールなし）:

```css
/* トークンのみ — 外部UIフレームワークと安全に併用可能 */
@import '@liftkit-vue/core/src/css/liftkit-tokens.css';

/* フル — 要素リセットを含む（LiftKit単独プロジェクト向け） */
@import '@liftkit-vue/core/src/css/liftkit-core.css';
```

## 機能

- **動的テーマ**: シードカラー1色から配色全体を自動生成
- **自動カラーモード**: OS のライト/ダーク設定に自動追従（手動設定も可能）
- **黄金比スケール**: スペーシング・タイポグラフィ・サイジングに `φ = 1.618` を採用
- **35以上のコンポーネント**: ボタン、カード、タブ、ナビバー、ドロップダウン、セレクトなど
- **Material Design 3**: トーナルパレット、サーフェスコンテナ、ステートレイヤー
- **CSS カスタムプロパティ**: 全トークンを `--lk-*` および `--light__*_lkv` / `--dark__*_lkv` 変数として公開

## 開発

```bash
pnpm install
pnpm dev          # プレイグラウンド開発サーバー起動
pnpm build        # 全パッケージビルド
pnpm typecheck    # 型チェック
```

## 要件

- Node.js >= 20
- pnpm >= 10

## 謝辞

本プロジェクトは [Chainlift](https://github.com/Chainlift/liftkit) による [LiftKit](https://www.chainlift.io/liftkit) のデザイン原則に基づいています。LiftKit は黄金比ベースの UI フレームワークで、Material Design 3 カラーシステムを採用しています。LiftKit Vue は、LiftKit のデザイン哲学を Vue エコシステムに持ち込む非公式の Vue/Nuxt ポートです。

## ライセンス

MIT
