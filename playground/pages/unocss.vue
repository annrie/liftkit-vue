<script setup lang="ts">
import { ref, watchEffect, onMounted } from 'vue'

const isDark = ref(false)

onMounted(() => {
  // Check user OS preference on load
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    isDark.value = true
  }
})

function toggleDark() {
  isDark.value = !isDark.value
  if (isDark.value) {
    document.documentElement.classList.add('dark')
    document.documentElement.style.colorScheme = 'dark'
  } else {
    document.documentElement.classList.remove('dark')
    document.documentElement.style.colorScheme = 'light'
  }
}

const activeTab = ref(0)
const tabs = ['Theme & Tokens', 'Layout & Spacing', 'Typography', 'Components']

// Dummy state for components tab
const switchValue = ref(false)
const textInputValue = ref('')
</script>

<template>
  <div class="min-h-screen bg-surface text-onsurface font-sans transition-colors duration-300">
    <header class="border-b border-outline bg-surfacecontainer flex justify-between items-center py-md px-xl">
      <div class="max-w-7xl w-full">
        <h1 class="display1-bold tracking-tight text-primary">UnoCSS Preset Verification Showcase</h1>
        <p class="mt-sm text-onbackground opacity-80 body">Testing strictly with UnoCSS Utility Classes mapped to LiftKit.</p>
      </div>
      <button class="bg-primary text-onprimary px-md py-sm rounded-full cursor-pointer whitespace-nowrap shadow-sm hover:opacity-90 transition" @click="toggleDark">
        Toggle {{ isDark ? 'Light' : 'Dark' }}
      </button>
    </header>

    <main class="max-w-7xl mx-auto px-xl py-lg">
      <!-- Tabs -->
      <div class="flex space-x-md border-b border-outlinevariant mb-xl overflow-x-auto">
        <button
          v-for="(tab, index) in tabs"
          :key="index"
          @click="activeTab = index"
          class="pb-sm px-sm text-lg font-semibold transition-colors duration-200 whitespace-nowrap cursor-pointer"
          :class="activeTab === index ? 'text-primary border-b-2 border-primary' : 'text-onsurfacevariant hover:text-onsurface'"
        >
          {{ tab }}
        </button>
      </div>

      <!-- Tab 0: Theme & Tokens -->
      <div v-show="activeTab === 0" class="space-y-xl animate-fade-in">
        <section class="space-y-md">
          <h2 class="title1-bold">Material 3 Core Colors</h2>
          <div class="flex flex-wrap gap-md">
            <div class="p-md bg-primary text-onprimary rounded-md shadow-sm min-w-[120px] text-center">primary</div>
            <div class="p-md bg-secondary text-onsecondary rounded-md shadow-sm min-w-[120px] text-center">secondary</div>
            <div class="p-md bg-tertiary text-ontertiary rounded-md shadow-sm min-w-[120px] text-center">tertiary</div>
            <div class="p-md bg-error text-onerror rounded-md shadow-sm min-w-[120px] text-center">error</div>
            <div class="p-md bg-warning text-onwarning rounded-md shadow-sm min-w-[120px] text-center">warning</div>
            <div class="p-md bg-success text-onsuccess rounded-md shadow-sm min-w-[120px] text-center">success</div>
            <div class="p-md bg-info text-oninfo rounded-md shadow-sm min-w-[120px] text-center">info</div>
          </div>
        </section>

        <section class="space-y-md">
          <h2 class="title1-bold">Surface & Background Colors</h2>
          <div class="flex flex-wrap gap-md">
            <div class="p-md bg-surface text-onsurface border border-outline rounded-md shadow-sm min-w-[140px] text-center">surface</div>
            <div class="p-md bg-surfacecontainerlowest text-onsurface rounded-md shadow-sm min-w-[140px] text-center">surfacecontainerlowest</div>
            <div class="p-md bg-surfacecontainerlow text-onsurface rounded-md shadow-sm min-w-[140px] text-center">surfacecontainerlow</div>
            <div class="p-md bg-surfacecontainer text-onsurface rounded-md shadow-sm min-w-[140px] text-center">surfacecontainer</div>
            <div class="p-md bg-surfacecontainerhigh text-onsurface rounded-md shadow-sm min-w-[140px] text-center">surfacecontainerhigh</div>
            <div class="p-md bg-surfacecontainerhighest text-onsurface rounded-md shadow-sm min-w-[140px] text-center">surfacecontainerhighest</div>
          </div>
        </section>

        <section class="space-y-md">
           <h2 class="title1-bold">Elevations & Shadows</h2>
           <p class="body opacity-80 mb-md">In dark mode, shadows blend into dark backgrounds limit visibility. Use elevated surface containers alongside shadows.</p>
           <div class="flex flex-wrap gap-lg p-xl bg-surfacecontainerlowest rounded-2xl border border-outlinevariant">
             <div class="w-24 h-24 bg-surfacecontainerlow flex items-center justify-center rounded-xl shadow-sm body">shadow-sm</div>
             <div class="w-24 h-24 bg-surfacecontainer flex items-center justify-center rounded-xl shadow-md body">shadow-md</div>
             <div class="w-24 h-24 bg-surfacecontainerhigh flex items-center justify-center rounded-xl shadow-lg body">shadow-lg</div>
             <div class="w-24 h-24 bg-surfacecontainerhighest flex items-center justify-center rounded-xl shadow-xl body">shadow-xl</div>
             <div class="w-24 h-24 bg-tertiarycontainer text-ontertiarycontainer flex items-center justify-center rounded-xl shadow-2xl body">shadow-2xl</div>
           </div>
        </section>
      </div>

      <!-- Tab 1: Layout & Spacing -->
      <div v-show="activeTab === 1" class="space-y-xl animate-fade-in">
        <section class="space-y-md">
          <h2 class="title1-bold">Golden Ratio Spacing</h2>
          <p class="body opacity-80 mb-md">Testing p-3xs through p-2xl spacing scale using UnoCSS.</p>
          <div class="flex flex-col gap-sm border border-outlinevariant p-md rounded-lg bg-surfacecontainerlowest">
            <div class="bg-primarycontainer text-onprimarycontainer w-fit p-3xs rounded-sm">p-3xs</div>
            <div class="bg-primarycontainer text-onprimarycontainer w-fit p-2xs rounded-sm">p-2xs</div>
            <div class="bg-primarycontainer text-onprimarycontainer w-fit p-xs rounded-sm">p-xs</div>
            <div class="bg-primarycontainer text-onprimarycontainer w-fit p-sm rounded-sm">p-sm</div>
            <div class="bg-primarycontainer text-onprimarycontainer w-fit p-md rounded-sm">p-md</div>
            <div class="bg-primarycontainer text-onprimarycontainer w-fit p-lg rounded-sm">p-lg</div>
            <div class="bg-primarycontainer text-onprimarycontainer w-fit p-xl rounded-sm">p-xl</div>
            <div class="bg-primarycontainer text-onprimarycontainer w-fit p-2xl rounded-sm">p-2xl</div>
          </div>
        </section>

        <section class="space-y-md">
          <h2 class="title1-bold">Border Radius</h2>
           <div class="flex flex-wrap gap-lg items-center text-sm font-medium">
             <div class="w-16 h-16 bg-secondary flex items-center justify-center rounded-3xs text-onsecondary">3xs</div>
             <div class="w-16 h-16 bg-secondary flex items-center justify-center rounded-2xs text-onsecondary">2xs</div>
             <div class="w-16 h-16 bg-secondary flex items-center justify-center rounded-xs text-onsecondary">xs</div>
             <div class="w-16 h-16 bg-secondary flex items-center justify-center rounded-sm text-onsecondary">sm</div>
             <div class="w-16 h-16 bg-secondary flex items-center justify-center rounded-md text-onsecondary">md</div>
             <div class="w-16 h-16 bg-secondary flex items-center justify-center rounded-lg text-onsecondary">lg</div>
             <div class="w-16 h-16 bg-secondary flex items-center justify-center rounded-xl text-onsecondary">xl</div>
             <div class="w-16 h-16 bg-secondary flex items-center justify-center rounded-2xl text-onsecondary">2xl</div>
             <div class="w-16 h-16 bg-secondary flex items-center justify-center rounded-3xl text-onsecondary">3xl</div>
             <div class="w-16 h-16 bg-secondary flex items-center justify-center rounded-full text-onsecondary">full</div>
           </div>
        </section>
      </div>

      <!-- Tab 2: Typography -->
      <div v-show="activeTab === 2" class="space-y-xl animate-fade-in">
        <section class="space-y-lg">
          <h2 class="title1-bold border-b border-outline pb-xs">Typography Shortcuts mapped directly in UnoCSS Preset</h2>

          <div class="space-y-md">
            <div>
               <p class="display1">Display 1</p>
               <p class="caption opacity-50 mb-sm">.display1</p>
            </div>
            <div>
               <p class="display2">Display 2</p>
               <p class="caption opacity-50 mb-sm">.display2</p>
            </div>
            <div>
               <p class="title1">Title 1</p>
               <p class="caption opacity-50 mb-sm">.title1</p>
            </div>
            <div>
               <p class="title2">Title 2</p>
               <p class="caption opacity-50 mb-sm">.title2</p>
            </div>
            <div>
               <p class="title3">Title 3</p>
               <p class="caption opacity-50 mb-sm">.title3</p>
            </div>
            <div>
               <p class="heading">Heading</p>
               <p class="caption opacity-50 mb-sm">.heading</p>
            </div>
            <div>
               <p class="subheading">Subheading</p>
               <p class="caption opacity-50 mb-sm">.subheading</p>
            </div>
            <div>
               <p class="body">Body (1rem based on golden ratio)</p>
               <p class="caption opacity-50 mb-sm">.body</p>
            </div>
            <div>
               <p class="callout">Callout</p>
               <p class="caption opacity-50 mb-sm">.callout</p>
            </div>
            <div>
               <p class="label">Label</p>
               <p class="caption opacity-50 mb-sm">.label</p>
            </div>
            <div>
               <p class="caption">Caption</p>
               <p class="caption opacity-50 mb-sm">.caption</p>
            </div>
          </div>
        </section>
      </div>

      <!-- Tab 3: Components -->
      <div v-show="activeTab === 3" class="space-y-xl animate-fade-in">
        <section class="space-y-md">
          <h2 class="title1-bold">Buttons</h2>
          <div class="flex gap-md flex-wrap items-center">
            <button class="bg-primary text-onprimary px-lg py-sm rounded-full font-semibold hover:opacity-90 transition disabled:opacity-50 shadow-sm cursor-pointer">Primary</button>
            <button class="bg-secondary text-onsecondary px-lg py-sm rounded-full font-semibold hover:opacity-90 transition disabled:opacity-50 shadow-sm cursor-pointer">Secondary</button>
            <button class="border border-outline text-primary px-lg py-sm rounded-full font-semibold hover:bg-primarycontainer transition cursor-pointer">Outline</button>
            <button class="bg-error text-onerror px-lg py-sm rounded-full font-semibold hover:opacity-90 transition shadow-sm cursor-pointer">Danger</button>
            <button class="text-primary px-lg py-sm rounded-full font-semibold hover:bg-primarycontainer/50 transition cursor-pointer">Text</button>
          </div>
        </section>

        <section class="space-y-md">
          <h2 class="title1-bold">Cards</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
            <!-- Outlined Card -->
            <div class="border border-outlinevariant rounded-2xl p-lg bg-surface">
              <h3 class="title2-bold mb-sm text-onsurface">Outlined</h3>
              <p class="text-onsurfacevariant mb-lg body">Built entirely with UnoCSS utility classes bridging the LiftKit theme.</p>
              <button class="bg-secondary text-onsecondary rounded-full px-md py-xs font-medium body w-full cursor-pointer">Action</button>
            </div>

            <!-- Elevated Card -->
            <div class="rounded-2xl p-lg bg-surfacecontainer shadow-lg">
              <h3 class="title2-bold mb-sm text-onsurface">Elevated</h3>
              <p class="text-onsurfacevariant mb-lg body">Uses surfacecontainer background and md shadow for depth.</p>
              <button class="bg-primary text-onprimary rounded-full px-md py-xs font-medium body w-full cursor-pointer">Action</button>
            </div>

            <!-- Tinted Card -->
            <div class="rounded-2xl p-lg bg-primarycontainer text-onprimarycontainer">
              <h3 class="title2-bold mb-sm">Tinted Container</h3>
              <p class="mb-lg opacity-80 body">Uses container colors for highlighting specific sections of UI.</p>
              <button class="bg-primary text-onprimary rounded-full px-md py-xs font-medium body w-full shadow-sm cursor-pointer">Action</button>
            </div>
          </div>
        </section>

        <section class="space-y-md">
          <h2 class="title1-bold">Form Elements</h2>

          <div class="w-full max-w-[36rem] space-y-lg border border-outline rounded-xl p-lg bg-surfacecontainerlowest">
            <div class="flex flex-col gap-xs">
              <label class="label text-onsurface">Email Address</label>
              <input v-model="textInputValue" type="email" placeholder="name@example.com" class="w-full bg-surface border border-outline px-md py-sm rounded-md focus:border-primary focus:ring-1 focus:ring-primary outline-none transition text-onsurface" />
              <p class="caption text-onsurfacevariant">We'll never share your email with anyone else.</p>
            </div>

            <div class="flex flex-col gap-xs">
              <label class="label text-error">Password (Error state)</label>
              <input type="password" value="fakepassword" class="w-full bg-errorcontainer/20 border border-error px-md py-sm rounded-md focus:outline-none text-onsurface" />
              <span class="caption text-error">Password is too short</span>
            </div>

            <div class="flex items-center gap-sm">
              <div
                class="w-6 h-6 rounded flex items-center justify-center cursor-pointer transition border"
                :class="switchValue ? 'bg-primary border-primary text-onprimary' : 'border-outline bg-surface'"
                @click="switchValue = !switchValue"
              >
                <svg v-if="switchValue" xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </div>
              <label class="body cursor-pointer" @click="switchValue = !switchValue">
                Agree to Terms and Conditions
              </label>
            </div>

            <button class="bg-primary text-onprimary px-lg py-sm rounded-full font-semibold w-full mt-sm cursor-pointer hover:opacity-90">Submit Form</button>
          </div>
        </section>

        <section class="space-y-md">
          <h2 class="title1-bold">Badges & Chips</h2>
          <div class="flex gap-sm flex-wrap">
            <span class="bg-primary text-onprimary px-sm py-2xs rounded-full text-xs font-semibold tracking-wider uppercase">New Feature</span>
            <span class="bg-tertiarycontainer text-ontertiarycontainer px-sm py-2xs rounded-lg text-xs font-medium">Beta</span>
            <span class="border border-outline text-onsurfacevariant px-sm py-2xs rounded-full text-xs font-medium">v1.2.0</span>
            <span class="bg-error text-onerror px-sm py-2xs rounded-full text-xs font-semibold">99+</span>
          </div>
        </section>
      </div>

    </main>
  </div>
</template>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
