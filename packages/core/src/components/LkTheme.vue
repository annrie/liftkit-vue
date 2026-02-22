<script setup lang="ts">
import { computed, toRefs } from 'vue'
import { provideTheme, type PaletteState } from '../composables'

export interface LkThemeProps {
  /** Source/seed color to generate theme from (hex) */
  sourceColor?: string
  /** Color mode - light or dark */
  colorMode?: 'light' | 'dark'
  /** Custom initial palette overrides */
  palette?: Partial<PaletteState>
}

const props = withDefaults(defineProps<LkThemeProps>(), {
  sourceColor: undefined,
  colorMode: 'light',
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

// Set the initial color mode
if (props.colorMode === 'dark') {
  theme.setColorMode('dark')
}

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
