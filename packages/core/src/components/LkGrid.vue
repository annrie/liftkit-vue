<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { propsToDataAttrs } from '../utils/utilities'

interface LkGridProps {
  columns?: number
  gap?: LkSizeUnit
  autoResponsive?: boolean
  class?: string
}

const props = withDefaults(defineProps<LkGridProps>(), {
  columns: 2,
  gap: 'md',
  autoResponsive: false,
})

defineOptions({
  inheritAttrs: false,
})

const slots = useSlots()

const dataAttrs = computed(() =>
  propsToDataAttrs(
    { autoResponsive: props.autoResponsive, gap: props.gap },
    'grid',
  ),
)

const columnStyle = computed(() => {
  if (!props.class) {
    return { gridTemplateColumns: `repeat(${props.columns}, 1fr)` }
  }
  return {}
})

const hasSlotContent = computed(() => !!slots.default)

const placeholderCount = computed(() => {
  if (hasSlotContent.value) return 0
  return props.class ? props.columns : props.columns * 2
})
</script>

<template>
  <div
    data-lk-component="grid"
    v-bind="{ ...$attrs, ...dataAttrs }"
    :class="props.class"
    :style="columnStyle"
  >
    <slot />
    <template v-if="!hasSlotContent">
      <LkPlaceholderBlock v-for="i in placeholderCount" :key="i" />
    </template>
  </div>
</template>
