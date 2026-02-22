import { ref, provide, inject, watch, onMounted, type InjectionKey, type Ref } from 'vue'
import { hexFromArgb, argbFromHex, TonalPalette, Hct, customColor } from '@material/material-color-utilities'
import materialDynamicColors from 'material-dynamic-colors'

// Define types for theme colors
export interface ThemeColors {
  primary: string
  onPrimary: string
  primaryContainer: string
  onPrimaryContainer: string
  secondary: string
  onSecondary: string
  secondaryContainer: string
  onSecondaryContainer: string
  tertiary: string
  onTertiary: string
  tertiaryContainer: string
  onTertiaryContainer: string
  error: string
  onError: string
  errorContainer: string
  onErrorContainer: string
  background: string
  onBackground: string
  surface: string
  onSurface: string
  surfaceVariant: string
  onSurfaceVariant: string
  outline: string
  outlineVariant: string
  shadow: string
  scrim: string
  inverseSurface: string
  inverseOnSurface: string
  inversePrimary: string
  surfaceDim: string
  surfaceBright: string
  surfaceContainerLowest: string
  surfaceContainerLow: string
  surfaceContainer: string
  surfaceContainerHigh: string
  surfaceContainerHighest: string
  warning: string
  onWarning: string
  warningContainer: string
  onWarningContainer: string
  success: string
  onSuccess: string
  successContainer: string
  onSuccessContainer: string
  info: string
  onInfo: string
  infoContainer: string
  onInfoContainer: string
  [key: string]: string
}

export interface ThemeState {
  light: ThemeColors
  dark: ThemeColors
}

export interface PaletteState {
  primary: string
  secondary: string
  tertiary: string
  neutral: string
  neutralvariant: string
  error: string
  warning: string
  success: string
  info: string
  [key: string]: string
}

export interface ThemeContext {
  theme: Ref<ThemeState>
  updateTheme: (palette: PaletteState) => Promise<void>
  updateThemeFromMaster: (hexCode: string) => Promise<void>
  palette: Ref<PaletteState>
  colorMode: Ref<'light' | 'dark'>
  setColorMode: (mode: 'light' | 'dark') => void
}

export const THEME_INJECTION_KEY: InjectionKey<ThemeContext> = Symbol('liftkit-theme')

const defaultLightColors: ThemeColors = {
  primary: '#004ee7',
  onPrimary: '#ffffff',
  primaryContainer: '#dce1ff',
  onPrimaryContainer: '#001550',
  secondary: '#595d72',
  onSecondary: '#ffffff',
  secondaryContainer: '#dee1f9',
  onSecondaryContainer: '#161b2c',
  tertiary: '#75546f',
  onTertiary: '#ffffff',
  tertiaryContainer: '#ffd7f5',
  onTertiaryContainer: '#2c122a',
  error: '#ba1a1a',
  onError: '#ffffff',
  errorContainer: '#ffdad6',
  onErrorContainer: '#410002',
  background: '#fefbff',
  onBackground: '#1b1b1f',
  surface: '#fbf8fd',
  onSurface: '#1b1b1f',
  surfaceVariant: '#e2e1ec',
  onSurfaceVariant: '#45464f',
  outline: '#767680',
  outlineVariant: '#c6c5d0',
  shadow: '#000000',
  scrim: '#000000',
  inverseSurface: '#303034',
  inverseOnSurface: '#f2f0f4',
  inversePrimary: '#b6c4ff',
  surfaceDim: '#dbd9de',
  surfaceBright: '#fbf8fd',
  surfaceContainerLowest: '#ffffff',
  surfaceContainerLow: '#f5f3f7',
  surfaceContainer: '#efedf1',
  surfaceContainerHigh: '#eae7ec',
  surfaceContainerHighest: '#e4e1e6',
  warning: '#e3aa00',
  onWarning: '#281b00',
  warningContainer: '#ffdfa0',
  onWarningContainer: '#261a00',
  success: '#41ca82',
  onSuccess: '#002311',
  successContainer: '#77fbae',
  onSuccessContainer: '#002110',
  info: '#9bb0ff',
  onInfo: '#001754',
  infoContainer: '#dce1ff',
  onInfoContainer: '#001550',
}

const defaultDarkColors: ThemeColors = {
  ...defaultLightColors,
  // Dark mode defaults match the light defaults in the source.
  // The updateTheme function will generate proper dark mode values from the palette.
}

