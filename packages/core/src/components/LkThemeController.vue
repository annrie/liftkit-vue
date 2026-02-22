<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Teleport } from 'vue'
import { useTheme, type PaletteState } from '../composables'

type LkColorGroup =
  | 'master'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'neutral'
  | 'neutralvariant'
  | 'error'
  | 'warning'
  | 'success'
  | 'info'

const { palette, updateTheme, updateThemeFromMaster, colorMode, setColorMode } = useTheme()

const brandPalette: LkColorGroup[] = ['primary', 'secondary', 'tertiary']
const semanticPalette: LkColorGroup[] = ['error', 'warning', 'success', 'info']
const layoutPalette: LkColorGroup[] = ['neutral', 'neutralvariant']

const paletteArray = computed(() =>
  Object.keys(palette.value).map((key) => ({
    key,
    value: palette.value[key],
  }))
)

const isOpen = ref(false)

function handleColorChange(key: LkColorGroup, newValue: string) {
  if (key === 'master') {
    updateThemeFromMaster(newValue)
  } else {
    palette.value = {
      ...palette.value,
      [key]: newValue,
    }
  }
}

function handleColorModeSwitch() {
  setColorMode(colorMode.value === 'dark' ? 'light' : 'dark')
}

async function handleCopyPalette() {
  try {
    const codeContent = `const palette = ${JSON.stringify(palette.value, null, 2)}\nconst colorMode = '${colorMode.value}'`
    await navigator.clipboard.writeText(codeContent)
    alert('Code copied')
  } catch (err) {
    console.error('Failed to copy palette:', err)
  }
}

function getColorDescription(group: LkColorGroup): string {
  const descriptions: Record<string, string> = {
    primary: 'Main brand color, used for most UI elements.',
    secondary: 'Desaturated variant of primary.',
    tertiary: 'Your accent color. Defaults to complementary hue to primary.',
    error: 'A pink or red, indicating problems.',
    warning: 'An orange or yellow, indicating caution.',
    success: 'A green, indicating success.',
    info: 'A blue, indicating neutral information.',
    neutral: 'Backgrounds, surfaces, outlines, and default text color',
    neutralvariant: 'Surface variant, outline variant, and text color variant',
  }
  return descriptions[group] || ''
}
</script>

<template>
  <div v-if="!isOpen" class="position-fixed" :style="{ zIndex: 1000 }">
    <button
      class="lk-theme-controller-trigger shadow-xl"
      :style="{
        position: 'fixed',
        zIndex: 1000,
        top: 'var(--lk-size-xs)',
        left: 'var(--lk-size-xs)',
      }"
      @click="isOpen = true"
    >
      <span class="material-symbols-outlined display2">palette</span>
    </button>
  </div>

  <Teleport to="body">
    <div v-if="isOpen" class="lk-theme-drawer">
      <div class="lk-theme-drawer-card shadow-lg mb-2xl">
        <div class="lk-theme-drawer-scroll">
          <div class="lk-column" style="gap: var(--lk-size-md)">
            <!-- Header -->
            <div class="lk-row" style="align-items: center; justify-content: space-between">
              <h2 class="body-bold">Theme Controller</h2>
              <button class="lk-icon-button" @click="isOpen = false">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>

            <!-- Config export -->
            <div>
              <h2 class="label mb-xs">Config</h2>
              <p class="caption color-onsurfacevariant mb-xs">
                Copy and paste this snippet into your theme config to update your project to match
                the current configuration.
              </p>
              <div class="lk-theme-code-block position-relative">
                <pre style="font-size: 0.618em; overflow: auto">
