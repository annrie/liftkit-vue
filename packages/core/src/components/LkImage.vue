<script setup lang="ts">
import { computed } from 'vue'
import { propsToDataAttrs } from '../utils/utilities'

type LkAspectRatio =
  | 'auto'
  | '1/1'
  | '2.39/1'
  | '2/1'
  | '16/9'
  | '3/2'
  | '4/3'
  | '5/4'
  | '1/2.39'
  | '1/2'
  | '9/16'
  | '4/5'

interface LkImageProps {
  aspect?: LkAspectRatio
  borderRadius?: LkSizeUnit | 'none' | 'zero'
  objectFit?: 'fill' | 'contain' | 'cover' | 'none' | 'scale-down'
  width?: LkSizeUnit | 'auto'
  height?: LkSizeUnit | 'auto'
  src?: string
  alt?: string
}

const props = withDefaults(defineProps<LkImageProps>(), {
  aspect: 'auto',
  objectFit: 'fill',
  width: 'auto',
  height: 'auto',
  alt: '',
})

defineOptions({
  inheritAttrs: false,
})

const dataAttrs = computed(() =>
  propsToDataAttrs(
    {
      aspect: props.aspect,
      borderRadius: props.borderRadius,
      objectFit: props.objectFit,
      width: props.width,
      height: props.height,
    },
    'image',
  ),
)
</script>

<template>
  <img
    data-lk-component="image"
    v-bind="{ ...$attrs, ...dataAttrs }"
    :src="props.src"
    :alt="props.alt"
  />
</template>
