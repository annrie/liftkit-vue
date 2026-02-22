<script lang="ts">
import type { InjectionKey, Ref } from 'vue'

export interface LkSelectOption {
  label: string
  value: string
}

export interface LkSelectContext {
  open: Ref<boolean>
  setOpen: (value: boolean) => void
  toggle: () => void
  triggerRef: Ref<HTMLElement | null>
  contentRef: Ref<HTMLDivElement | null>
  selectedValue: Ref<string>
  setSelectedValue: (value: string) => void
  options: Ref<LkSelectOption[]>
  name: string | undefined
}

export const SELECT_INJECTION_KEY: InjectionKey<LkSelectContext> = Symbol('liftkit-select')

export interface LkSelectProps {
  modelValue?: string
  options?: LkSelectOption[]
  name?: string
  label?: string
  labelPosition?: 'default' | 'on-input'
  helpText?: string
  placeholderText?: string
}
</script>

<script setup lang="ts">
import { ref, computed, watch, provide, onMounted, onBeforeUnmount } from 'vue'

const props = withDefaults(defineProps<LkSelectProps>(), {
  modelValue: '',
  options: () => [],
  labelPosition: 'default',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const open = ref(false)
const triggerRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLDivElement | null>(null)
const hiddenSelectRef = ref<HTMLSelectElement | null>(null)
const selectedValue = ref(props.modelValue)

// Sync with v-model
watch(
  () => props.modelValue,
  (newVal) => {
    selectedValue.value = newVal ?? ''
  },
)

function setOpen(value: boolean) {
  open.value = value
}

function toggle() {
  setOpen(!open.value)
}

function setSelectedValue(value: string) {
  selectedValue.value = value
  emit('update:modelValue', value)
  setOpen(false)
}

// Singleton registry for ensuring only one select open at a time
let registryInstance: { close: () => void } | null = null

watch(open, (isOpen) => {
  if (isOpen) {
    registryInstance = { close: () => setOpen(false) }
    // Close other selects via a global event
    window.dispatchEvent(new CustomEvent('lk-select-opened', { detail: registryInstance }))
  }
})

function handleOtherSelectOpened(e: Event) {
  const customEvent = e as CustomEvent
  if (registryInstance && customEvent.detail !== registryInstance && open.value) {
    setOpen(false)
  }
}

// Click outside detection
function handleClickOutside(e: MouseEvent) {
  if (
    contentRef.value &&
    !contentRef.value.contains(e.target as Node) &&
    triggerRef.value &&
    !triggerRef.value.contains(e.target as Node)
  ) {
    setOpen(false)
  }
}

// Keyboard navigation
function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && open.value) {
    setOpen(false)
    triggerRef.value?.focus()
  }
}

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutside)
  document.addEventListener('keydown', handleKeyDown)
  window.addEventListener('lk-select-opened', handleOtherSelectOpened)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutside)
  document.removeEventListener('keydown', handleKeyDown)
  window.removeEventListener('lk-select-opened', handleOtherSelectOpened)
})

const optionsRef = computed(() => props.options)

provide(SELECT_INJECTION_KEY, {
  open,
  setOpen,
  toggle,
  triggerRef,
  contentRef,
  selectedValue,
  setSelectedValue,
  options: optionsRef,
  name: props.name,
})
</script>

<template>
  <div data-lk-component="select" v-bind="$attrs">
    <!-- Hidden native select for form compatibility -->
    <select
      ref="hiddenSelectRef"
      :name="name"
      :value="selectedValue"
      tabindex="-1"
      aria-hidden="true"
      style="position: absolute; left: -9999px; width: 1px; height: 1px; opacity: 0; pointer-events: none;"
    >
      <option value="" disabled />
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <slot
      :is-open="open"
      :toggle="toggle"
      :selected-value="selectedValue"
      :set-selected-value="setSelectedValue"
    />
  </div>
</template>
