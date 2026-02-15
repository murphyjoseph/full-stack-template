import { ark } from '@ark-ui/react/factory'
import type { ComponentProps } from 'react'
import { styled } from '@repo/ui/jsx'
import { icon } from '@repo/ui/recipes'

export type IconProps = ComponentProps<typeof Icon>
export const Icon = styled(ark.svg, icon, {
  defaultProps: { asChild: true },
})