const palette = {{ JSON.stringify(palette, null, 2) }}
const colorMode = '{{ colorMode }}'</pre
                >
                <button
                  class="lk-icon-button"
                  style="position: absolute; inset: 1em 1em auto auto"
                  @click="handleCopyPalette"
                >
                  <span class="material-symbols-outlined">content_copy</span>
                </button>
              </div>
            </div>

            <!-- Color Mode -->
            <div>
              <h2 class="capline mb-lg color-onsurfacevariant">Mode</h2>
              <div class="lk-row" style="align-items: start; gap: var(--lk-size-md)">
                <div class="lk-column">
                  <label class="lk-switch">
                    <input
                      type="checkbox"
                      :checked="colorMode === 'dark'"
                      @change="handleColorModeSwitch"
                    />
                    <span class="lk-switch-slider"></span>
                  </label>
                </div>
                <div class="lk-column">
                  <label class="label mb-xs">Default to Dark Mode</label>
                  <p class="caption color-onsurfacevariant mb-xs">Toggles dark mode.</p>
                </div>
              </div>
            </div>

            <!-- Master color -->
            <div>
              <h2 class="capline mb-lg color-onsurfacevariant">Globals</h2>
              <div class="lk-row" style="align-items: start; gap: var(--lk-size-md)">
                <input
                  type="color"
                  name="master"
                  class="lk-color-input"
                  @input="($event) => handleColorChange('master', ($event.target as HTMLInputElement).value)"
                />
                <div class="lk-column">
                  <label class="label mb-xs" for="master">master</label>
                  <p class="caption color-onsurfacevariant mb-xs">
                    The seed color.
                    <strong class="color-error"
                      >If you edit this, all other color tokens will reset.</strong
                    >
                  </p>
                </div>
              </div>
            </div>

            <!-- Brand colors -->
            <div>
              <h2 class="capline mb-lg color-onsurfacevariant">Brand</h2>
              <div
                v-for="colorGroup in brandPalette"
                :key="colorGroup"
                class="lk-row mb-sm"
                style="align-items: start; gap: var(--lk-size-md)"
              >
                <input
                  type="color"
                  :name="colorGroup"
                  :value="palette[colorGroup]"
                  class="lk-color-input"
                  @input="($event) => handleColorChange(colorGroup, ($event.target as HTMLInputElement).value)"
                />
                <div class="lk-column">
                  <label class="caption-bold mono mb-2xs" :for="colorGroup">{{
                    colorGroup
                  }}</label>
                  <p class="caption color-onsurfacevariant mb-xs">
                    {{ getColorDescription(colorGroup) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Semantic colors -->
            <div>
              <h2 class="capline color-onsurfacevariant mb-lg">Semantic</h2>
              <div
                v-for="colorGroup in semanticPalette"
                :key="colorGroup"
                class="lk-row mb-sm"
                style="align-items: start; gap: var(--lk-size-md)"
              >
                <input
                  type="color"
                  :name="colorGroup"
                  :value="palette[colorGroup]"
                  class="lk-color-input"
                  @input="($event) => handleColorChange(colorGroup, ($event.target as HTMLInputElement).value)"
                />
                <div class="lk-column">
                  <label class="caption-bold mono mb-2xs" :for="colorGroup">{{
                    colorGroup
                  }}</label>
                  <p class="caption color-onsurfacevariant mb-xs">
                    {{ getColorDescription(colorGroup) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- Layout colors -->
            <div>
              <h2 class="capline color-onsurfacevariant mb-lg">Layout</h2>
              <div
                v-for="colorGroup in layoutPalette"
                :key="colorGroup"
                class="lk-row mb-sm"
                style="align-items: start; gap: var(--lk-size-md)"
              >
                <input
                  type="color"
                  :name="colorGroup"
                  :value="palette[colorGroup]"
                  class="lk-color-input"
                  @input="($event) => handleColorChange(colorGroup, ($event.target as HTMLInputElement).value)"
                />
                <div class="lk-column">
                  <label class="caption-bold mono mb-xs" :for="colorGroup">{{
                    colorGroup
                  }}</label>
                  <p class="caption color-onsurfacevariant mb-xs">
                    {{ getColorDescription(colorGroup) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.lk-theme-controller-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--lk-inversesurface, #303034);
  color: var(--lk-inverseonurface, #f2f0f4);
  border: none;
  border-radius: 50%;
  width: var(--lk-size-xl, 48px);
  height: var(--lk-size-xl, 48px);
  cursor: pointer;
}

.lk-color-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: var(--lk-size-lg, 40px);
  height: var(--lk-size-lg, 40px);
  flex: 0 0 auto;
  background-color: transparent;
  border: none;
  cursor: pointer;
  outline: 2px solid var(--lk-onsurface, #1b1b1f);
  border-radius: 100em;
  padding-block: 0px;
  padding-inline: 0px;
}

.lk-color-input::-webkit-color-swatch-wrapper {
  padding: 0;
}

.lk-color-input::-webkit-color-swatch {
  border-radius: 100em;
  border: none;
}

.lk-color-input::-moz-color-swatch {
  border-radius: 100%;
  border: none;
}

.lk-theme-drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  overflow: hidden;
  width: calc(var(--lk-size-4xl, 320px) * var(--lk-wholestep, 1.5));
  z-index: 1000;
  padding: var(--lk-size-md, 16px);
}

.lk-theme-drawer-card {
  height: 100%;
  background: var(--lk-surfacecontainerlowest, #ffffff);
  border-radius: var(--lk-size-sm, 8px);
  padding: var(--lk-size-md, 16px);
}

.lk-theme-drawer-scroll {
  height: 100%;
  overflow-y: auto;
}

.lk-theme-code-block {
  background: var(--lk-surfacecontainerlowest, #ffffff);
  border-radius: var(--lk-size-xs, 4px);
  padding: var(--lk-size-sm, 8px);
  position: relative;
}

.lk-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid var(--lk-outline, #767680);
  border-radius: 50%;
  width: var(--lk-size-lg, 40px);
  height: var(--lk-size-lg, 40px);
  cursor: pointer;
  color: inherit;
}

.lk-column {
  display: flex;
  flex-direction: column;
}

.lk-row {
  display: flex;
  flex-direction: row;
}

.lk-switch {
  position: relative;
  display: inline-block;
  width: 52px;
  height: 32px;
}

.lk-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.lk-switch-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--lk-surfacecontainerhighest, #e4e1e6);
  transition: 0.3s;
  border-radius: 100em;
}

.lk-switch-slider::before {
  position: absolute;
  content: '';
  height: 24px;
  width: 24px;
  left: 4px;
  bottom: 4px;
  background-color: var(--lk-outline, #767680);
  transition: 0.3s;
  border-radius: 50%;
}

.lk-switch input:checked + .lk-switch-slider {
  background-color: var(--lk-primary, #004ee7);
}

.lk-switch input:checked + .lk-switch-slider::before {
  transform: translateX(20px);
  background-color: var(--lk-onprimary, #ffffff);
}
</style>
