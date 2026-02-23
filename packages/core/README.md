# @liftkit-vue/core

The core package of LiftKit Vue — Vue 3 components, composables, and CSS design tokens powered by Material Design 3 dynamic color.

**[日本語版はこちら](#日本語)**

## Installation

> **Note**: npm package is not yet published. Currently available via the monorepo workspace only.

For Nuxt projects, use [`@liftkit-vue/nuxt`](../nuxt) instead for auto-imports.

## Usage

### Theme Setup

Wrap your app with `LkTheme` to provide the theme context:

```vue
<script setup>
import { LkTheme } from '@liftkit-vue/core'
</script>

<template>
  <LkTheme source-color="#035eff" color-mode="auto">
    <slot />
  </LkTheme>
</template>
```

Props:
- `source-color` — Hex color to generate the full palette from
- `color-mode` — `'auto'` (follows OS, default), `'light'`, or `'dark'`
- `palette` — Override individual palette colors

### Using Components

```vue
<script setup>
import { LkButton, LkCard, LkText } from '@liftkit-vue/core'
</script>

<template>
  <LkCard material="elevated">
    <LkText font-class="title2">Hello LiftKit</LkText>
    <LkButton variant="fill" color="primary">Click me</LkButton>
  </LkCard>
</template>
```

### Using the Theme Composable

```vue
<script setup>
import { useTheme } from '@liftkit-vue/core'

const { colorMode, setColorMode, palette } = useTheme()
</script>
```

## Components (35+)

**Layout**: LkContainer, LkColumn, LkRow, LkSection, LkGrid, LkPlaceholderBlock

**Typography & Display**: LkHeading, LkText, LkBadge, LkIcon, LkImage, LkSticker

**Interactive**: LkButton, LkIconButton, LkMenuItem, LkSwitch, LkTextInput, LkSelect, LkTabs, LkTabMenu, LkTabLink, LkTabContent

**Complex**: LkCard, LkNavbar, LkDropdown, LkSnackbar

**Theme**: LkTheme, LkThemeController

**Material**: LkStateLayer, LkMaterialLayer

## CSS Architecture

All styling uses data attributes (`data-lk-component`, `data-lk-button-variant`, etc.) and CSS custom properties.

Token patterns:
- Sizing: `--lk-size-{3xs..4xl}` — golden ratio scale (φ = 1.618)
- Theme colors: `--light__primary_lkv`, `--dark__primary_lkv`, etc.
- Shorthand aliases: `--lk-primary`, `--lk-onsurface`, etc.

## Development

```bash
pnpm build        # Build with Vite
pnpm typecheck    # Type check with vue-tsc
```

---

<a id="日本語"></a>

# @liftkit-vue/core（日本語）

LiftKit Vue のコアパッケージです。Material Design 3 の動的カラーを活用した Vue 3 コンポーネント、コンポーザブル、CSS デザイントークンを提供します。

## インストール

> **注意**: npm パッケージは未公開です。現在はモノレポのワークスペース経由でのみ利用可能です。

Nuxt プロジェクトでは、自動インポート対応の [`@liftkit-vue/nuxt`](../nuxt) を使用してください。

## 使い方

### テーマのセットアップ

`LkTheme` でアプリをラップしてテーマコンテキストを提供します:

```vue
<script setup>
import { LkTheme } from '@liftkit-vue/core'
</script>

<template>
  <LkTheme source-color="#035eff" color-mode="auto">
    <slot />
  </LkTheme>
</template>
```

Props:
- `source-color` — パレット全体を生成するための Hex カラー
- `color-mode` — `'auto'`（OS設定に追従、デフォルト）、`'light'`、`'dark'`
- `palette` — 個別のパレットカラーを上書き

### コンポーネントの使用

```vue
<script setup>
import { LkButton, LkCard, LkText } from '@liftkit-vue/core'
</script>

<template>
  <LkCard material="elevated">
    <LkText font-class="title2">Hello LiftKit</LkText>
    <LkButton variant="fill" color="primary">Click me</LkButton>
  </LkCard>
</template>
```

### テーマコンポーザブルの使用

```vue
<script setup>
import { useTheme } from '@liftkit-vue/core'

const { colorMode, setColorMode, palette } = useTheme()
</script>
```

## コンポーネント（35以上）

**レイアウト**: LkContainer, LkColumn, LkRow, LkSection, LkGrid, LkPlaceholderBlock

**タイポグラフィ・表示**: LkHeading, LkText, LkBadge, LkIcon, LkImage, LkSticker

**インタラクティブ**: LkButton, LkIconButton, LkMenuItem, LkSwitch, LkTextInput, LkSelect, LkTabs, LkTabMenu, LkTabLink, LkTabContent

**複合**: LkCard, LkNavbar, LkDropdown, LkSnackbar

**テーマ**: LkTheme, LkThemeController

**マテリアル**: LkStateLayer, LkMaterialLayer

## CSS アーキテクチャ

全てのスタイリングはデータ属性（`data-lk-component`、`data-lk-button-variant` など）と CSS カスタムプロパティを使用します。

トークンパターン:
- サイジング: `--lk-size-{3xs..4xl}` — 黄金比スケール（φ = 1.618）
- テーマカラー: `--light__primary_lkv`、`--dark__primary_lkv` など
- ショートハンドエイリアス: `--lk-primary`、`--lk-onsurface` など

## 開発

```bash
pnpm build        # Vite でビルド
pnpm typecheck    # vue-tsc で型チェック
```
