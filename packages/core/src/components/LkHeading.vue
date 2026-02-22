<script setup lang="ts">
import { computed } from 'vue'
import { propsToDataAttrs } from '../utils/utilities'

type LkHeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

interface LkHeadingProps {
  tag?: LkHeadingTag
  fontClass?: string
  fontColor?: string
  class?: string
}

const props = withDefaults(defineProps<LkHeadingProps>(), {
  tag: 'h2',
  fontClass: 'display2-bold',
})

defineOptions({
  inheritAttrs: false,
})

const headingAttrs = computed(() => propsToDataAttrs({}, 'heading'))

const headingClass = computed(() => {
  const classes: string[] = []
  if (props.fontClass) classes.push(props.fontClass)
  if (props.fontColor) classes.push(`color-${props.fontColor}`)
  if (props.class) classes.push(props.class)
  return classes.join(' ')
})
</script>

<template>
  <component
    :is="props.tag"
    data-lk-component="heading"
    :class="headingClass"
    v-bind="{ ...$attrs, ...headingAttrs }"
  >
    <slot />
  </component>
</template>
