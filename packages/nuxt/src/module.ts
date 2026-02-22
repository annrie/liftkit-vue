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

    // Add CSS
    nuxt.options.css.push('@liftkit-vue/core/css/index.css')

    // Register runtime plugin for theme initialization
    addPlugin(resolver.resolve('./runtime/plugin'))

    // Register all LiftKit components for auto-import
    const components = [
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
      // Dropdown
      'LkDropdown',
      'LkDropdownTrigger',
      'LkDropdownMenu',
      // Theme
      'LkTheme',
      'LkThemeController',
    ]

    for (const name of components) {
      addComponent({
        name,
        export: name,
        filePath: '@liftkit-vue/core',
      })
    }
  },
})

export default module
