<script setup lang="ts">
import { computed } from 'vue'
import { getOnToken } from '../utils/colorUtils'

export interface LkSwitchProps {
  modelValue?: boolean
  offColor?: LkColorWithOnToken
  onColor?: LkColorWithOnToken
}

const props = withDefaults(defineProps<LkSwitchProps>(), {
  modelValue: false,
  offColor: 'surfacevariant',
  onColor: 'primary',
})

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

defineOptions({
  inheritAttrs: false,
})

const switchThumbOffColor = computed(() => getOnToken(props.offColor))
const switchThumbOnColor = computed(() => getOnToken(props.onColor))

function handleClick() {
  emit('update:modelValue', !props.modelValue)
}

const switchState = computed(() => (props.modelValue ? 'on' : 'off'))

const switchStyles = computed(() => ({
  '--switch-off-color': `var(--lk-${props.offColor})`,
  '--switch-on-color': `var(--lk-${props.onColor})`,
  '--switch-thumb-off-color': `var(--lk-${switchThumbOffColor.value})`,
  '--switch-thumb-on-color': `var(--lk-${switchThumbOnColor.value})`,
}))
</script>

<template>
  <div
    data-lk-component="switch"
    v-bind="{ ...$attrs, style: switchStyles }"
    :data-lk-switch-state="switchState"
    @click="handleClick"
  >
    <div
      data-lk-component="switch-thumb"
      :data-lk-switch-state="switchState"
    />
  </div>
</template>

<style scoped>
[data-lk-component="switch"] {
  position: relative;
  display: block;
  align-items: center;
  justify-content: start;
  width: var(--lk-size-xl);
  height: calc(var(--lk-size-md) + calc(var(--lk-size-2xs) * 2));
  background-color: var(--switch-off-color);
  border-radius: 100em;
  cursor: pointer;
}

[data-lk-component="switch"][data-lk-switch-state="on"] {
  background-color: var(--switch-on-color);
}

[data-lk-component="switch-thumb"] {
  position: absolute;
  top: 50%;
  left: var(--lk-size-2xs);
  right: auto;
  width: var(--lk-size-md);
  height: var(--lk-size-md);
  border-radius: 50%;
  background-color: var(--switch-thumb-off-color);
  transform: translateY(-50%);
  transition: left 0.1s ease-out;
}

[data-lk-component="switch-thumb"][data-lk-switch-state="on"] {
  left: calc(100% - calc(var(--lk-size-md) + var(--lk-size-2xs)));
  background-color: var(--switch-thumb-on-color);
}
</style>
