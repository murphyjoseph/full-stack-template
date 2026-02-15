import { defineConfig } from '@pandacss/dev'
import { copyFileSync, appendFileSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { uiPreset } from './preset'

export default defineConfig({
  preflight: true,
  presets: ['@pandacss/preset-base', uiPreset],
  include: [],
  jsxFramework: 'react',
  outdir: 'styled-system',
  hooks: {
    'codegen:done': () => {
      // Inject createStyleContext into generated jsx module
      const root = process.cwd()
      copyFileSync(
        resolve(root, 'lib/create-style-context.tsx'),
        resolve(root, 'styled-system/jsx/create-style-context.tsx'),
      )

      const exportLine = `\nexport { createStyleContext } from './create-style-context';\n`

      const indexMjs = resolve(root, 'styled-system/jsx/index.mjs')
      if (!readFileSync(indexMjs, 'utf-8').includes('createStyleContext')) {
        appendFileSync(indexMjs, exportLine)
      }

      const indexDts = resolve(root, 'styled-system/jsx/index.d.ts')
      if (!readFileSync(indexDts, 'utf-8').includes('createStyleContext')) {
        appendFileSync(indexDts, exportLine)
      }
    },
  },
})
