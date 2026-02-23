<script setup lang="ts">
import { computed } from 'vue'
import { provideTheme, type PaletteState, type ColorModePreference } from '../composables'

export interface LkThemeProps {
  /** Source/seed color to generate theme from (hex) */
  sourceColor?: string
  /** Color mode - 'auto' follows OS setting, 'light'/'dark' forces mode */
  colorMode?: ColorModePreference
  /** Custom initial palette overrides */
  palette?: Partial<PaletteState>
}

const props = withDefaults(defineProps<LkThemeProps>(), {
  sourceColor: undefined,
  colorMode: 'auto',
  palette: undefined,
})

// Build the initial palette from props
const initialPalette = computed<Partial<PaletteState>>(() => {
  const pal: Partial<PaletteState> = {}
  if (props.palette) {
    Object.assign(pal, props.palette)
  }
  return pal
})

// Provide theme context to all children
const theme = provideTheme(initialPalette.value)

// Set the initial color mode preference
theme.setColorMode(props.colorMode)

// If sourceColor is provided, generate theme from it
if (props.sourceColor) {
  theme.updateThemeFromMaster(props.sourceColor)
}

defineExpose({
  theme,
})
</script>

<template>
  <div class="lk-theme" v-bind="$attrs">
    <slot />
  </div>
</template>
