import { ark } from '@ark-ui/react/factory'
import type { ComponentProps } from 'react'
import { styled } from '@repo/ui/jsx'
import { badge } from '@repo/ui/recipes'

export type BadgeProps = ComponentProps<typeof Badge>
export const Badge = styled(ark.div, badge)
