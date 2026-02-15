import { definePreset } from '@pandacss/dev'
import { createPreset } from '@park-ui/panda-preset'
import { absoluteCenter } from '../recipes/absolute-center'
import { breadcrumb } from '../recipes/breadcrumb'
import { group } from '../recipes/group'
import { heading } from '../recipes/heading'
import { inputAddon } from '../recipes/input-addon'
import { inputGroup } from '../recipes/input-group'
import { radioCardGroup } from '../recipes/radio-card-group'
import { scrollArea } from '../recipes/scroll-area'

export const uiPreset = definePreset({
  name: '@repo/ui',
  presets: [
    // @SETUP Customize design system for your brand
    // - Change accentColor and grayColor to match your brand palette
    // - Adjust borderRadius for your design aesthetic ('none', 'sm', 'md', 'lg', 'xl', '2xl')
    // - Add custom colors, fonts, and spacing in theme.extend below
    createPreset({
      accentColor: 'neutral',
      grayColor: 'neutral',
      borderRadius: 'md',
      additionalColors: ['*'],
    }),
  ],
  theme: {
    extend: {
      recipes: { absoluteCenter, group, heading, inputAddon },
      slotRecipes: { breadcrumb, inputGroup, radioCardGroup, scrollArea },
    },
  },
})
