<script setup lang="ts">
import { computed, inject } from 'vue'
import type { Ref } from 'vue'

export interface LkTabContentProps {
  index: number
}

const props = defineProps<LkTabContentProps>()

defineOptions({
  inheritAttrs: false,
})

const tabsContext = inject<{ activeTab: Ref<number> } | null>('lk-tabs', null)

const isVisible = computed(() => {
  if (tabsContext) {
    return tabsContext.activeTab.value === props.index
  }
  return true
})
</script>

<template>
  <div
    v-show="isVisible"
    data-lk-component="tab-content"
    v-bind="$attrs"
  >
    <slot />
  </div>
</template>
