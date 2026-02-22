<script setup lang="ts">
import { computed } from 'vue'
import { propsToDataAttrs } from '../utils/utilities'

interface LkColumnProps {
  alignItems?: 'start' | 'center' | 'end' | 'stretch'
  justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around'
  gap?: LkSizeUnit | 'none'
  wrapChildren?: boolean
  defaultChildBehavior?: 'auto-grow' | 'auto-shrink' | 'ignoreFlexRules' | 'ignoreIntrinsicSize'
}

const props = withDefaults(defineProps<LkColumnProps>(), {
  alignItems: 'stretch',
  justifyContent: 'start',
})

defineOptions({
  inheritAttrs: false,
})

const dataAttrs = computed(() =>
  propsToDataAttrs(
    {
      alignItems: props.alignItems,
      justifyContent: props.justifyContent,
      gap: props.gap,
      wrapChildren: props.wrapChildren,
      defaultChildBehavior: props.defaultChildBehavior,
    },
    'column',
  ),
)
</script>

<template>
  <div v-bind="{ ...$attrs, ...dataAttrs }" data-lk-component="column">
    <slot />
  </div>
</template>
