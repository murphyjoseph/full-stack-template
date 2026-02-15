import { ark } from '@ark-ui/react/factory'
import type { ComponentProps } from 'react'
import { styled } from '@repo/ui/jsx'
import { inputAddon } from '@repo/ui/recipes'

export type InputAddonProps = ComponentProps<typeof InputAddon>
export const InputAddon = styled(ark.div, inputAddon)
