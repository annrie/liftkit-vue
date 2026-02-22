<script setup lang="ts">
import { ref, watch, onMounted, onBeforeUnmount, inject } from 'vue'
import { SELECT_INJECTION_KEY, type LkSelectContext } from './LkSelect.vue'
import LkCard from './LkCard.vue'

export interface LkSelectMenuProps {
  scaleFactor?: LkFontClass
}

const props = withDefaults(defineProps<LkSelectMenuProps>(), {
  scaleFactor: 'body',
})

const ctx = inject<LkSelectContext>(SELECT_INJECTION_KEY)
if (!ctx) {
  throw new Error('LkSelectMenu must be used inside an LkSelect component')
}

const { open, triggerRef, contentRef } = ctx
const localContentRef = ref<HTMLDivElement | null>(null)
const positionStyle = ref<Record<string, string>>({})

function calculatePosition() {
  if (!triggerRef.value) return

  const rect = triggerRef.value.getBoundingClientRect()
  positionStyle.value = {
    top: `${rect.bottom + window.scrollY}px`,
    left: `${rect.left + window.scrollX}px`,
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
      data-lk-component="select-menu"
      :data-isactive="open"
    >
      <LkCard class="shadow-xl" :scale-factor="scaleFactor">
        <div data-lk-component="column" data-lk-column-gap="none" :class="scaleFactor">
          <slot />
        </div>
      </LkCard>
    </div>
  </Teleport>
</template>
