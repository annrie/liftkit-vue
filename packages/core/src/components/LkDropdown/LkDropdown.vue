<script setup lang="ts">
import { provideDropdown } from '../../composables'

const { open, toggle, setOpen } = provideDropdown()
</script>

<template>
  <div
    data-lk-component="dropdown"
    v-bind="$attrs"
  >
    <slot :is-open="open" :toggle="toggle" :close="() => setOpen(false)" />
  </div>
</template>
