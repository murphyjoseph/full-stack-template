import { ark } from '@ark-ui/react/factory'
import type { ComponentProps } from 'react'
import { styled } from '@repo/ui/jsx'
import { link } from '@repo/ui/recipes'

export type LinkProps = ComponentProps<typeof Link>
export const Link = styled(ark.a, link)
