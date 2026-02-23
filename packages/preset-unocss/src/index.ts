import { definePreset } from '@unocss/core'
import fs from 'node:fs'
import path from 'node:path'

export interface LiftKitPresetOptions {
  /**
   * Whether to automatically inject the LiftKit CSS variables (light/dark colors, scaling factors).
   * @default true
   */
  injectVars?: boolean
}

// Preflight CSS loader to read from the sibling theme-css package
function loadLiftKitCSS() {
  try {
    // In a monorepo development environment or when installed in node_modules
    let basePath = ''
    try {
      basePath = path.dirname(require.resolve('@liftkit-vue/theme-css/package.json'))
    } catch {
      // Fallback: assume running inside the monorepo packages/preset-unocss/src
      basePath = path.resolve(__dirname, '../../theme-css')
    }

    const coreCSS = fs.readFileSync(path.join(basePath, 'css/liftkit-core.css'), 'utf-8')
    let typographyCSS = fs.readFileSync(path.join(basePath, 'css/typography.css'), 'utf-8')

    // Strip @import statements because throwing them into a virtual module (/__uno.css)
    // breaks other Vite plugins like tailwindcss which try to resolve relative paths.
    typographyCSS = typographyCSS.replace(/@import\s+['"][^'"]+['"];?/g, '')

    // We inject the CSS directly as preflights so UnoCSS applies them globally
    return [coreCSS, typographyCSS].join('\n\n')
  } catch (e) {
    console.warn('[@liftkit-vue/preset-unocss] Warning: Could not auto-inject LiftKit CSS variables. Make sure @liftkit-vue/theme-css is installed or manually import the CSS.')
    return ''
  }
}

