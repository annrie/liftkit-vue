import { defineNuxtModule, addComponent, addPlugin, createResolver } from '@nuxt/kit'
import type { NuxtModule } from '@nuxt/schema'

export interface ModuleOptions {
  /**
   * CSS インジェクション設定
   * - 'full': 全 CSS を注入（デフォルト、現在の動作）
   * - 'tokens': デザイントークン（変数）のみ
   * - 'none': CSS を注入しない（ユーザーが手動管理）
   */
  css: 'full' | 'tokens' | 'none'

  /**
   * 要素リセット CSS を含めるか
   * false にすると *, button, body, a 等の要素セレクタを除外
   * Nuxt UI 等の外部 UI フレームワーク使用時は false 推奨
   */
  includeReset: boolean

  /**
   * コンポーネントの自動インポートを有効化
   */
  components: boolean
}

const module: NuxtModule = defineNuxtModule<ModuleOptions>({
  meta: {
    name: '@liftkit-vue/nuxt',
    configKey: 'liftkit',
  },
  defaults: {
    css: 'full',
    includeReset: true,
    components: true,
  },
  setup(options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // CSS インジェクション
    if (options.css !== 'none') {
      if (options.css === 'tokens') {
        // トークン（変数）のみ — 外部UIフレームワークとの互換性を最大化
        const tokensCssPath = resolver.resolve('../../core/src/css/liftkit-tokens.css')
        nuxt.options.css.push(tokensCssPath)
      } else {
        // 'full' モード
        if (options.includeReset) {
          // 全CSS（トークン + リセット + ユーティリティ）
          const coreCssPath = resolver.resolve('../../core/src/css/index.css')
          nuxt.options.css.push(coreCssPath)
        } else {
          // トークン + ユーティリティ（リセットなし）
          const tokensCssPath = resolver.resolve('../../core/src/css/liftkit-tokens.css')
          nuxt.options.css.push(tokensCssPath)
          // ユーティリティCSSファイルを個別にインポート（リセットを除外）
          const utilityCssFiles = [
            'align-items', 'align-self', 'aspect-ratios', 'border-radius',
            'column-span', 'display', 'text-color', 'flexboxes', 'gaps',
            'justify-content', 'margins', 'opacity', 'overflow', 'padding',
            'position', 'scale', 'shadows', 'text-alignment', 'typography',
            'width', 'height', 'text-columns', 'borders', 'pointer-events',
            'scrim', 'z-index', 'cursor', 'breaks', 'background-colors',
            'whitespace', 'border-color', 'border-style', 'border-width',
          ]
          for (const file of utilityCssFiles) {
            nuxt.options.css.push(resolver.resolve(`../../core/src/css/${file}.css`))
          }
          nuxt.options.css.push(resolver.resolve('../../core/src/css/lk-components.css'))
        }
      }
    }

    // Register runtime plugin for theme initialization
    addPlugin(resolver.resolve('./runtime/plugin'))

    // コンポーネントの自動インポート
    if (options.components) {
      // Register all LiftKit components for auto-import
      // Use source .vue files so Nuxt compiles them with auto-import support
      // (pre-built dist components can't resolve sibling components like LkIcon inside LkBadge)
      const coreComponents = '../../core/src/components'

      const components: Array<{ name: string; path: string }> = [
        // Layout
        'LkContainer',
        'LkColumn',
        'LkRow',
        'LkSection',
        'LkGrid',
        'LkPlaceholderBlock',
        // Typography & Display
        'LkHeading',
        'LkText',
        'LkBadge',
        'LkIcon',
        'LkImage',
        'LkSticker',
        // Material
        'LkStateLayer',
        'LkMaterialLayer',
        // Interactive
        'LkButton',
        'LkIconButton',
        'LkMenuItem',
        'LkSwitch',
        'LkTextInput',
        // Tabs
        'LkTabLink',
        'LkTabMenu',
        'LkTabs',
        'LkTabContent',
        // Complex
        'LkCard',
        'LkSelect',
        'LkSnackbar',
        'LkNavbar',
        // Theme
        'LkTheme',
        'LkThemeController',
      ].map((name) => ({ name, path: `${coreComponents}/${name}.vue` }))

      // Components in subdirectories
      components.push(
        { name: 'LkDropdown', path: `${coreComponents}/LkDropdown/LkDropdown.vue` },
        { name: 'LkDropdownTrigger', path: `${coreComponents}/LkDropdown/LkDropdownTrigger.vue` },
        { name: 'LkDropdownMenu', path: `${coreComponents}/LkDropdown/LkDropdownMenu.vue` },
      )

      for (const { name, path } of components) {
        addComponent({
          name,
          filePath: resolver.resolve(path),
        })
      }
    }
  },
})

export default module
