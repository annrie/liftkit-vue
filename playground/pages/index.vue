<script setup lang="ts">
// Components are auto-imported via the Nuxt module
</script>

<template>
  <LkTheme source-color="#6750A4">
    <div style="padding: 2rem">
      <h1 class="display1 mb-lg">LiftKit Vue Playground</h1>
      <p class="body mb-xl color-onsurfacevariant">
        Welcome to LiftKit Vue components. This playground showcases the component library.
      </p>

      <section style="margin-bottom: 2rem">
        <h2 class="heading mb-md">Theme</h2>
        <p class="body mb-md color-onsurfacevariant">
          The LkTheme component wraps everything and provides Material Design 3 color tokens. Use
          the LkThemeController to interactively adjust the palette.
        </p>
        <LkThemeController />
      </section>

      <section style="margin-bottom: 2rem">
        <h2 class="heading mb-md">Typography</h2>
        <div style="display: flex; flex-direction: column; gap: 0.5rem">
          <p class="display1">Display 1</p>
          <p class="display2">Display 2</p>
          <p class="heading">Heading</p>
          <p class="subheading">Subheading</p>
          <p class="body">Body text</p>
          <p class="body-bold">Body bold</p>
          <p class="label">Label</p>
          <p class="caption">Caption</p>
        </div>
      </section>

      <section style="margin-bottom: 2rem">
        <h2 class="heading mb-md">Color Tokens</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
          <div
            v-for="color in [
              'primary',
              'secondary',
              'tertiary',
              'error',
              'warning',
              'success',
              'info',
            ]"
            :key="color"
            :style="{
              background: `var(--light__${color}_lkv)`,
              color: `var(--light__on${color}_lkv)`,
              padding: '1rem 1.5rem',
              borderRadius: '0.5rem',
            }"
          >
            {{ color }}
          </div>
        </div>
      </section>

      <section style="margin-bottom: 2rem">
        <h2 class="heading mb-md">Surface Tokens</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 0.5rem">
          <div
            v-for="surface in [
              'surface',
              'surfacecontainerlowest',
              'surfacecontainerlow',
              'surfacecontainer',
              'surfacecontainerhigh',
              'surfacecontainerhighest',
            ]"
            :key="surface"
            :style="{
              background: `var(--light__${surface}_lkv)`,
              color: `var(--light__onsurface_lkv)`,
              padding: '1rem 1.5rem',
              borderRadius: '0.5rem',
              border: '1px solid var(--light__outlinevariant_lkv)',
            }"
          >
            {{ surface }}
          </div>
        </div>
      </section>
    </div>
  </LkTheme>
</template>
