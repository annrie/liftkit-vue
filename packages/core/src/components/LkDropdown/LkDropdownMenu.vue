<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import { useDropdown } from '../../composables'
import LkCard from '../LkCard.vue'

export interface LkDropdownMenuProps {
  scaleFactor?: LkFontClass
}

const props = withDefaults(defineProps<LkDropdownMenuProps>(), {
  scaleFactor: 'body',
})

const { open, triggerRef, contentRef } = useDropdown()
const localContentRef = ref<HTMLDivElement | null>(null)
const positionStyle = ref<Record<string, string>>({})
const triggerQuadrant = ref<string>('bottom-left')

function calculatePosition() {
  if (!triggerRef.value) return

  const rect = triggerRef.value.getBoundingClientRect()
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  const isTop = rect.top < windowHeight / 2
  const isLeft = rect.left < windowWidth / 2

  if (isTop) {
    triggerQuadrant.value = isLeft ? 'bottom-left' : 'bottom-right'
  } else {
    triggerQuadrant.value = isLeft ? 'top-left' : 'top-right'
  }

  switch (triggerQuadrant.value) {
    case 'top-left':
      positionStyle.value = {
        top: `${rect.top + window.scrollY}px`,
        left: `${rect.left + window.scrollX}px`,
      }
      break
    case 'top-right':
      positionStyle.value = {
        top: `${rect.top + window.scrollY}px`,
        left: `${rect.right + window.scrollX}px`,
      }
      break
    case 'bottom-right':
      positionStyle.value = {
        top: `${rect.bottom + window.scrollY}px`,
        left: `${rect.right + window.scrollX}px`,
      }
      break
    case 'bottom-left':
    default:
      positionStyle.value = {
        top: `${rect.bottom + window.scrollY}px`,
        left: `${rect.left + window.scrollX}px`,
      }
      break
  }
}

watch(open, (isOpen) => {
  if (isOpen) {
    calculatePosition()
  }
})

onMounted(() => {
  if (localContentRef.value) {
    contentRef.value = localContentRef.value
  }
})

onBeforeUnmount(() => {
  contentRef.value = null
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="open && triggerRef"
      ref="localContentRef"
      :style="positionStyle"
      role="menu"
      data-lk-component="dropdown-menu"
      :data-isactive="open"
      :data-lk-dropdown-trigger-quadrant="triggerQuadrant"
    >
      <LkCard class="shadow-xl" :scale-factor="scaleFactor">
        <div data-lk-component="column" data-lk-column-gap="none" :class="scaleFactor">
          <slot />
        </div>
      </LkCard>
    </div>
  </Teleport>
</template>
