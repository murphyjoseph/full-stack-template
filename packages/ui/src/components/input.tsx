import { Field } from '@ark-ui/react/field'
import type { ComponentProps } from 'react'
import { styled } from '@repo/ui/jsx'
import { input } from '@repo/ui/recipes'

export type InputProps = ComponentProps<typeof Input>
export const Input = styled(Field.Input, input)
