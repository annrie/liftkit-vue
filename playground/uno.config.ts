import { defineConfig } from 'unocss'
import presetWind4 from '@unocss/preset-wind4'
import { presetLiftKit } from '@liftkit-vue/preset-unocss'

export default defineConfig({
  presets: [
    presetWind4(),
    presetLiftKit({ injectVars: true })
  ]
})
