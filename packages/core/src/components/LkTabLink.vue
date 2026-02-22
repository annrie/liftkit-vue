<script setup lang="ts">
import { computed } from 'vue'
import { propsToDataAttrs } from '../utils/utilities'
import LkText from './LkText.vue'

export interface LkTabLinkProps {
  selected?: boolean
  fontClass?: LkFontClass
  indicatorClass?: string
}

const props = withDefaults(defineProps<LkTabLinkProps>(), {
  selected: false,
  fontClass: 'body',
  indicatorClass: 'lk-indicator',
})

defineOptions({
  inheritAttrs: false,
})

const dataAttrs = computed(() =>
  propsToDataAttrs(
    {
      selected: props.selected,
      fontClass: props.fontClass,
      indicatorClass: props.indicatorClass,
    },
    'tab-link',
  ),
)

const textStyle = computed(() =>
  props.selected ? { fontWeight: 700 } : {},
)
</script>

<template>
  <div
    data-lk-component="tab-link"
    v-bind="{ ...$attrs, ...dataAttrs }"
  >
    <div data-lk-slot="child">
      <LkText :font-class="fontClass" :style="textStyle">
        <slot />
      </LkText>
    </div>
    <div :class="indicatorClass" />
  </div>
</template>
