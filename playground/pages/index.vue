<script setup lang="ts">
// Components are auto-imported via the Nuxt module

const switchValue = ref(false)
const textInputValue = ref('')
const selectValue = ref('')
const snackbarVisible = ref(false)
const snackbarAutoVisible = ref(false)

const selectOptions = [
  { label: 'Option A', value: 'a' },
  { label: 'Option B', value: 'b' },
  { label: 'Option C', value: 'c' },
]

const tabLabels = [
  'Theme & Tokens',
  'Layout',
  'Display',
  'Interactive',
  'Complex',
  'Material',
]

// Layout demo state
const rowAlign = ref<'start' | 'center' | 'end' | 'stretch'>('center')
const rowJustify = ref<'start' | 'center' | 'end' | 'space-between' | 'space-around'>('start')
const gridCols = ref(3)

// Display demo state
const headingTag = ref<'h1' | 'h2' | 'h3' | 'h4'>('h2')
const headingFont = ref('display2-bold')
const textFont = ref('body')
const textColor = ref('onsurface')
const imageAspect = ref<'auto' | '1/1' | '16/9' | '4/3'>('auto')

// Button demo state
const btnVariant = ref<'fill' | 'outline' | 'text'>('fill')
const btnColor = ref<'primary' | 'secondary' | 'tertiary' | 'error'>('primary')
const btnSize = ref<'sm' | 'md' | 'lg'>('md')

// Card demo state
const cardVariant = ref<'fill' | 'outline' | 'transparent'>('fill')
const cardMaterial = ref<'flat' | 'glass'>('flat')
</script>

