<script setup lang="ts">
import { useDropdown } from '../../composables'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const { open, toggle, triggerRef } = useDropdown()
const localRef = ref<HTMLElement | null>(null)

onMounted(() => {
  // Assign the first child element as the trigger ref
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
    data-lk-component="dropdown-trigger"
    :aria-expanded="open"
    aria-haspopup="menu"
    @click="handleClick"
  >
    <slot />
  </div>
</template>
