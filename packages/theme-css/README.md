# @liftkit-vue/theme-css

Pure CSS theme package for LiftKit — use with Tailwind v4 or any CSS framework. No JavaScript required.

**[日本語版はこちら](#日本語)**

## Installation

> **Note**: npm package is not yet published. Currently available via the monorepo workspace only.

## Usage

Import in your CSS or Tailwind config:

```css
@import '@liftkit-vue/theme-css';
```

This gives you access to all LiftKit CSS custom properties:

```css
.my-element {
  color: var(--lk-primary);
  padding: var(--lk-size-md);
  border-radius: var(--lk-size-xs);
}
```

## What's Included

- **Color tokens**: `--lk-primary`, `--lk-secondary`, `--lk-error`, `--lk-surface`, etc.
- **Sizing scale**: `--lk-size-3xs` through `--lk-size-4xl` (golden ratio based)
- **Typography**: Font size and line-height tokens
- **Light/Dark variants**: `--light__*_lkv` and `--dark__*_lkv` variables

## Use Cases

- Tailwind v4 projects that want LiftKit tokens without Vue components
- Projects using Tailwind-dependent UI frameworks (e.g., Nuxt UI, daisyUI) that need LiftKit design tokens alongside their existing Tailwind setup
- Static sites or non-Vue frameworks
- Custom CSS-only builds

---

<a id="日本語"></a>

# @liftkit-vue/theme-css（日本語）

LiftKit の純粋 CSS テーマパッケージです。Tailwind v4 や任意の CSS フレームワークと組み合わせて使用できます。JavaScript 不要。

## インストール

> **注意**: npm パッケージは未公開です。現在はモノレポのワークスペース経由でのみ利用可能です。

## 使い方

CSS または Tailwind 設定でインポート:

```css
@import '@liftkit-vue/theme-css';
```

LiftKit の全 CSS カスタムプロパティが利用可能になります:

```css
.my-element {
  color: var(--lk-primary);
  padding: var(--lk-size-md);
  border-radius: var(--lk-size-xs);
}
```

## 含まれるもの

- **カラートークン**: `--lk-primary`、`--lk-secondary`、`--lk-error`、`--lk-surface` など
- **サイジングスケール**: `--lk-size-3xs` 〜 `--lk-size-4xl`（黄金比ベース）
- **タイポグラフィ**: フォントサイズとラインハイトのトークン
- **ライト/ダークバリアント**: `--light__*_lkv` および `--dark__*_lkv` 変数

## ユースケース

- Vue コンポーネント不要で LiftKit トークンだけ使いたい Tailwind v4 プロジェクト
- Tailwind 必須の UI フレームワーク（Nuxt UI、daisyUI など）を使用しつつ、LiftKit のデザイントークンも併用したい場合
- 静的サイトや Vue 以外のフレームワーク
- CSS のみのカスタムビルド
