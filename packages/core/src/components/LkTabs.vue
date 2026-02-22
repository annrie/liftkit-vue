<script setup lang="ts">
import { ref, computed, watch, provide } from 'vue'
import { propsToDataAttrs } from '../utils/utilities'
import LkTabMenu from './LkTabMenu.vue'

export interface LkTabsProps {
  tabLinks: string[]
  scrollableContent?: boolean
  defaultTab?: number
}

const props = withDefaults(defineProps<LkTabsProps>(), {
  scrollableContent: false,
  defaultTab: 0,
})

const emit = defineEmits<{
  'activeTabChange': [index: number]
}>()

defineOptions({
  inheritAttrs: false,
})

const activeTab = ref(props.defaultTab)

function setActiveTab(index: number) {
  activeTab.value = index
}

watch(activeTab, (newVal) => {
  emit('activeTabChange', newVal)
})

provide('lk-tabs', {
  activeTab,
  setActiveTab,
})

const dataAttrs = computed(() =>
  propsToDataAttrs({ activeTab: activeTab.value }, 'tabs'),
)
</script>

<template>
  <div
    data-lk-component="tabs"
    :data-lk-tabs-content-scrollable="scrollableContent || undefined"
    v-bind="{ ...$attrs, ...dataAttrs }"
  >
    <LkTabMenu
      :tab-links="tabLinks"
      justify-content="start"
      align-items="stretch"
      :active-tab="activeTab"
      @update:active-tab="setActiveTab"
    />
    <div
      data-lk-tabs-el="tab-content"
      :data-lk-tabs-content-scrollable="scrollableContent || undefined"
    >
      <slot :active-tab="activeTab" />
    </div>
  </div>
</template>
