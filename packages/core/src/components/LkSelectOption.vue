<script setup lang="ts">
import { computed, inject } from 'vue'
import { SELECT_INJECTION_KEY, type LkSelectContext } from './LkSelect.vue'

export interface LkSelectOptionProps {
  value: string
}

const props = defineProps<LkSelectOptionProps>()

const ctx = inject<LkSelectContext>(SELECT_INJECTION_KEY)
if (!ctx) {
  throw new Error('LkSelectOption must be used inside an LkSelect component')
}

const { selectedValue, setSelectedValue } = ctx

const isSelected = computed(() => selectedValue.value === props.value)

function handleClick() {
  setSelectedValue(props.value)
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    handleClick()
  }
}
</script>

<template>
  <div
    role="menuitem"
    data-lk-component="menu-item"
    :tabindex="0"
    :data-selected="isSelected"
    :style="{
      cursor: 'pointer',
      fontWeight: isSelected ? 'bold' : 'normal',
    }"
    class="select-option"
    @click="handleClick"
    @keydown="handleKeyDown"
  >
    <slot name="startIcon" />
    <p data-lk-menu-item-element="content-wrap">
      <slot />
    </p>
    <slot name="endIcon" />
    <div
      data-lk-component="state-layer"
      :data-lk-state-layer-forced-state="isSelected ? 'active' : undefined"
    />
  </div>
</template>
