# @liftkit-vue/nuxt

Nuxt 4 module for LiftKit Vue — auto-imports all components and injects the CSS design system.

**[日本語版はこちら](#日本語)**

## Installation

> **Note**: npm package is not yet published. Install the monorepo from GitHub:

```bash
pnpm add github:YOUR_USERNAME/liftkit-vue
```

## Setup

Add the module to `nuxt.config.ts`:

```ts
export default defineNuxtConfig({
  modules: ['@liftkit-vue/nuxt'],
})
```

## Usage

All LiftKit components are auto-imported. Wrap your app with `LkTheme` in your layout:

```vue
<!-- layouts/default.vue -->
<template>
  <LkTheme source-color="#035eff">
    <slot />
  </LkTheme>
</template>
```

Then use components directly in any page:

```vue
<template>
  <LkContainer>
    <LkCard material="filled">
      <LkText font-class="heading">Welcome</LkText>
      <LkButton variant="fill" color="primary">Get Started</LkButton>
    </LkCard>
  </LkContainer>
</template>
```

## What the Module Does

1. **CSS Injection** — Automatically loads the LiftKit core CSS (tokens, reset, component styles)
2. **Component Registration** — Registers all 35+ components for auto-import
3. **Runtime Plugin** — Initializes the theme system on app startup

## Color Mode

The `LkTheme` component supports automatic OS-based color mode detection:

```vue
<!-- Auto (default) — follows OS light/dark setting -->
<LkTheme color-mode="auto">

<!-- Force light or dark -->
<LkTheme color-mode="light">
<LkTheme color-mode="dark">
```

## Requirements

- Nuxt >= 4.0
- Vue >= 3.5

---

<a id="日本語"></a>

# @liftkit-vue/nuxt（日本語）

LiftKit Vue 用の Nuxt 4 モジュールです。全コンポーネントの自動インポートと CSS デザインシステムの注入を行います。

## インストール

> **注意**: npm パッケージは未公開です。GitHub からモノレポをインストールしてください:

```bash
pnpm add github:YOUR_USERNAME/liftkit-vue
```

## セットアップ

`nuxt.config.ts` にモジュールを追加:

```ts
export default defineNuxtConfig({
  modules: ['@liftkit-vue/nuxt'],
})
```

## 使い方

全 LiftKit コンポーネントが自動インポートされます。レイアウトで `LkTheme` をラップしてください:

```vue
<!-- layouts/default.vue -->
<template>
  <LkTheme source-color="#035eff">
    <slot />
  </LkTheme>
</template>
```

ページ内で直接コンポーネントを使用できます:

```vue
<template>
  <LkContainer>
    <LkCard material="filled">
      <LkText font-class="heading">Welcome</LkText>
      <LkButton variant="fill" color="primary">Get Started</LkButton>
    </LkCard>
  </LkContainer>
</template>
```

## モジュールの機能

1. **CSS 注入** — LiftKit コア CSS（トークン、リセット、コンポーネントスタイル）を自動読み込み
2. **コンポーネント登録** — 35以上のコンポーネントを自動インポート用に登録
3. **ランタイムプラグイン** — アプリ起動時にテーマシステムを初期化

## カラーモード

`LkTheme` コンポーネントは OS ベースのカラーモード自動検出に対応しています:

```vue
<!-- Auto（デフォルト）— OS のライト/ダーク設定に追従 -->
<LkTheme color-mode="auto">

<!-- ライトまたはダークを強制 -->
<LkTheme color-mode="light">
<LkTheme color-mode="dark">
```

## 要件

- Nuxt >= 4.0
- Vue >= 3.5
