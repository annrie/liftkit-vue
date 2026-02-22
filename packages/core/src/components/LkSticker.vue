<script setup lang="ts">
import { computed } from 'vue'
import { getOnToken } from '../utils/colorUtils'

interface LkStickerProps {
  fontClass?: LkFontClass
  bgColor?: LkColor
  class?: string
}

const props = withDefaults(defineProps<LkStickerProps>(), {
  fontClass: 'label',
  bgColor: 'primarycontainer',
})

defineOptions({
  inheritAttrs: false,
})

const onColor = computed(() => getOnToken(props.bgColor))

const stickerClass = computed(() => {
  const classes: string[] = [
    `bg-${props.bgColor}`,
    `color-${onColor.value}`,
  ]
  if (props.class) classes.push(props.class)
  return classes.join(' ')
})
</script>

<template>
  <div
    data-lk-component="sticker"
    :class="stickerClass"
    v-bind="$attrs"
  >
    <LkText :font-class="props.fontClass">
      <slot>Sticker</slot>
    </LkText>
  </div>
</template>
