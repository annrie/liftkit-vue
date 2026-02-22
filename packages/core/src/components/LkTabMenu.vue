<script setup lang="ts">
import { computed } from 'vue'
import { propsToDataAttrs } from '../utils/utilities'
import LkRow from './LkRow.vue'
import LkTabLink from './LkTabLink.vue'

export interface LkTabMenuProps {
  tabLinks?: string[]
  alignItems?: 'start' | 'center' | 'end' | 'stretch'
  justifyContent?: 'start' | 'center' | 'end' | 'space-between' | 'space-around'
  activeTab?: number
}

const props = withDefaults(defineProps<LkTabMenuProps>(), {
  tabLinks: () => ['Tab Link 1', 'Tab Link 2', 'Tab Link 3'],
  activeTab: 0,
})

const emit = defineEmits<{
  'update:activeTab': [index: number]
}>()

defineOptions({
  inheritAttrs: false,
})

const dataAttrs = computed(() =>
  propsToDataAttrs(
    {
      alignItems: props.alignItems,
      justifyContent: props.justifyContent,
      activeTab: props.activeTab,
    },
    'tab-menu',
  ),
)

function handleTabClick(index: number) {
  emit('update:activeTab', index)
}
</script>

<template>
  <div
    data-lk-component="tab-menu"
    v-bind="{ ...$attrs, ...dataAttrs }"
  >
    <LkRow :align-items="alignItems" :justify-content="justifyContent">
      <LkTabLink
        v-for="(label, index) in tabLinks"
        :key="index"
        :selected="index === activeTab"
        @click="handleTabClick(index)"
      >
        <div>{{ label ?? 'Tab Link' }}</div>
      </LkTabLink>
    </LkRow>
  </div>
</template>
