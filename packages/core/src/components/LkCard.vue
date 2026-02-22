<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { propsToDataAttrs } from '../utils/utilities'

export interface LkCardProps {
  scaleFactor?: LkFontClass | 'none'
  variant?: 'fill' | 'outline' | 'transparent'
  material?: 'flat' | 'glass'
  materialProps?: LkMatProps
  opticalCorrection?: 'top' | 'left' | 'right' | 'bottom' | 'x' | 'y' | 'all' | 'none'
  isClickable?: boolean
  bgColor?: LkColorWithOnToken | 'transparent'
  isScrollable?: boolean
}

const props = withDefaults(defineProps<LkCardProps>(), {
  scaleFactor: 'body',
  variant: 'fill',
  material: 'flat',
  materialProps: () => ({}),
  opticalCorrection: 'none',
  isClickable: false,
  isScrollable: false,
})

defineOptions({
  inheritAttrs: false,
})

const attrs = useAttrs()

const lkCardAttrs = computed(() =>
  propsToDataAttrs(
    {
      scaleFactor: props.scaleFactor,
      variant: props.variant,
      material: props.material,
    },
    'card',
  ),
)

const rootClass = computed(() => {
  const classes: string[] = []
  if (props.isClickable) classes.push('clickable')
  return classes.join(' ')
})

const materialBgColor = computed(() => {
  if (props.variant === 'fill') return props.bgColor
  return 'transparent'
})
</script>

<template>
  <div
    data-lk-component="card"
    :class="rootClass"
    v-bind="{ ...lkCardAttrs, ...attrs }"
  >
    <div
      data-lk-card-element="padding-box"
      :class="isScrollable ? 'overflow-auto' : ''"
      :data-lk-card-optical-correction="opticalCorrection"
    >
      <div data-lk-component="slot" data-lk-slot="children">
        <slot />
      </div>
    </div>
    <!-- Glass material layer -->
    <div
      v-if="material === 'glass'"
      data-lk-component="material-layer"
      data-lk-material-layer-type="glass"
      v-bind="propsToDataAttrs(materialProps as Record<string, unknown>, 'material')"
    />
    <!-- Flat material layer -->
    <div
      v-if="material === 'flat'"
      data-lk-component="material-layer"
      data-lk-material-layer-type="flat"
      :data-lk-material-bg-color="materialBgColor"
    />
  </div>
</template>
