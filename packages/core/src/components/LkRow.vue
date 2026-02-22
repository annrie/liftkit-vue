<script setup lang="ts">
import { computed } from 'vue'
import { propsToDataAttrs } from '../utils/utilities'

interface LkRowProps {
  alignItems?: 'start' | 'center' | 'end' | 'stretch'
  justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around'
  gap?: LkSizeUnit
  wrapChildren?: boolean
  defaultChildBehavior?: 'auto-grow' | 'auto-shrink' | 'ignoreFlexRules' | 'ignoreIntrinsicSize'
}

const props = withDefaults(defineProps<LkRowProps>(), {
  alignItems: 'start',
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
    'row',
  ),
)
</script>

<template>
  <div v-bind="{ ...$attrs, ...dataAttrs }" data-lk-component="row">
    <slot />
  </div>
</template>
