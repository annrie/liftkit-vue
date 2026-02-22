<script setup lang="ts">
import { computed, ref, watch, onMounted, onUnmounted, useAttrs } from 'vue'
import { propsToDataAttrs } from '../utils/utilities'
import { getOnToken } from '../utils/colorUtils'
import LkCard from './LkCard.vue'

export interface LkSnackbarProps {
  globalColor?: LkColorWithOnToken
  message?: string
  modelValue?: boolean
  autoDismiss?: number
}

const props = withDefaults(defineProps<LkSnackbarProps>(), {
  message: 'Notification text goes here.',
  modelValue: true,
  autoDismiss: 0,
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

defineOptions({
  inheritAttrs: false,
})

const attrs = useAttrs()

const isVisible = ref(props.modelValue)
let dismissTimer: ReturnType<typeof setTimeout> | null = null

watch(
  () => props.modelValue,
  (newVal) => {
    isVisible.value = newVal
    if (newVal && props.autoDismiss > 0) {
      startDismissTimer()
    }
  },
)

function startDismissTimer() {
  clearDismissTimer()
  if (props.autoDismiss > 0) {
    dismissTimer = setTimeout(() => {
      isVisible.value = false
      emit('update:modelValue', false)
    }, props.autoDismiss)
  }
}

function clearDismissTimer() {
  if (dismissTimer) {
    clearTimeout(dismissTimer)
    dismissTimer = null
  }
}

onMounted(() => {
  if (isVisible.value && props.autoDismiss > 0) {
    startDismissTimer()
  }
})

onUnmounted(() => {
  clearDismissTimer()
})

const dataAttrs = computed(() =>
  propsToDataAttrs(
    {
      globalColor: props.globalColor,
      message: props.message,
    },
    'snackbar',
  ),
)

const onColorToken = computed(() => {
  if (!props.globalColor) return undefined
  return getOnToken(props.globalColor as LkColor)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      data-lk-component="snackbar"
      v-bind="{ ...dataAttrs, ...attrs }"
    >
      <LkCard
        :scale-factor="$slots.icon ? 'subheading' : 'body'"
        :bg-color="globalColor"
        :optical-correction="$slots.icon ? 'none' : 'y'"
        class="shadow-sm"
      >
        <div data-lk-component="row" data-lk-row-align-items="center">
          <!-- Icon slot -->
          <div v-if="$slots.icon" data-lk-slot="snackbar-icon">
            <slot name="icon" :on-color="onColorToken" />
          </div>

          <!-- Message / default content slot -->
          <div data-lk-slot="snackbar-text">
            <slot :on-color="onColorToken" :global-color="globalColor">
              <p>{{ message }}</p>
            </slot>
          </div>

          <div data-lk-component="row">
            <!-- Action buttons slot -->
            <div v-if="$slots.action" data-lk-slot="snackbar-actions">
              <slot name="action" :on-color="onColorToken" :global-color="globalColor" />
            </div>

            <!-- Icon action buttons (dismiss etc.) slot -->
            <div v-if="$slots.iconAction" data-lk-slot="snackbar-icon-actions">
              <slot name="iconAction" :on-color="onColorToken" :global-color="globalColor" />
            </div>
          </div>
        </div>
      </LkCard>
    </div>
  </Teleport>
</template>
