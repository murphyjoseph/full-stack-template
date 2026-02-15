import type { ComponentProps } from 'react'
import { styled } from '@repo/ui/jsx'
import { type TextVariantProps, text } from '@repo/ui/recipes'
import type { StyledComponent } from '@repo/ui/types'

type Props = TextVariantProps & { as?: React.ElementType }

export type TextProps = ComponentProps<typeof Text>
export const Text = styled('p', text) as StyledComponent<'p', Props>
