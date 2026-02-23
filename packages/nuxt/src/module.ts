import { defineNuxtModule, addComponent, addPlugin, createResolver } from '@nuxt/kit'
import type { NuxtModule } from '@nuxt/schema'

const module: NuxtModule = defineNuxtModule({
  meta: {
    name: '@liftkit-vue/nuxt',
    configKey: 'liftkit',
  },
  defaults: {},
  setup(_options, nuxt) {
    const resolver = createResolver(import.meta.url)

    // Add CSS — resolve to absolute path for pnpm workspace compatibility
    const coreCssPath = resolver.resolve('../../core/src/css/index.css')
    nuxt.options.css.push(coreCssPath)

    // Register runtime plugin for theme initialization
    addPlugin(resolver.resolve('./runtime/plugin'))

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
  },
})

export default module
