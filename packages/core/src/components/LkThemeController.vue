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

const { palette, updateTheme, updateThemeFromMaster, colorMode, colorModePreference, setColorMode } = useTheme()

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

function handleColorModeChange(mode: 'auto' | 'light' | 'dark') {
  setColorMode(mode)
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
      <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="2 2 20 20" fill="currentColor"><path d="M12 2C6.49 2 2 6.49 2 12s4.49 10 10 10a2.5 2.5 0 0 0 2.5-2.5c0-.61-.23-1.21-.64-1.67a.528.528 0 0 1-.13-.33c0-.28.22-.5.5-.5H16c3.31 0 6-2.69 6-6 0-4.96-4.49-9-10-9m-5.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/></svg>
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
              <button
                :style="{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#e8e0e5',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  cursor: 'pointer',
                  padding: '0',
                }"
                @click="isOpen = false"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style="display: block"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="#1b1b1f"/></svg>
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
                  :style="{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#e8e0e5',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    cursor: 'pointer',
                    padding: '0',
                    position: 'absolute',
                    top: '1em',
                    right: '1em',
                  }"
                  @click="handleCopyPalette"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" style="display: block"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" fill="#1b1b1f"/></svg>
                </button>
              </div>
            </div>

            <!-- Color Mode -->
            <div>
              <h2 class="capline mb-lg color-onsurfacevariant">Mode</h2>
              <p class="caption color-onsurfacevariant mb-xs">
                Current: {{ colorMode }} {{ colorModePreference === 'auto' ? '(auto)' : '' }}
              </p>
              <div class="lk-row" style="gap: var(--lk-size-xs)">
                <button
                  v-for="mode in (['auto', 'light', 'dark'] as const)"
                  :key="mode"
                  class="lk-mode-button"
                  :class="{ active: colorModePreference === mode }"
                  @click="handleColorModeChange(mode)"
                >
                  {{ mode }}
                </button>
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
  background: var(--light__inversesurface_lkv, #303034);
  color: var(--light__inverseonsurface_lkv, #f2f0f4);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  cursor: pointer;
}

.lk-color-input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 36px;
  height: 36px;
  flex: 0 0 auto;
  background-color: transparent;
  border: 2px solid var(--light__onsurface_lkv, #1b1b1f);
  cursor: pointer;
  outline: none;
  border-radius: 100em;
  padding: 0;
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
  background: var(--light__surfacecontainerlowest_lkv, #ffffff);
  color: var(--light__onsurface_lkv, #1b1b1f);
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
  background: var(--light__surfacecontainerhigh_lkv, #e8e0e5);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: pointer;
  color: var(--light__onsurface_lkv, #1b1b1f);
}

.lk-column {
  display: flex;
  flex-direction: column;
}

.lk-row {
  display: flex;
  flex-direction: row;
}

.lk-mode-button {
  flex: 1;
  padding: 6px 12px;
  border: 1px solid var(--light__outline_lkv, #767680);
  border-radius: 100em;
  background: transparent;
  color: var(--light__onsurface_lkv, #1b1b1f);
  cursor: pointer;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

.lk-mode-button.active {
  background: var(--light__primary_lkv, #004ee7);
  color: var(--light__onprimary_lkv, #ffffff);
  border-color: var(--light__primary_lkv, #004ee7);
}
</style>
