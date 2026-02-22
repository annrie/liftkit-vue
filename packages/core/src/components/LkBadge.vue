<script setup lang="ts">
import { computed } from 'vue'
import { getOnToken } from '../utils/colorUtils'

interface LkBadgeProps {
  icon?: string
  color?: LkColorWithOnToken
  scale?: 'md' | 'lg'
  iconStrokeWidth?: number
  scrim?: boolean
}

const props = withDefaults(defineProps<LkBadgeProps>(), {
  icon: 'roller-coaster',
  color: 'surface',
  scale: 'md',
  iconStrokeWidth: 0,
  scrim: false,
})

defineOptions({
  inheritAttrs: false,
})

const iconColor = computed(() => getOnToken(props.color) as LkColor)

const defaultIconStrokeWidth = computed(() => {
  switch (props.scale) {
    case 'lg':
      return 1
    case 'md':
    default:
      return 1.5
  }
})

const resolvedStrokeWidth = computed(() =>
  props.iconStrokeWidth || defaultIconStrokeWidth.value,
)
</script>

<template>
  <div
    data-lk-component="badge"
    :data-lk-badge-scale="props.scale"
    :data-lk-badge-color="`lk-${props.color}`"
    v-bind="$attrs"
  >
    <div data-lk-component="slot" data-lk-slot="icon">
      <div data-lk-icon-element="wrapper">
        <LkIcon
          :name="props.icon"
          :color="iconColor"
          :stroke-width="resolvedStrokeWidth"
        />
      </div>
    </div>
    <div
      v-if="props.scrim"
      data-lk-component="badge-scrim"
      :class="`bg-${iconColor}`"
    ></div>
  </div>
</template>
