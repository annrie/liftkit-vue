<script setup lang="ts">
import { ref, computed, useAttrs } from 'vue'
import { propsToDataAttrs } from '../utils/utilities'

export interface LkNavbarProps {
  material?: LkMaterial
  homeHref?: string
  logoSrc?: string
  logoAlt?: string
}

const props = withDefaults(defineProps<LkNavbarProps>(), {
  material: 'flat',
  homeHref: '/',
  logoSrc: '/logotype.svg',
  logoAlt: '',
})

defineOptions({
  inheritAttrs: false,
})

const attrs = useAttrs()

const menuOpen = ref(false)

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

const dataAttrs = computed(() =>
  propsToDataAttrs({ material: props.material }, 'navbar'),
)
</script>

<template>
  <div
    data-lk-component="navbar"
    v-bind="{ ...dataAttrs, ...attrs }"
  >
    <!-- Desktop Navbar -->
    <div class="navbar-desktop">
      <div data-lk-component="row" data-lk-row-align-items="center" data-lk-row-gap="sm">
        <slot name="brand">
          <a :href="homeHref">
            <img :alt="logoAlt" :src="logoSrc" data-lk-component="image" data-lk-image-height="md" />
          </a>
        </slot>
      </div>
      <div data-lk-component="row">
        <div data-lk-component="row" data-lk-slot="nav-buttons">
          <slot name="navButtons" />
        </div>
        <div data-lk-component="row" data-lk-slot="nav-dropdowns">
          <slot name="navDropdowns" />
        </div>
      </div>
      <div data-lk-component="row" data-lk-navbar-el="nav-menu-end">
        <div data-lk-slot="nav-icon-buttons">
          <slot name="iconButtons" />
        </div>
        <div data-lk-slot="nav-cta-buttons">
          <slot name="ctaButtons" />
        </div>
      </div>
    </div>

    <!-- Mobile Navbar -->
    <div data-lk-navbar-el="nav-menu">
      <div
        data-lk-component="column"
        data-lk-column-align-items="start"
        :class="['navbar-mobile', { active: menuOpen }]"
      >
        <button
          class="navbar-menu-toggle"
          type="button"
          aria-label="Toggle menu"
          :aria-expanded="menuOpen"
          @click="toggleMenu"
        >
          <slot name="menuIcon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </slot>
        </button>
        <slot name="mobileBrand">
          <a :href="homeHref">
            <img :alt="logoAlt" :src="logoSrc" data-lk-component="image" data-lk-image-width="md" data-lk-image-height="md" />
          </a>
        </slot>
        <div v-show="menuOpen" data-lk-component="column">
          <slot name="navButtons" />
        </div>
        <div v-show="menuOpen" data-lk-component="column">
          <slot name="navDropdowns" />
        </div>
        <div v-show="menuOpen">
          <slot name="iconButtons" />
        </div>
        <div v-show="menuOpen" data-lk-component="column" class="flex-h gap-sm">
          <slot name="ctaButtons" />
        </div>
      </div>
    </div>

    <!-- Glass material layer -->
    <div
      v-if="material === 'glass'"
      data-lk-component="material-layer"
      data-lk-material-layer-type="glass"
    />
  </div>
</template>
