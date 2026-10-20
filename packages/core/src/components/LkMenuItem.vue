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

// LkIconProps は -bold / -mono の fontClass を許すが、LkIcon はそれを受け付けない既存の不整合。
// 公開型(LkIconProps)を狭めると破壊的変更になるため、LkIcon へバインドする箇所で型だけ合わせる(実行時は無関係)
type LkIconBinding = InstanceType<typeof LkIcon>['$props']

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
      v-bind="(startIcon as LkIconBinding)"
      data-lk-icon-position="start"
    />
    <p data-lk-menu-item-element="content-wrap">
      <slot />
    </p>
    <LkIcon
      v-if="endIcon"
      v-bind="(endIcon as LkIconBinding)"
      data-lk-icon-position="end"
    />
    <LkStateLayer />
  </div>
</template>
