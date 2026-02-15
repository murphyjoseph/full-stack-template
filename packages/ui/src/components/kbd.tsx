import { ark } from '@ark-ui/react/factory'
import { styled } from '@repo/ui/jsx'
import { kbd } from '@repo/ui/recipes'
import type { ComponentProps } from '@repo/ui/types'

export type KbdProps = ComponentProps<typeof Kbd>
export const Kbd = styled(ark.kbd, kbd)