const defaultPalette: PaletteState = {
  primary: '#035eff',
  secondary: '#badcff',
  tertiary: '#00ddfe',
  neutral: '#000000',
  neutralvariant: '#3f4f5b',
  error: '#dd305c',
  warning: '#feb600',
  success: '#0cfecd',
  info: '#175bfc',
}

function toSentenceCase(str: string): string {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

class TonalSwatches {
  [key: string]: string
  constructor(hue: number, chroma: number) {
    const swatch = TonalPalette.fromHueAndChroma(hue, chroma)
    for (let i = 1; i <= 99; i++) {
      this[`_${i}`] = hexFromArgb(swatch.tone(i))
    }
  }
}

/**
 * Provides LiftKit theme context to child components.
 * Call this in a root/layout component to set up the theme provider.
 */
export function provideTheme(initialPalette?: Partial<PaletteState>) {
  const theme = ref<ThemeState>({
    light: { ...defaultLightColors },
    dark: { ...defaultDarkColors },
  })

  const palette = ref<PaletteState>({
    ...defaultPalette,
    ...initialPalette,
  })

  const colorMode = ref<'light' | 'dark'>('light')

  function setColorMode(mode: 'light' | 'dark') {
    colorMode.value = mode
  }

  async function updateTheme(pal: PaletteState) {
    const newLight = { ...theme.value.light }
    const newDark = { ...theme.value.dark }

    Object.keys(pal).forEach((key) => {
      const argb = argbFromHex(pal[key])
      const hct = Hct.fromInt(argb)
      const tones = new TonalSwatches(hct.hue, hct.chroma)

      switch (key) {
        case 'neutral':
          Object.assign(newLight, {
            background: tones._99,
            onBackground: tones._10,
            surfaceDim: tones._87,
            surface: tones._98,
            surfaceBright: tones._98,
            surfaceContainerLowest: 'white',
            surfaceContainerLow: tones._96,
            surfaceContainer: tones._94,
            surfaceContainerHigh: tones._92,
            surfaceContainerHighest: tones._90,
            onSurface: tones._10,
            inverseSurface: tones._20,
            inverseOnSurface: tones._95,
          })
          Object.assign(newDark, {
            background: tones._10,
            onBackground: tones._85,
            surfaceContainerLowest: tones._4,
            surfaceDim: tones._6,
            surface: tones._6,
            surfaceContainerLow: tones._10,
            surfaceContainer: tones._12,
            surfaceContainerHigh: tones._17,
            surfaceContainerHighest: tones._22,
            surfaceBright: tones._24,
            onSurface: tones._90,
            inverseSurface: tones._98,
            inverseOnSurface: tones._10,
          })
          break
        case 'neutralvariant':
          Object.assign(newLight, {
            surfaceVariant: tones._80,
            onSurfaceVariant: tones._40,
            outline: tones._60,
            outlineVariant: tones._90,
          })
          Object.assign(newDark, {
            surfaceVariant: tones._20,
            onSurfaceVariant: tones._60,
            outline: tones._50,
            outlineVariant: tones._30,
          })
          break
        case 'primary':
          Object.assign(newLight, {
            [key]: tones._40,
            [`on${toSentenceCase(key)}`]: tones._98,
            [`${key}Container`]: tones._90,
            [`on${toSentenceCase(key)}Container`]: tones._10,
            [`${key}Fixed`]: tones._90,
            [`${key}FixedDim`]: tones._80,
            [`on${toSentenceCase(key)}Fixed`]: tones._10,
            [`on${toSentenceCase(key)}FixedVariant`]: tones._30,
            inversePrimary: tones._80,
          })
          Object.assign(newDark, {
            [key]: tones._80,
            [`on${toSentenceCase(key)}`]: tones._20,
            [`${key}Container`]: tones._30,
            [`on${toSentenceCase(key)}Container`]: tones._90,
            [`${key}Fixed`]: tones._90,
            [`${key}FixedDim`]: tones._80,
            [`on${toSentenceCase(key)}Fixed`]: tones._10,
            [`on${toSentenceCase(key)}FixedVariant`]: tones._30,
            inversePrimary: tones._80,
          })
          break
        case 'secondary':
        case 'tertiary':
          Object.assign(newLight, {
            [key]: tones._40,
            [`on${toSentenceCase(key)}`]: tones._98,
            [`${key}Container`]: tones._90,
            [`on${toSentenceCase(key)}Container`]: tones._10,
            [`${key}Fixed`]: tones._90,
            [`${key}FixedDim`]: tones._80,
            [`on${toSentenceCase(key)}Fixed`]: tones._10,
            [`on${toSentenceCase(key)}FixedVariant`]: tones._30,
          })
          Object.assign(newDark, {
            [key]: tones._80,
            [`on${toSentenceCase(key)}`]: tones._20,
            [`${key}Container`]: tones._30,
            [`on${toSentenceCase(key)}Container`]: tones._90,
            [`${key}Fixed`]: tones._90,
            [`${key}FixedDim`]: tones._80,
            [`on${toSentenceCase(key)}Fixed`]: tones._10,
            [`on${toSentenceCase(key)}FixedVariant`]: tones._30,
          })
          // Fall through to default for non-fixed tokens
          Object.assign(newLight, {
            [key]: tones._40,
            [`on${toSentenceCase(key)}`]: tones._98,
            [`${key}Container`]: tones._90,
            [`on${toSentenceCase(key)}Container`]: tones._10,
          })
          Object.assign(newDark, {
            [key]: tones._80,
            [`on${toSentenceCase(key)}`]: tones._20,
            [`${key}Container`]: tones._30,
            [`on${toSentenceCase(key)}Container`]: tones._90,
          })
          break
        default:
          Object.assign(newLight, {
            [key]: tones._40,
            [`on${toSentenceCase(key)}`]: tones._98,
            [`${key}Container`]: tones._90,
            [`on${toSentenceCase(key)}Container`]: tones._10,
          })
          Object.assign(newDark, {
            [key]: tones._80,
            [`on${toSentenceCase(key)}`]: tones._20,
            [`${key}Container`]: tones._30,
            [`on${toSentenceCase(key)}Container`]: tones._90,
          })
      }
    })

    theme.value = { light: newLight, dark: newDark }
  }

  async function updateThemeFromMaster(hexCode: string) {
    const newPalette: Record<string, string> = {}

    try {
      const colors = await materialDynamicColors(hexCode)

      newPalette.primary = colors.light.primary
      newPalette.secondary = colors.light.secondary
      newPalette.tertiary = colors.light.tertiary
      newPalette.neutral = colors.light.surfaceContainer

      const customColors: Record<string, { color: string; name: string }> = {
        info: { color: '#175bfc', name: 'info' },
        warning: { color: '#ffbf00', name: 'warning' },
        success: { color: '#42cb83', name: 'success' },
      }

      Object.keys(customColors).forEach((key) => {
        const sourceColor = argbFromHex(hexCode)
        const customColorObj = {
          value: argbFromHex(customColors[key].color),
          blend: true,
          name: customColors[key].name,
        }

        const result = customColor(sourceColor, customColorObj)
        const newHexVal = hexFromArgb(result.value)
        newPalette[key] = newHexVal
      })

      palette.value = { ...palette.value, ...newPalette }
    } catch (error) {
      console.error(error)
    }
  }

  // Apply CSS variables when theme or colorMode changes
  function applyCssVariables() {
    if (typeof document === 'undefined') return
    const root = document.documentElement

    Object.keys(theme.value.light).forEach((key) => {
      root.style.setProperty(`--light__${key.toLowerCase()}_lkv`, theme.value.light[key])
    })

    Object.keys(theme.value.dark).forEach((key) => {
      root.style.setProperty(`--dark__${key.toLowerCase()}_lkv`, theme.value.dark[key])
    })

    if (colorMode.value === 'dark') {
      Object.keys(theme.value.dark).forEach((key) => {
        root.style.setProperty(`--light__${key.toLowerCase()}_lkv`, theme.value.dark[key])
      })
    }
  }

  watch([theme, colorMode], applyCssVariables, { deep: true })

  onMounted(() => {
    updateTheme(palette.value)
  })

  // Watch palette changes to regenerate theme
  watch(palette, (newPalette) => {
    updateTheme(newPalette)
  }, { deep: true })

  const ctx: ThemeContext = {
    theme,
    updateTheme,
    updateThemeFromMaster,
    palette,
    colorMode,
    setColorMode,
  }

  provide(THEME_INJECTION_KEY, ctx)

  return ctx
}

/**
 * Injects LiftKit theme context. Must be used inside a component
 * that is a descendant of a component calling provideTheme().
 */
export function useTheme(): ThemeContext {
  const ctx = inject(THEME_INJECTION_KEY)
  if (!ctx) {
    throw new Error('useTheme() must be used inside a component wrapped with provideTheme()')
  }
  return ctx
}
