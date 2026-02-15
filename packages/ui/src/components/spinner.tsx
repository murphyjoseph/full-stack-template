import { ark } from '@ark-ui/react/factory'
import type { ComponentProps } from 'react'
import { styled } from '@repo/ui/jsx'
import { spinner } from '@repo/ui/recipes'

export type SpinnerProps = ComponentProps<typeof Spinner>
export const Spinner = styled(ark.span, spinner)