<template>
  <LkTheme source-color="#6750A4">
    <div style="padding: 2rem; min-height: 100vh">
      <LkColumn gap="lg">
        <div>
          <LkHeading tag="h1" font-class="display1">LiftKit Vue Showcase</LkHeading>
          <LkText font-class="body" color="onsurfacevariant">
            35 components — browse each tab to explore props and interactions.
          </LkText>
        </div>

        <LkTabs :tab-links="tabLabels" :default-tab="0">
          <!-- ==================== Tab 1: Theme & Tokens ==================== -->
          <LkTabContent :index="0">
            <LkColumn gap="xl" style="padding-top: 1.5rem">
              <!-- Theme Controller -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">LkThemeController</LkHeading>
                  <LkText font-class="body" color="onsurfacevariant">
                    Click the floating button (bottom-right) to open the theme editor.
                  </LkText>
                  <LkThemeController />
                </LkColumn>
              </LkSection>

              <!-- Color Palette -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">Color Palette</LkHeading>
                  <LkRow gap="sm" wrap-children>
                    <div
                      v-for="color in ['primary','secondary','tertiary','error','warning','success','info']"
                      :key="color"
                      :style="{
                        background: `var(--light__${color}_lkv)`,
                        color: `var(--light__on${color}_lkv)`,
                        padding: '1rem 1.5rem',
                        borderRadius: '0.5rem',
                        minWidth: '120px',
                        textAlign: 'center',
                      }"
                    >
                      {{ color }}
                    </div>
                  </LkRow>
                </LkColumn>
              </LkSection>

              <!-- Surface Tokens -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">Surface Tokens</LkHeading>
                  <LkRow gap="sm" wrap-children>
                    <div
                      v-for="surface in [
                        'surface','surfacecontainerlowest','surfacecontainerlow',
                        'surfacecontainer','surfacecontainerhigh','surfacecontainerhighest',
                      ]"
                      :key="surface"
                      :style="{
                        background: `var(--light__${surface}_lkv)`,
                        color: `var(--light__onsurface_lkv)`,
                        padding: '1rem 1.5rem',
                        borderRadius: '0.5rem',
                        border: '1px solid var(--light__outlinevariant_lkv)',
                        minWidth: '140px',
                        textAlign: 'center',
                      }"
                    >
                      {{ surface }}
                    </div>
                  </LkRow>
                </LkColumn>
              </LkSection>

              <!-- Typography Scale -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">Typography Scale</LkHeading>
                  <LkColumn gap="xs">
                    <LkText v-for="fc in ['display1','display2','title1','title2','title3','heading','subheading','body','callout','label','caption']" :key="fc" :font-class="fc">
                      {{ fc }}
                    </LkText>
                  </LkColumn>
                </LkColumn>
              </LkSection>

              <!-- Spacing Tokens -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">Spacing Tokens (LkSizeUnit)</LkHeading>
                  <LkColumn gap="xs">
                    <LkRow v-for="size in ['3xs','2xs','xs','sm','md','lg','xl','2xl','3xl','4xl']" :key="size" align-items="center" gap="md">
                      <LkText font-class="label" style="width: 3rem; text-align: right">{{ size }}</LkText>
                      <div
                        :style="{
                          height: '1rem',
                          width: `var(--lk-size-${size})`,
                          background: 'var(--light__primary_lkv)',
                          borderRadius: '2px',
                        }"
                      />
                    </LkRow>
                  </LkColumn>
                </LkColumn>
              </LkSection>
            </LkColumn>
          </LkTabContent>

          <!-- ==================== Tab 2: Layout ==================== -->
          <LkTabContent :index="1">
            <LkColumn gap="xl" style="padding-top: 1.5rem">
              <!-- LkContainer -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">LkContainer</LkHeading>
                  <LkText font-class="caption" color="onsurfacevariant">maxWidth: xs | sm | md | lg | xl</LkText>
                  <LkColumn gap="sm">
                    <LkContainer v-for="mw in ['xs','sm','md','lg','xl']" :key="mw" :max-width="mw">
                      <LkCard variant="outline">
                        <LkText font-class="label">maxWidth="{{ mw }}"</LkText>
                      </LkCard>
                    </LkContainer>
                  </LkColumn>
                </LkColumn>
              </LkSection>

              <!-- LkRow -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">LkRow</LkHeading>
                  <LkRow gap="sm" wrap-children>
                    <LkText font-class="label">alignItems:</LkText>
                    <LkButton
                      v-for="a in ['start','center','end','stretch']" :key="a"
                      :label="a" size="sm"
                      :variant="rowAlign === a ? 'fill' : 'outline'"
                      @click="rowAlign = a"
                    />
                    <LkText font-class="label" style="margin-left: 1rem">justifyContent:</LkText>
                    <LkButton
                      v-for="j in ['start','center','end','space-between','space-around']" :key="j"
                      :label="j" size="sm"
                      :variant="rowJustify === j ? 'fill' : 'outline'"
                      @click="rowJustify = j"
                    />
                  </LkRow>
                  <LkCard variant="outline" style="min-height: 120px">
                    <LkRow :align-items="rowAlign" :justify-content="rowJustify" gap="sm" style="min-height: 100px">
                      <LkCard bg-color="primarycontainer" style="padding: 0.5rem 1rem"><LkText font-class="label">A</LkText></LkCard>
                      <LkCard bg-color="secondarycontainer" style="padding: 1rem 1.5rem"><LkText font-class="label">B (taller)</LkText></LkCard>
                      <LkCard bg-color="tertiarycontainer" style="padding: 0.5rem 1rem"><LkText font-class="label">C</LkText></LkCard>
                    </LkRow>
                  </LkCard>
                </LkColumn>
              </LkSection>

              <!-- LkColumn -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">LkColumn</LkHeading>
                  <LkCard variant="outline">
                    <LkColumn gap="sm" align-items="start">
                      <LkCard bg-color="primarycontainer" style="padding: 0.5rem 1rem"><LkText font-class="label">Item 1</LkText></LkCard>
                      <LkCard bg-color="secondarycontainer" style="padding: 0.5rem 2rem"><LkText font-class="label">Item 2 (wider)</LkText></LkCard>
                      <LkCard bg-color="tertiarycontainer" style="padding: 0.5rem 1rem"><LkText font-class="label">Item 3</LkText></LkCard>
                    </LkColumn>
                  </LkCard>
                </LkColumn>
              </LkSection>

              <!-- LkGrid -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">LkGrid</LkHeading>
                  <LkRow gap="sm" align-items="center">
                    <LkText font-class="label">columns:</LkText>
                    <LkButton
                      v-for="c in [1,2,3,4]" :key="c"
                      :label="String(c)" size="sm"
                      :variant="gridCols === c ? 'fill' : 'outline'"
                      @click="gridCols = c"
                    />
                  </LkRow>
                  <LkGrid :columns="gridCols" gap="sm">
                    <LkCard v-for="i in 6" :key="i" bg-color="surfacecontainer">
                      <LkText font-class="label" color="onsurface">Cell {{ i }}</LkText>
                    </LkCard>
                  </LkGrid>
                </LkColumn>
              </LkSection>

              <!-- LkSection -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">LkSection</LkHeading>
                  <LkText font-class="caption" color="onsurfacevariant">Semantic section with padding props (px, py, padding)</LkText>
                  <LkCard variant="outline">
                    <LkSection padding="lg">
                      <LkCard bg-color="primarycontainer">
                        <LkText font-class="label">padding="lg"</LkText>
                      </LkCard>
                    </LkSection>
                  </LkCard>
                </LkColumn>
              </LkSection>
            </LkColumn>
          </LkTabContent>

          <!-- ==================== Tab 3: Display ==================== -->
          <LkTabContent :index="2">
            <LkColumn gap="xl" style="padding-top: 1.5rem">
              <!-- LkHeading -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">LkHeading</LkHeading>
                  <LkRow gap="sm" wrap-children align-items="center">
                    <LkText font-class="label">tag:</LkText>
                    <LkButton
                      v-for="t in ['h1','h2','h3','h4']" :key="t"
                      :label="t" size="sm"
                      :variant="headingTag === t ? 'fill' : 'outline'"
                      @click="headingTag = t"
                    />
                    <LkText font-class="label" style="margin-left: 1rem">fontClass:</LkText>
                    <LkButton
                      v-for="f in ['display1','display2-bold','heading','subheading']" :key="f"
                      :label="f" size="sm"
                      :variant="headingFont === f ? 'fill' : 'outline'"
                      @click="headingFont = f"
                    />
                  </LkRow>
                  <LkCard variant="outline">
                    <LkHeading :tag="headingTag" :font-class="headingFont">Sample Heading</LkHeading>
                  </LkCard>
                </LkColumn>
              </LkSection>

              <!-- LkText -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">LkText</LkHeading>
                  <LkRow gap="sm" wrap-children align-items="center">
                    <LkText font-class="label">fontClass:</LkText>
                    <LkButton
                      v-for="f in ['body','body-bold','label','caption','callout']" :key="f"
                      :label="f" size="sm"
                      :variant="textFont === f ? 'fill' : 'outline'"
                      @click="textFont = f"
                    />
                    <LkText font-class="label" style="margin-left: 1rem">color:</LkText>
                    <LkButton
                      v-for="c in ['onsurface','onsurfacevariant','primary','error']" :key="c"
                      :label="c" size="sm"
                      :variant="textColor === c ? 'fill' : 'outline'"
                      @click="textColor = c"
                    />
                  </LkRow>
                  <LkCard variant="outline">
                    <LkText :font-class="textFont" :color="textColor">The quick brown fox jumps over the lazy dog.</LkText>
                  </LkCard>
                </LkColumn>
              </LkSection>

              <!-- LkIcon -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">LkIcon</LkHeading>
                  <LkText font-class="caption" color="onsurfacevariant">SVG icon wrapper — provide SVG via default slot. Size controlled by fontClass.</LkText>
                  <LkRow gap="md" align-items="end" wrap-children>
                    <LkColumn v-for="fc in ['caption','body','heading','display2']" :key="fc" align-items="center" gap="xs">
                      <LkIcon :font-class="fc" color="primary">
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                      </LkIcon>
                      <LkText font-class="caption">{{ fc }}</LkText>
                    </LkColumn>
                  </LkRow>
                </LkColumn>
              </LkSection>

              <!-- LkImage -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">LkImage</LkHeading>
                  <LkRow gap="sm" align-items="center" wrap-children>
                    <LkText font-class="label">aspect:</LkText>
                    <LkButton
                      v-for="a in ['auto','1/1','16/9','4/3']" :key="a"
                      :label="a" size="sm"
                      :variant="imageAspect === a ? 'fill' : 'outline'"
                      @click="imageAspect = a"
                    />
                  </LkRow>
                  <div style="max-width: 300px">
                    <LkImage
                      src="https://picsum.photos/seed/liftkit/600/400"
                      alt="Sample image"
                      :aspect="imageAspect"
                      object-fit="cover"
                      border-radius="md"
                    />
                  </div>
                </LkColumn>
              </LkSection>

              <!-- LkBadge -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">LkBadge</LkHeading>
                  <LkRow gap="md" align-items="center" wrap-children>
                    <LkColumn v-for="c in ['primary','secondary','tertiary','error','surface']" :key="c" align-items="center" gap="xs">
                      <LkBadge :color="c" />
                      <LkText font-class="caption">{{ c }}</LkText>
                    </LkColumn>
                    <LkColumn align-items="center" gap="xs">
                      <LkBadge color="primary" scale="lg" />
                      <LkText font-class="caption">lg</LkText>
                    </LkColumn>
                  </LkRow>
                </LkColumn>
              </LkSection>

              <!-- LkSticker -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">LkSticker</LkHeading>
                  <LkRow gap="sm" wrap-children>
                    <LkSticker bg-color="primarycontainer">Primary</LkSticker>
                    <LkSticker bg-color="secondarycontainer">Secondary</LkSticker>
                    <LkSticker bg-color="tertiarycontainer">Tertiary</LkSticker>
                    <LkSticker bg-color="errorcontainer">Error</LkSticker>
                    <LkSticker bg-color="successcontainer">Success</LkSticker>
                  </LkRow>
                </LkColumn>
              </LkSection>
            </LkColumn>
          </LkTabContent>

          <!-- ==================== Tab 4: Interactive ==================== -->
          <LkTabContent :index="3">
            <LkColumn gap="xl" style="padding-top: 1.5rem">
              <!-- LkButton -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">LkButton</LkHeading>
                  <LkRow gap="sm" wrap-children align-items="center">
                    <LkText font-class="label">variant:</LkText>
                    <LkButton
                      v-for="v in ['fill','outline','text']" :key="v"
                      :label="v" size="sm"
                      :variant="btnVariant === v ? 'fill' : 'outline'"
                      @click="btnVariant = v"
                    />
                    <LkText font-class="label" style="margin-left: 1rem">color:</LkText>
                    <LkButton
                      v-for="c in ['primary','secondary','tertiary','error']" :key="c"
                      :label="c" size="sm"
                      :variant="btnColor === c ? 'fill' : 'outline'"
                      @click="btnColor = c"
                    />
                    <LkText font-class="label" style="margin-left: 1rem">size:</LkText>
                    <LkButton
                      v-for="s in ['sm','md','lg']" :key="s"
                      :label="s" size="sm"
                      :variant="btnSize === s ? 'fill' : 'outline'"
                      @click="btnSize = s"
                    />
                  </LkRow>
                  <LkRow gap="md" align-items="center" wrap-children>
                    <LkButton :variant="btnVariant" :color="btnColor" :size="btnSize" label="Button" />
                    <LkButton :variant="btnVariant" :color="btnColor" :size="btnSize" label="Disabled" disabled />
                  </LkRow>
                  <LkText font-class="caption" color="onsurfacevariant">
                    Note: startIcon / endIcon props require an icon library (e.g. lucide-vue-next).
                  </LkText>
                </LkColumn>
              </LkSection>

              <!-- LkIconButton -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">LkIconButton</LkHeading>
                  <LkText font-class="caption" color="onsurfacevariant">
                    Note: Icons require lucide-vue-next or slot content. Internal LkIcon renders an empty SVG shell by default.
                  </LkText>
                  <LkRow gap="md" align-items="center" wrap-children>
                    <LkColumn v-for="s in ['xs','sm','md','lg','xl']" :key="s" align-items="center" gap="xs">
                      <LkIconButton :size="s" color="primary" />
                      <LkText font-class="caption">{{ s }}</LkText>
                    </LkColumn>
                  </LkRow>
                  <LkRow gap="md" align-items="center" wrap-children>
                    <LkColumn align-items="center" gap="xs">
                      <LkIconButton variant="fill" color="primary" />
                      <LkText font-class="caption">fill</LkText>
                    </LkColumn>
                    <LkColumn align-items="center" gap="xs">
                      <LkIconButton variant="outline" color="secondary" />
                      <LkText font-class="caption">outline</LkText>
                    </LkColumn>
                    <LkColumn align-items="center" gap="xs">
                      <LkIconButton variant="text" color="tertiary" />
                      <LkText font-class="caption">text</LkText>
                    </LkColumn>
                  </LkRow>
                </LkColumn>
              </LkSection>

              <!-- LkSwitch -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">LkSwitch</LkHeading>
                  <LkRow gap="md" align-items="center">
                    <LkSwitch v-model="switchValue" />
                    <LkText font-class="body">v-model: <strong>{{ switchValue }}</strong></LkText>
                  </LkRow>
                  <LkRow gap="md" align-items="center">
                    <LkSwitch v-model="switchValue" on-color="tertiary" off-color="errorcontainer" />
                    <LkText font-class="caption" color="onsurfacevariant">Custom colors: onColor="tertiary" offColor="errorcontainer"</LkText>
                  </LkRow>
                </LkColumn>
              </LkSection>

              <!-- LkTextInput -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">LkTextInput</LkHeading>
                  <LkGrid :columns="2" gap="md">
                    <LkColumn gap="sm">
                      <LkText font-class="label">labelPosition="default"</LkText>
                      <LkTextInput
                        v-model="textInputValue"
                        name="Username"
                        placeholder="Enter your name"
                        help-text="Help text goes here"
                      />
                    </LkColumn>
                    <LkColumn gap="sm">
                      <LkText font-class="label">labelPosition="on-input"</LkText>
                      <LkTextInput
                        v-model="textInputValue"
                        name="Username"
                        placeholder="Enter your name"
                        label-position="on-input"
                      />
                    </LkColumn>
                  </LkGrid>
                  <LkText font-class="caption" color="onsurfacevariant">v-model: "{{ textInputValue }}"</LkText>
                </LkColumn>
              </LkSection>

              <!-- LkSelect -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">LkSelect</LkHeading>
                  <LkText font-class="caption" color="onsurfacevariant">
                    Renderless slot-based component. Provides isOpen, toggle, selectedValue, setSelectedValue via scoped slot.
                  </LkText>
                  <div style="max-width: 300px">
                    <LkSelect
                      v-model="selectValue"
                      :options="selectOptions"
                      name="fruit"
                    >
                      <template #default="{ isOpen, toggle, selectedValue: sv, setSelectedValue }">
                        <LkColumn gap="xs">
                          <LkText font-class="label">Choose option</LkText>
                          <button
                            type="button"
                            style="
                              display: flex; align-items: center; justify-content: space-between;
                              width: 100%; padding: 0.625em 0.75em;
                              border: 1px solid var(--light__outline_lkv, #79747e);
                              border-radius: 0.382em; background: var(--light__surface_lkv, #fff);
                              font: inherit; cursor: pointer; color: inherit;
                            "
                            @click="toggle"
                          >
                            <span>{{ selectOptions.find(o => o.value === sv)?.label || 'Select one...' }}</span>
                            <span style="font-size: 0.75em">{{ isOpen ? '▲' : '▼' }}</span>
                          </button>
                          <div
                            v-if="isOpen"
                            style="
                              border: 1px solid var(--light__outlinevariant_lkv, #cac4d0);
                              border-radius: 0.382em; background: var(--light__surface_lkv, #fff);
                              box-shadow: 0 4px 12px rgba(0,0,0,0.12); overflow: hidden;
                            "
                          >
                            <LkMenuItem
                              v-for="opt in selectOptions"
                              :key="opt.value"
                              @click="setSelectedValue(opt.value)"
                            >
                              {{ opt.label }}
                            </LkMenuItem>
                          </div>
                        </LkColumn>
                      </template>
                    </LkSelect>
                  </div>
                  <LkText font-class="caption" color="onsurfacevariant">v-model: "{{ selectValue }}"</LkText>
                </LkColumn>
              </LkSection>
            </LkColumn>
          </LkTabContent>

          <!-- ==================== Tab 5: Complex ==================== -->
          <LkTabContent :index="4">
            <LkColumn gap="xl" style="padding-top: 1.5rem">
              <!-- LkCard -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">LkCard</LkHeading>
                  <LkRow gap="sm" wrap-children align-items="center">
                    <LkText font-class="label">variant:</LkText>
                    <LkButton
                      v-for="v in ['fill','outline','transparent']" :key="v"
                      :label="v" size="sm"
                      :variant="cardVariant === v ? 'fill' : 'outline'"
                      @click="cardVariant = v"
                    />
                    <LkText font-class="label" style="margin-left: 1rem">material:</LkText>
                    <LkButton
                      v-for="m in ['flat','glass']" :key="m"
                      :label="m" size="sm"
                      :variant="cardMaterial === m ? 'fill' : 'outline'"
                      @click="cardMaterial = m"
                    />
                  </LkRow>
                  <LkGrid :columns="3" gap="md">
                    <LkCard :variant="cardVariant" :material="cardMaterial">
                      <LkColumn gap="sm">
                        <LkHeading tag="h3" font-class="subheading">Card Title</LkHeading>
                        <LkText font-class="body" color="onsurfacevariant">Card content with default settings.</LkText>
                      </LkColumn>
                    </LkCard>
                    <LkCard :variant="cardVariant" :material="cardMaterial" bg-color="primarycontainer">
                      <LkColumn gap="sm">
                        <LkHeading tag="h3" font-class="subheading">Primary</LkHeading>
                        <LkText font-class="body">bgColor="primarycontainer"</LkText>
                      </LkColumn>
                    </LkCard>
                    <LkCard :variant="cardVariant" :material="cardMaterial" is-clickable>
                      <LkColumn gap="sm">
                        <LkHeading tag="h3" font-class="subheading">Clickable</LkHeading>
                        <LkText font-class="body" color="onsurfacevariant">isClickable — hover to see state layer.</LkText>
                      </LkColumn>
                    </LkCard>
                  </LkGrid>
                </LkColumn>
              </LkSection>

              <!-- LkDropdown -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">LkDropdown</LkHeading>
                  <LkDropdown v-slot="{ isOpen }">
                    <LkDropdownTrigger>
                      <LkButton :label="isOpen ? 'Close menu' : 'Open menu'" variant="outline" />
                    </LkDropdownTrigger>
                    <LkDropdownMenu>
                      <LkMenuItem>Menu Item 1</LkMenuItem>
                      <LkMenuItem>Menu Item 2</LkMenuItem>
                      <LkMenuItem>Menu Item 3</LkMenuItem>
                    </LkDropdownMenu>
                  </LkDropdown>
                </LkColumn>
              </LkSection>

              <!-- LkSnackbar -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">LkSnackbar</LkHeading>
                  <LkRow gap="md" wrap-children>
                    <LkButton label="Show Snackbar" @click="snackbarVisible = true" />
                    <LkButton label="Auto-dismiss (3s)" variant="outline" @click="snackbarAutoVisible = true" />
                  </LkRow>
                  <LkSnackbar v-model="snackbarVisible" message="This is a notification!">
                    <template #iconAction="{ onColor }">
                      <LkIconButton icon="x" variant="text" :color="onColor" size="sm" @click="snackbarVisible = false" />
                    </template>
                  </LkSnackbar>
                  <LkSnackbar v-model="snackbarAutoVisible" message="Auto-dismissing in 3 seconds..." :auto-dismiss="3000" />
                </LkColumn>
              </LkSection>

              <!-- LkNavbar -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">LkNavbar</LkHeading>
                  <LkText font-class="caption" color="onsurfacevariant">Embedded in a bordered container for demonstration.</LkText>
                  <LkCard variant="outline" style="overflow: hidden">
                    <LkNavbar material="flat">
                      <template #brand>
                        <LkText font-class="body-bold">LiftKit</LkText>
                      </template>
                      <template #mobileBrand>
                        <LkText font-class="body-bold">LiftKit</LkText>
                      </template>
                      <template #navButtons>
                        <LkButton label="Home" variant="text" size="sm" />
                        <LkButton label="About" variant="text" size="sm" />
                        <LkButton label="Docs" variant="text" size="sm" />
                      </template>
                      <template #ctaButtons>
                        <LkButton label="Get Started" size="sm" />
                      </template>
                    </LkNavbar>
                  </LkCard>
                </LkColumn>
              </LkSection>
            </LkColumn>
          </LkTabContent>

          <!-- ==================== Tab 6: Material ==================== -->
          <LkTabContent :index="5">
            <LkColumn gap="xl" style="padding-top: 1.5rem">
              <!-- LkMaterialLayer -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">LkMaterialLayer</LkHeading>
                  <LkText font-class="caption" color="onsurfacevariant">Visual material layers — glass blur vs flat color fill.</LkText>
                  <LkGrid :columns="2" gap="md">
                    <!-- Glass -->
                    <div
                      style="
                        position: relative;
                        border-radius: 0.75rem;
                        overflow: hidden;
                        min-height: 180px;
                        background: linear-gradient(135deg, #6750A4, #D0BCFF, #EADDFF);
                      "
                    >
                      <LkMaterialLayer
                        type="glass"
                        :material-props="{ thickness: 'normal', tint: 'primary', tintOpacity: 0.1 }"
                      />
                      <div style="position: relative; z-index: 1; padding: 1.5rem">
                        <LkText font-class="body-bold">Glass Material</LkText>
                        <LkText font-class="caption">thickness: normal, tint: primary</LkText>
                      </div>
                    </div>
                    <!-- Flat -->
                    <div
                      style="
                        position: relative;
                        border-radius: 0.75rem;
                        overflow: hidden;
                        min-height: 180px;
                      "
                    >
                      <LkMaterialLayer
                        type="flat"
                        :material-props="{ bgColor: 'surfacecontainer' }"
                      />
                      <div style="position: relative; z-index: 1; padding: 1.5rem">
                        <LkText font-class="body-bold">Flat Material</LkText>
                        <LkText font-class="caption">bgColor: surfacecontainer</LkText>
                      </div>
                    </div>
                  </LkGrid>
                  <!-- Glass variations -->
                  <LkHeading tag="h3" font-class="subheading">Glass Thickness Comparison</LkHeading>
                  <LkGrid :columns="3" gap="md">
                    <div
                      v-for="thick in ['thin','normal','thick']"
                      :key="thick"
                      style="
                        position: relative;
                        border-radius: 0.75rem;
                        overflow: hidden;
                        min-height: 140px;
                        background: linear-gradient(135deg, #6750A4, #625B71, #D0BCFF);
                      "
                    >
                      <LkMaterialLayer
                        type="glass"
                        :material-props="{ thickness: thick, tint: 'surface', tintOpacity: 0.15 }"
                      />
                      <div style="position: relative; z-index: 1; padding: 1.25rem">
                        <LkText font-class="body-bold">{{ thick }}</LkText>
                        <LkText font-class="caption">thickness: {{ thick }}</LkText>
                      </div>
                    </div>
                  </LkGrid>
                </LkColumn>
              </LkSection>

              <!-- LkStateLayer -->
              <LkSection>
                <LkColumn gap="md">
                  <LkHeading tag="h2" font-class="heading">LkStateLayer</LkHeading>
                  <LkText font-class="caption" color="onsurfacevariant">Interaction state overlay — hover/active/focus visual feedback.</LkText>
                  <LkGrid :columns="3" gap="md">
                    <div
                      v-for="state in ['hover','active','focus']"
                      :key="state"
                      style="
                        position: relative;
                        border-radius: 0.75rem;
                        overflow: hidden;
                        min-height: 100px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: var(--light__surfacecontainer_lkv);
                      "
                    >
                      <LkStateLayer bg-color="primary" :forced-state="state" />
                      <LkText font-class="body-bold" style="position: relative; z-index: 1">{{ state }}</LkText>
                    </div>
                  </LkGrid>
                </LkColumn>
              </LkSection>
            </LkColumn>
          </LkTabContent>
        </LkTabs>
      </LkColumn>
    </div>
  </LkTheme>
</template>
