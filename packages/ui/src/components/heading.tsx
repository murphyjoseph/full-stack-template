import type { ComponentProps } from 'react'
import { styled } from '@repo/ui/jsx'
import { type HeadingVariantProps, heading } from '@repo/ui/recipes'
import type { StyledComponent } from '@repo/ui/types'

type Props = HeadingVariantProps & { as?: React.ElementType }

export type HeadingProps = ComponentProps<typeof Heading>
export const Heading = styled('h2', heading) as StyledComponent<'h2', Props>
