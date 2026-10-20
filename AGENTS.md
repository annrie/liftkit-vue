# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LiftKit Vue is a Material Design 3-inspired Vue 3 component library with dynamic theming powered by `@material/material-color-utilities`. It ships as a pnpm monorepo with multiple packages.

## Commands

```bash
# Install dependencies
pnpm install

# Dev server (runs the Nuxt playground)
pnpm dev

# Build all packages
pnpm build

# Build a single package
pnpm --filter @liftkit-vue/core build
pnpm --filter @liftkit-vue/nuxt build    # uses nuxt-module-build

# Type check all packages (core / nuxt / preset-unocss, including their test/ files)
pnpm typecheck

# Run all tests once (vitest, from the repo root)
pnpm test

# Watch mode
pnpm test:watch
```

CI (`.github/workflows/ci.yml`) runs `pnpm install --frozen-lockfile`, `pnpm typecheck` and `pnpm test` on every pull request.

## Testing

- Config: `vitest.config.ts` at the repo root. Default environment is `node`; a test that needs a DOM opts in with `// @vitest-environment happy-dom` on its first line.
- Layout: package-specific tests live in `packages/<pkg>/test/*.test.ts` (mirroring `src/`); cross-package consistency tests live in the root `test/`.
- Single `.vue` components are not mounted yet (no `@vitejs/plugin-vue` at the root). Composables are tested by mounting small `defineComponent` wrappers with `@vue/test-utils`.
- `@material/material-color-utilities` is inlined in `vitest.config.ts` (its ESM build has extensionless imports that Node cannot resolve).

## Monorepo Structure

```
packages/
  core/          # @liftkit-vue/core — Vue 3 components, composables, CSS utilities, types
  nuxt/          # @liftkit-vue/nuxt — Nuxt 3 module (auto-imports all Lk* components)
  theme-css/     # @liftkit-vue/theme-css — Pure Tailwind v4 CSS theme (no JS)
  preset-unocss/ # @liftkit-vue/preset-unocss — UnoCSS preset (WIP, uses unbuild)
playground/      # Nuxt 3 app for development/testing (uses @liftkit-vue/nuxt)
```

Package manager: **pnpm 10** with workspaces. Node >= 20.

## Architecture

### Theme System (core pattern)

The theming is built around Material Design 3 dynamic color. The flow is:

1. `LkTheme.vue` calls `provideTheme()` at the root, which Vue `provide()`s a `ThemeContext`
2. `provideTheme()` generates light/dark tonal palettes from seed hex colors using `@material/material-color-utilities` (`TonalPalette`, `Hct`)
3. Palette changes are watched and automatically applied as CSS custom variables on `:root` (pattern: `--light__<token>_lkv`, `--dark__<token>_lkv`)
4. Child components use `useTheme()` (inject) to access palette, colorMode, and update functions
5. `updateThemeFromMaster(hex)` generates a full palette from a single source color via `material-dynamic-colors`

### CSS System

All utility CSS lives in `packages/core/src/css/`. The design system uses a golden-ratio scale factor (`--lk-scalefactor: 1.618`) for sizing tokens (`--lk-size-sm`, `--lk-size-lg`, etc.). Color variables follow the pattern `--light__<token>_lkv` / `--dark__<token>_lkv`.

The CSS entry point is `packages/core/src/css/index.css`, which imports all utility files and `@csstools/normalize.css`.

### Nuxt Module

`packages/nuxt/src/module.ts` registers all Lk* components for Nuxt auto-import by pointing directly to the **source `.vue` files** in `packages/core/src/components/` (not the built dist). This is intentional — pre-built dist components can't resolve sibling component imports within Nuxt's auto-import system. The module also injects the core CSS and a runtime plugin.

Config key in `nuxt.config.ts`: `liftkit`.

### Component Naming

All components are prefixed `Lk` (e.g., `LkButton`, `LkCard`, `LkTheme`). Most are single-file `.vue` components in `packages/core/src/components/`. Compound components like `LkDropdown` live in subdirectories.

### Core Package Build

`packages/core` builds as a Vite library (`vite build`) outputting ESM (`.mjs`) and CJS (`.cjs`). Vue, `@floating-ui/vue`, and `lucide-vue-next` are externalized. CSS files are exported via `./css/*` path mapping (not bundled into JS).

### Key Dependencies

- `@material/material-color-utilities` + `material-dynamic-colors` — M3 color generation
- `@floating-ui/vue` — Dropdown/select positioning
- `@csstools/normalize.css` — CSS reset

## Type System

Global type declarations in `packages/core/src/types/` define LiftKit-specific types: `lk-color.d.ts`, `lk-material.d.ts`, `lk-shape.d.ts`, `lk-typography.d.ts`, `lk-units.d.ts`, `lk-utility.d.ts`. These are imported for side effects in the core entry point.
