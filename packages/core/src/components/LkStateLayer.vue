<script setup lang="ts">
import { computed } from 'vue'

interface LkStateLayerProps {
  bgColor?: LkColor | 'currentColor'
  forcedState?: 'hover' | 'active' | 'focus'
}

const props = withDefaults(defineProps<LkStateLayerProps>(), {
  bgColor: 'currentColor',
})

defineOptions({
  inheritAttrs: false,
})

const layerClass = computed(() =>
  props.bgColor !== 'currentColor' ? `bg-${props.bgColor}` : '',
)

const layerStyle = computed(() =>
  props.bgColor === 'currentColor' ? { backgroundColor: 'currentColor' } : {},
)
</script>

<template>
  <div
    data-lk-component="state-layer"
    :class="layerClass"
    :style="layerStyle"
    v-bind="props.forcedState ? { 'data-lk-forced-state': props.forcedState } : {}"
  ></div>
</template>
