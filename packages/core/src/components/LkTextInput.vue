<script setup lang="ts">
import { computed } from 'vue'
import { propsToDataAttrs } from '../utils/utilities'
import LkIcon from './LkIcon.vue'
import LkStateLayer from './LkStateLayer.vue'
import LkRow from './LkRow.vue'
import LkText from './LkText.vue'

export interface LkTextInputProps {
  modelValue?: string
  labelPosition?: 'default' | 'on-input'
  helpText?: string
  placeholder?: string
  name?: string
  endIcon?: string
  labelBackgroundColor?: LkColor
}

const props = withDefaults(defineProps<LkTextInputProps>(), {
  modelValue: '',
  labelPosition: 'default',
  placeholder: 'Placeholder',
  name: 'Label',
  endIcon: 'search',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

defineOptions({
  inheritAttrs: false,
})

const textInputAttrs = computed(() =>
  propsToDataAttrs({ labelPosition: props.labelPosition }, 'text-input'),
)

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const onInputLabelClass = computed(() => {
  let cls = 'body'
  if (props.labelBackgroundColor) {
    cls += ` bg-${props.labelBackgroundColor}`
  }
  if (props.modelValue) {
    cls += ' on-field-with-value-set'
  }
  return cls
})
</script>

<template>
  <div
    data-lk-component="text-input"
    v-bind="{ ...$attrs, ...textInputAttrs }"
  >
    <label
      v-if="labelPosition === 'default'"
      :for="name"
      class="label"
    >
      {{ name }}
    </label>

    <div
      data-lk-text-input-el="input-wrap"
      :data-lk-input-help-text="helpText ? 'true' : 'false'"
      :data-help-text="helpText"
    >
      <label
        v-if="labelPosition === 'on-input'"
        :for="name"
        :class="onInputLabelClass"
      >
        {{ name }}
      </label>
      <input
        type="text"
        :name="name"
        :id="name"
        :placeholder="labelPosition !== 'on-input' ? placeholder : ''"
        :value="modelValue"
        @input="onInput"
      />
      <LkStateLayer />
      <LkIcon :name="endIcon" />
    </div>

    <LkRow v-if="helpText" align-items="center">
      <LkIcon
        name="info"
        font-class="capline"
        color="outline"
        :optic-shift="true"
      />
      <LkText color="outline" font-class="caption" class="m-left-2xs">
        Help text goes here
      </LkText>
    </LkRow>
  </div>
</template>
