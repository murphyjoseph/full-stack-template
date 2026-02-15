import { ark } from '@ark-ui/react/factory'
import { type ComponentProps, forwardRef } from 'react'
import { Stack, type StackProps, styled } from '@repo/ui/jsx'
import { skeleton } from '@repo/ui/recipes'

export type SkeletonProps = ComponentProps<typeof Skeleton>
export const Skeleton = styled(ark.div, skeleton)

export type SkeletonCircleProps = SkeletonProps

export const SkeletonCircle = forwardRef<HTMLDivElement, SkeletonCircleProps>(
  function SkeletonCircle(props, ref) {
    return <Skeleton ref={ref} borderRadius="full" {...props} />
  },
)

export interface SkeletonTextProps extends SkeletonProps {
  /**
   * Number of lines to display
   * @default 3
   */
  noOfLines?: number | undefined
  rootProps?: StackProps | undefined
}

export const SkeletonText = forwardRef<HTMLDivElement, SkeletonTextProps>(
  function SkeletonText(props, ref) {
    const { noOfLines = 3, gap, rootProps, ...skeletonProps } = props
    return (
      <Stack ref={ref} gap={gap} width="full" {...rootProps}>
        {[...Array(noOfLines).keys()].map((index) => (
          <Skeleton
            key={index}
            height="4"
            _last={{ maxW: noOfLines === 1 ? '100%' : '80%' }}
            {...skeletonProps}
          />
        ))}
      </Stack>
    )
  },
)
