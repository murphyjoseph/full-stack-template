import { ark } from '@ark-ui/react/factory'
import type { ComponentProps } from 'react'
import { styled } from '@repo/ui/jsx'
import { code } from '@repo/ui/recipes'

export type CodeProps = ComponentProps<typeof Code>
export const Code = styled(ark.code, code)
