<script setup lang="ts">
import { computed } from 'vue'
import { propsToDataAttrs } from '../utils/utilities'
import { getOnToken } from '../utils/colorUtils'
import LkIcon from './LkIcon.vue'
import LkStateLayer from './LkStateLayer.vue'

export interface LkIconButtonProps {
  icon?: string
  variant?: 'fill' | 'outline' | 'text'
  color?: LkColor
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  fontClass?: LkFontClass
}

const props = withDefaults(defineProps<LkIconButtonProps>(), {
  icon: 'roller-coaster',
  variant: 'fill',
  color: 'primary',
  size: 'md',
  fontClass: 'body',
})

defineOptions({
  inheritAttrs: false,
})

const dataAttrs = computed(() =>
  propsToDataAttrs(
    { variant: props.variant, color: props.color, size: props.size },
    'icon-button',
  ),
)

const onToken = computed(() => getOnToken(props.color) as LkColor)

const iconStrokeWidth = computed(() => {
  switch (props.fontClass) {
    case 'display1':
    case 'display2':
    case 'title1':
      return 1.5
    case 'subheading':
    case 'label':
    case 'caption':
    case 'capline':
      return 2
    default:
      return 1.75
  }
})

const iconColor = computed(() => {
  switch (props.variant) {
    case 'outline':
    case 'text':
      return props.color
    case 'fill':
      return onToken.value
    default:
      return onToken.value
  }
})
</script>

<template>
  <button
    data-lk-component="icon-button"
    type="button"
    v-bind="{ ...$attrs, ...dataAttrs }"
    :class="`${fontClass}`"
  >
    <div>
      <LkIcon :name="icon" :color="iconColor" :stroke-width="iconStrokeWidth" />
    </div>
    <LkStateLayer :bg-color="iconColor" />
  </button>
</template>
