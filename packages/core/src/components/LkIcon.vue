<script setup lang="ts">
import { computed } from 'vue'

interface LkIconProps {
  name?: string
  fontClass?: Exclude<LkFontClass, `${string}-bold` | `${string}-mono`>
  color?: LkColor | 'currentColor'
  display?: 'block' | 'inline-block' | 'inline'
  strokeWidth?: number
  opticShift?: boolean
}

const props = withDefaults(defineProps<LkIconProps>(), {
  name: 'roller-coaster',
  color: 'onsurface',
  strokeWidth: 2,
  opticShift: false,
})

defineOptions({
  inheritAttrs: false,
})

const iconStyle = computed(() => ({
  width: '1em',
  height: '1em',
  color: `var(--lk-${props.color})`,
  strokeWidth: props.strokeWidth,
}))
</script>

<template>
  <div
    data-lk-component="icon"
    :data-lk-icon-offset="props.opticShift"
    :data-lk-icon-font-class="props.fontClass"
    v-bind="$attrs"
  >
    <slot>
      <!-- Default: render lucide icon via dynamic component or slot override -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="1em"
        height="1em"
        viewBox="0 0 24 24"
        fill="none"
        :stroke="`var(--lk-${props.color})`"
        :stroke-width="props.strokeWidth"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <!-- Icon content should be provided by lucide-vue-next or slot -->
      </svg>
    </slot>
  </div>
</template>
