# @liftkit-vue/preset-unocss

UnoCSS preset for the LiftKit design system — provides utility classes mapped to LiftKit tokens.

**[日本語版はこちら](#日本語)**

## Installation

> **Note**: npm package is not yet published. Currently available via the monorepo workspace only.

## Setup

Add to your UnoCSS config:

```ts
import { defineConfig } from 'unocss'
import { presetLiftKit } from '@liftkit-vue/preset-unocss'

export default defineConfig({
  presets: [
    presetLiftKit(),
  ],
})
```

## What's Included

- **Color utilities**: `text-primary`, `bg-surface`, `border-outline`, etc.
- **Spacing scale**: `p-md`, `m-lg`, `gap-sm` mapped to golden ratio tokens
- **Border radius**: `rounded-xs`, `rounded-md`, etc.
- **Shadow utilities**: LiftKit shadow definitions
- **Typography shortcuts**: `display1`, `title2`, `heading`, `body`, `caption` (with bold variants)

## Example

```html
<div class="bg-surface text-onsurface p-md rounded-sm shadow-md">
  <h1 class="display2">Hello</h1>
  <p class="body">Content here</p>
</div>
```

## Requirements

- UnoCSS >= 0.58

---

<a id="日本語"></a>

# @liftkit-vue/preset-unocss（日本語）

LiftKit デザインシステム用の UnoCSS プリセットです。LiftKit トークンにマッピングされたユーティリティクラスを提供します。

## インストール

> **注意**: npm パッケージは未公開です。現在はモノレポのワークスペース経由でのみ利用可能です。

## セットアップ

UnoCSS 設定に追加:

```ts
import { defineConfig } from 'unocss'
import { presetLiftKit } from '@liftkit-vue/preset-unocss'

export default defineConfig({
  presets: [
    presetLiftKit(),
  ],
})
```

## 含まれるもの

- **カラーユーティリティ**: `text-primary`、`bg-surface`、`border-outline` など
- **スペーシングスケール**: `p-md`、`m-lg`、`gap-sm`（黄金比トークンにマッピング）
- **ボーダー半径**: `rounded-xs`、`rounded-md` など
- **シャドウユーティリティ**: LiftKit シャドウ定義
- **タイポグラフィショートカット**: `display1`、`title2`、`heading`、`body`、`caption`（ボールドバリアント付き）

## 使用例

```html
<div class="bg-surface text-onsurface p-md rounded-sm shadow-md">
  <h1 class="display2">Hello</h1>
  <p class="body">Content here</p>
</div>
```

## 要件

- UnoCSS >= 0.58
