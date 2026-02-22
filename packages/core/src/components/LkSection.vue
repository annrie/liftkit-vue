<script setup lang="ts">
import { computed } from 'vue'
import { propsToDataAttrs } from '../utils/utilities'

type SpacingSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none'

interface LkSectionProps {
  padding?: SpacingSize
  px?: SpacingSize
  py?: SpacingSize
  pt?: SpacingSize
  pb?: SpacingSize
  pl?: SpacingSize
  pr?: SpacingSize
}

const props = defineProps<LkSectionProps>()

defineOptions({
  inheritAttrs: false,
})

const dataAttrs = computed(() =>
  propsToDataAttrs(
    {
      padding: props.padding,
      px: props.px,
      py: props.py,
      pt: props.pt,
      pb: props.pb,
      pl: props.pl,
      pr: props.pr,
    },
    'section',
  ),
)
</script>

<template>
  <section v-bind="{ ...$attrs, ...dataAttrs }">
    <div data-lk-component="section">
      <slot />
    </div>
  </section>
</template>
