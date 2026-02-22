<script setup lang="ts">
import { inject, ref, onMounted, onBeforeUnmount } from 'vue'
import { SELECT_INJECTION_KEY, type LkSelectContext } from './LkSelect.vue'

const ctx = inject<LkSelectContext>(SELECT_INJECTION_KEY)
if (!ctx) {
  throw new Error('LkSelectTrigger must be used inside an LkSelect component')
}

const { open, toggle, triggerRef } = ctx
const localRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (localRef.value) {
    const firstChild = localRef.value.firstElementChild as HTMLElement | null
    if (firstChild) {
      triggerRef.value = firstChild
    } else {
      triggerRef.value = localRef.value
    }
  }
})

onBeforeUnmount(() => {
  triggerRef.value = null
})

function handleClick() {
  toggle()
}
</script>

<template>
  <div
    ref="localRef"
    data-lk-component="select-trigger"
    :aria-expanded="open"
    aria-haspopup="menu"
    @click="handleClick"
  >
    <slot />
  </div>
</template>
