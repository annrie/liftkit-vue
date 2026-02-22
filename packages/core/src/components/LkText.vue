<script setup lang="ts">
import { computed } from 'vue'

interface LkTextProps {
  tag?: string
  fontClass?: LkFontClass
  color?: LkColor
  class?: string
}

const props = withDefaults(defineProps<LkTextProps>(), {
  tag: 'div',
})

defineOptions({
  inheritAttrs: false,
})

const textClass = computed(() => {
  const classes: string[] = []
  if (props.fontClass) classes.push(props.fontClass)
  if (props.color) classes.push(`color-${props.color}`)
  if (props.class) classes.push(props.class)
  return classes.join(' ')
})
</script>

<template>
  <component
    :is="props.tag"
    data-lk-component="text"
    :class="textClass"
    v-bind="$attrs"
  >
    <slot />
  </component>
</template>
