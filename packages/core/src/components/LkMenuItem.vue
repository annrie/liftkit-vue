<script setup lang="ts">
import LkStateLayer from './LkStateLayer.vue'
import LkIcon from './LkIcon.vue'

export interface LkIconProps {
  name?: string
  color?: LkColor
  fontClass?: LkFontClass
  strokeWidth?: number
  opticShift?: boolean
  [key: string]: unknown
}

export interface LkMenuItemProps {
  startIcon?: LkIconProps
  endIcon?: LkIconProps
  fontClass?: LkFontClass
  title?: string
}

const props = withDefaults(defineProps<LkMenuItemProps>(), {
  fontClass: 'body',
})

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <div
    data-lk-component="menu-item"
    :title="title"
    v-bind="$attrs"
  >
    <LkIcon
      v-if="startIcon"
      v-bind="startIcon"
      data-lk-icon-position="start"
    />
    <p data-lk-menu-item-element="content-wrap">
      <slot />
    </p>
    <LkIcon
      v-if="endIcon"
      v-bind="endIcon"
      data-lk-icon-position="end"
    />
    <LkStateLayer />
  </div>
</template>
