<script setup lang="ts">
import { computed } from 'vue'
import { propsToDataAttrs } from '../utils/utilities'

type LkMatProps_Glass = {
  thickness?: 'thick' | 'normal' | 'thin'
  tint?: LkColor
  tintOpacity?: number
  light?: boolean
  lightExpression?: string
}

type LkMatProps_Flat = {
  bgColor?: LkColorWithOnToken
  textColor?: LkColor
}

type LkMaterialType = 'flat' | 'glass' | 'debug'

interface LkMaterialLayerProps {
  zIndex?: number
  type?: LkMaterialType
  materialProps?: LkMatProps_Glass | LkMatProps_Flat
}

const props = withDefaults(defineProps<LkMaterialLayerProps>(), {
  zIndex: 0,
})

defineOptions({
  inheritAttrs: false,
})

const matDataAttrs = computed(() => {
  if (props.materialProps && props.type) {
    return propsToDataAttrs(props.materialProps as Record<string, unknown>, props.type)
  }
  return {}
})

// Glass-specific computed styles
const glassProps = computed(() => props.materialProps as LkMatProps_Glass | undefined)

const tintStyle = computed(() => ({
  opacity: glassProps.value?.tintOpacity || 0.2,
  backgroundColor: `var(--lk-${glassProps.value?.tint || 'transparent'})`,
}))

const textureStyle = computed(() => {
  const thickness = glassProps.value?.thickness || 'normal'
  return {
    '--blur-thick': 'var(--lk-size-lg)',
    '--blur-normal': 'var(--lk-size-md)',
    '--blur-thin': 'var(--lk-size-xs)',
    zIndex: 1,
    isolation: 'isolate',
    backdropFilter: `blur(var(--blur-${thickness}))`,
  } as Record<string, string | number>
})

const lightStyle = computed(() => ({
  background: glassProps.value?.lightExpression || 'none',
  mixBlendMode: 'soft-light' as const,
  opacity: 1,
}))

const glassFillOpacity = computed(() => {
  const thickness = glassProps.value?.thickness || 'normal'
  switch (thickness) {
    case 'thick': return 0.8
    case 'normal': return 0.6
    case 'thin': return 0.4
    default: return 0.6
  }
})

const glassFillStyle = computed(() => ({
  backgroundColor: 'var(--lk-surface)',
  opacity: glassFillOpacity.value,
}))

// Flat-specific
const flatProps = computed(() => props.materialProps as LkMatProps_Flat | undefined)

const flatBgStyle = computed(() => ({
  backgroundColor: flatProps.value?.bgColor
    ? `var(--lk-${flatProps.value.bgColor})`
    : 'var(--lk-surface)',
}))
</script>

<template>
  <div
    data-lk-component="material-layer"
    :data-lk-material-type="props.type"
    :style="{ zIndex: props.zIndex }"
  >
    <!-- Glass material -->
    <template v-if="props.type === 'glass'">
      <div>
        <div data-lk-material-sublayer="texture" :style="textureStyle">
          <div
            v-if="glassProps?.tint"
            data-lk-material-sublayer="tint"
            :style="tintStyle"
          >
            <div
              v-if="glassProps?.light"
              data-lk-material-sublayer="light"
              :style="lightStyle"
            ></div>
          </div>
        </div>
        <div
          data-lk-material-sublayer="base-glass-fill"
          :style="glassFillStyle"
        ></div>
      </div>
    </template>

    <!-- Flat material -->
    <template v-if="props.type === 'flat'">
      <div>
        <div
          data-lk-material-sublayer="bgColor"
          :style="flatBgStyle"
        ></div>
      </div>
    </template>
  </div>
</template>

<style scoped>
[data-lk-component="material-layer"] {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

[data-lk-component="material-layer"] [data-lk-material-sublayer] {
  position: absolute;
  inset: 0;
  pointer-events: none;
}
</style>