export const presetLiftKit = definePreset((options: LiftKitPresetOptions = {}) => {
  const { injectVars = true } = options

  return {
    name: '@liftkit-vue/preset-unocss',

    preflights: injectVars ? [
      {
        getCSS: () => loadLiftKitCSS()
      }
    ] : [],

    theme: {
      colors: {
        primary: 'var(--lk-primary)',
        onprimary: 'var(--lk-onprimary)',
        primarycontainer: 'var(--lk-primarycontainer)',
        onprimarycontainer: 'var(--lk-onprimarycontainer)',
        secondary: 'var(--lk-secondary)',
        onsecondary: 'var(--lk-onsecondary)',
        secondarycontainer: 'var(--lk-secondarycontainer)',
        onsecondarycontainer: 'var(--lk-onsecondarycontainer)',
        tertiary: 'var(--lk-tertiary)',
        ontertiary: 'var(--lk-ontertiary)',
        tertiarycontainer: 'var(--lk-tertiarycontainer)',
        ontertiarycontainer: 'var(--lk-ontertiarycontainer)',
        error: 'var(--lk-error)',
        onerror: 'var(--lk-onerror)',
        errorcontainer: 'var(--lk-errorcontainer)',
        onerrorcontainer: 'var(--lk-onerrorcontainer)',
        background: 'var(--lk-background)',
        onbackground: 'var(--lk-onbackground)',
        surface: 'var(--lk-surface)',
        onsurface: 'var(--lk-onsurface)',
        surfacevariant: 'var(--lk-surfacevariant)',
        onsurfacevariant: 'var(--lk-onsurfacevariant)',
        outline: 'var(--lk-outline)',
        outlinevariant: 'var(--lk-outlinevariant)',
        shadow: 'var(--lk-shadow)',
        scrim: 'var(--lk-scrim)',
        inversesurface: 'var(--lk-inversesurface)',
        inverseonsurface: 'var(--lk-inverseonsurface)',
        inverseprimary: 'var(--lk-inverseprimary)',
        surfacecontainerlowest: 'var(--lk-surfacecontainerlowest)',
        surfacecontainerlow: 'var(--lk-surfacecontainerlow)',
        surfacecontainer: 'var(--lk-surfacecontainer)',
        surfacecontainerhigh: 'var(--lk-surfacecontainerhigh)',
        surfacecontainerhighest: 'var(--lk-surfacecontainerhighest)',
        surfacedim: 'var(--lk-surfacedim)',
        surfacebright: 'var(--lk-surfacebright)',
        success: 'var(--lk-success)',
        onsuccess: 'var(--lk-onsuccess)',
        successcontainer: 'var(--lk-successcontainer)',
        onsuccesscontainer: 'var(--lk-onsuccesscontainer)',
        warning: 'var(--lk-warning)',
        onwarning: 'var(--lk-onwarning)',
        warningcontainer: 'var(--lk-warningcontainer)',
        onwarningcontainer: 'var(--lk-onwarningcontainer)',
        info: 'var(--lk-info)',
        oninfo: 'var(--lk-oninfo)',
        infocontainer: 'var(--lk-infocontainer)',
        oninfocontainer: 'var(--lk-oninfocontainer)',
      },
      spacing: {
        '3xs': 'var(--lk-size-3xs)',
        '2xs': 'var(--lk-size-2xs)',
        'xs': 'var(--lk-size-xs)',
        'sm': 'var(--lk-size-sm)',
        'md': 'var(--lk-size-md)',
        'lg': 'var(--lk-size-lg)',
        'xl': 'var(--lk-size-xl)',
        '2xl': 'var(--lk-size-2xl)',
        '3xl': 'var(--lk-size-3xl)',
        '4xl': 'var(--lk-size-4xl)',
      },
      borderRadius: {
        '3xs': 'var(--lk-size-3xs)',
        '2xs': 'var(--lk-size-2xs)',
        'xs': 'var(--lk-size-xs)',
        'sm': 'var(--lk-size-sm)',
        'md': 'var(--lk-size-md)',
        'lg': 'var(--lk-size-lg)',
        'xl': 'var(--lk-size-xl)',
        '2xl': 'var(--lk-size-2xl)',
        '3xl': 'var(--lk-size-3xl)',
        '4xl': 'var(--lk-size-4xl)',
        'full': '100em',
        'none': '0em',
      },
      boxShadow: {
        'sm': 'var(--lk-shadow-sm)',
        'md': 'var(--lk-shadow-md)',
        'lg': 'var(--lk-shadow-lg)',
        'xl': 'var(--lk-shadow-xl)',
        '2xl': 'var(--lk-shadow-2xl)',
      }
    },

    rules: [
      // Dynamic Typography Size Rules (e.g. text-sm -> var(--lk-size-sm))
      [
        /^text-(3xs|2xs|xs|sm|md|lg|xl|2xl|3xl|4xl)$/,
        ([, size]) => ({ 'font-size': `var(--lk-size-${size})` })
      ],
      // Golden ratio line height mapping
      [
        /^leading-(eighthstep|quarterstep|halfstep|wholestep)$/,
        ([, step]) => ({ 'line-height': `var(--lk-${step})` })
      ]
    ],

    shortcuts: [
      // Typography Scale Mappings
      // Since typography.css defines these as classes, we map them as UnoCSS shortcuts
      // if we want to build pure utility strings, or we can just let typography.css handle them
      // globally. For robust UnoCSS atomic approach, we map them directly.
      ['display1', 'text-[length:var(--display1-font-size)] leading-[var(--lk-quarterstep)] tracking-[-0.022em] font-normal'],
      ['display1-bold', 'text-[length:var(--display1-font-size)] leading-[var(--lk-quarterstep)] tracking-[-0.022em] font-bold'],
      ['display2', 'text-[length:var(--display2-font-size)] leading-[var(--lk-halfstep)] tracking-[-0.022em] font-normal'],
      ['display2-bold', 'text-[length:var(--display2-font-size)] leading-[var(--lk-halfstep)] tracking-[-0.022em] font-bold'],
      ['title1', 'text-[length:var(--title1-font-size)] leading-[var(--lk-halfstep)] tracking-[-0.022em] font-normal'],
      ['title1-bold', 'text-[length:var(--title1-font-size)] leading-[var(--lk-halfstep)] tracking-[-0.022em] font-semibold'],
      ['title2', 'text-[length:var(--title2-font-size)] leading-[var(--lk-halfstep)] tracking-[-0.02em] font-normal'],
      ['title2-bold', 'text-[length:var(--title2-font-size)] leading-[var(--lk-halfstep)] tracking-[-0.02em] font-semibold'],
      ['title3', 'text-[length:var(--title3-font-size)] leading-[var(--lk-halfstep)] tracking-[-0.017em] font-normal'],
      ['title3-bold', 'text-[length:var(--title3-font-size)] leading-[var(--lk-halfstep)] tracking-[-0.017em] font-semibold'],
      ['heading', 'text-[length:var(--heading-font-size)] leading-[var(--lk-halfstep)] tracking-[-0.014em] font-semibold'],
      ['heading-bold', 'text-[length:var(--heading-font-size)] leading-[var(--lk-halfstep)] tracking-[-0.014em] font-bold'],
      ['subheading', 'text-[length:var(--subheading-font-size)] leading-[var(--lk-halfstep)] tracking-[-0.007em] font-normal'],
      ['subheading-bold', 'text-[length:var(--subheading-font-size)] leading-[var(--lk-halfstep)] tracking-[-0.007em] font-semibold'],
      ['body', 'text-[1em] leading-[var(--lk-wholestep)] tracking-[-0.011em] font-normal'],
      ['body-bold', 'text-[1em] leading-[var(--lk-wholestep)] tracking-[-0.011em] font-semibold'],
      ['callout', 'text-[length:var(--callout-font-size)] leading-[var(--lk-halfstep)] tracking-[-0.009em] font-normal'],
      ['callout-bold', 'text-[length:var(--callout-font-size)] leading-[var(--lk-halfstep)] tracking-[-0.009em] font-semibold'],
      ['label', 'text-[length:var(--label-font-size)] leading-[var(--lk-halfstep)] tracking-[-0.004em] font-semibold'],
      ['label-bold', 'text-[length:var(--label-font-size)] leading-[var(--lk-halfstep)] tracking-[-0.004em] font-bold'],
      ['caption', 'text-[length:var(--caption-font-size)] leading-[var(--lk-halfstep)] tracking-[-0.007em] font-normal'],
      ['caption-bold', 'text-[length:var(--caption-font-size)] leading-[var(--lk-halfstep)] tracking-[-0.007em] font-semibold'],
      ['capline', 'text-[length:var(--capline-font-size)] leading-[var(--lk-halfstep)] tracking-[0.0618em] uppercase font-normal'],
      ['capline-bold', 'text-[length:var(--capline-font-size)] leading-[var(--lk-halfstep)] tracking-[0.0618em] uppercase font-semibold'],
    ]
  }
})

export default presetLiftKit
