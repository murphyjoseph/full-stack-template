import { ark } from '@ark-ui/react'
import type { ComponentProps } from 'react'
import { styled } from '@repo/ui/jsx'
import { group } from '@repo/ui/recipes'

export type GroupProps = ComponentProps<typeof Group>
export const Group = styled(ark.div, group)
