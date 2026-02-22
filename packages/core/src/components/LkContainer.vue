<script setup lang="ts">
import { computed } from 'vue'
import { propsToDataAttrs } from '../utils/utilities'

interface LkContainerProps {
  maxWidth?: LkContainerWidth
}

const props = withDefaults(defineProps<LkContainerProps>(), {
  maxWidth: 'md',
})

defineOptions({
  inheritAttrs: false,
})

const dataAttrs = computed(() =>
  propsToDataAttrs({ maxWidth: props.maxWidth }, 'container'),
)
</script>

<template>
  <div v-bind="{ ...$attrs, ...dataAttrs }">
    <slot />
  </div>
</template>
