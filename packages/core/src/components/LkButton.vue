<script setup lang="ts">
import { computed } from 'vue'
import { propsToDataAttrs } from '../utils/utilities'
import { getOnToken } from '../utils/colorUtils'
import LkStateLayer from './LkStateLayer.vue'
import LkIcon from './LkIcon.vue'
import type { LkStateLayerProps } from './LkStateLayer.vue'

export interface LkButtonProps {
  label?: string
  variant?: 'fill' | 'outline' | 'text'
  color?: LkColorWithOnToken
  size?: 'sm' | 'md' | 'lg'
  material?: string
  startIcon?: string
  endIcon?: string
  opticIconShift?: boolean
  modifiers?: string
  stateLayerOverride?: LkStateLayerProps
}

const props = withDefaults(defineProps<LkButtonProps>(), {
  label: 'Button',
  variant: 'fill',
  color: 'primary',
  size: 'md',
  opticIconShift: true,
})

defineOptions({
  inheritAttrs: false,
})

const lkButtonAttrs = computed(() =>
  propsToDataAttrs(
    {
      variant: props.variant,
      color: props.color,
      size: props.size,
      startIcon: props.startIcon,
      endIcon: props.endIcon,
      opticIconShift: props.opticIconShift,
    },
    'button',
  ),
)

const onColorToken = computed(() => getOnToken(props.color) as LkColor)

const baseButtonClasses = computed(() => {
  let classes = ''
  switch (props.variant) {
    case 'fill':
      classes = `bg-${props.color} color-${onColorToken.value}`
      break
    case 'outline':
    case 'text':
      classes = `color-${props.color}`
      break
    default:
      classes = `bg-${props.color} color-${onColorToken.value}`
      break
  }
  if (props.modifiers) {
    classes += ` ${props.modifiers}`
  }
  return classes
})

const localStateLayerProps = computed(() => {
  if (props.stateLayerOverride) {
    return props.stateLayerOverride
  }
  return {
    bgColor: props.variant === 'fill' ? onColorToken.value : props.color,
  }
})

const iconColor = computed(() =>
  props.variant === 'fill' ? onColorToken.value : props.color,
)
</script>

<template>
  <button
    v-bind="{ ...$attrs, ...lkButtonAttrs }"
    type="button"
    data-lk-component="button"
    :class="`${baseButtonClasses} ${modifiers || ''}`"
  >
    <div data-lk-button-content-wrap="true">
      <div v-if="startIcon" data-lk-icon-position="start">
        <LkIcon :name="startIcon" :color="iconColor" data-lk-icon-position="start" />
      </div>
      <span data-lk-button-child="button-text">{{ label ?? 'Button' }}</span>
      <div v-if="endIcon" data-lk-icon-position="end">
        <LkIcon :name="endIcon" :color="iconColor" data-lk-icon-position="end" />
      </div>
    </div>
    <LkStateLayer v-bind="localStateLayerProps" />
  </button>
</template>
