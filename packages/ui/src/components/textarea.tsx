import { Field } from '@ark-ui/react/field'
import type { ComponentProps } from 'react'
import { styled } from '@repo/ui/jsx'
import { textarea } from '@repo/ui/recipes'

export type TextareaProps = ComponentProps<typeof Textarea>
export const Textarea = styled(Field.Textarea, textarea)
