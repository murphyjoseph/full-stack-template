'use client'

import { createContext, forwardRef, useContext } from 'react'
import type { ElementType } from 'react'
import { styled } from './factory'

type Props = Record<string, unknown>
type Recipe = {
  (props?: Props): Props
  splitVariantProps: (props: Props) => [Props, Props]
}

interface Options {
  defaultProps?: Props
  forwardProps?: string[]
}

export const createStyleContext = (recipe: Recipe) => {
  const StyleContext = createContext<Record<string, string> | null>(null)

  const withRootProvider = <C extends ElementType>(
    Component: C,
    options?: Options,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Comp = forwardRef((props: any, ref: any) => {
      const mergedProps = options?.defaultProps
        ? { ...options.defaultProps, ...props }
        : props
      const [variantProps, otherProps] = recipe.splitVariantProps(mergedProps)
      const slotStyles = recipe(variantProps) as Record<string, string>
      return (
        <StyleContext.Provider value={slotStyles}>
          {/* @ts-expect-error — ref forwarding to generic component */}
          <Component ref={ref} {...otherProps} />
        </StyleContext.Provider>
      )
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Comp.displayName = (Component as any).displayName || (Component as any).name
    return Comp
  }

  const withProvider = <C extends ElementType>(
    Component: C,
    slot?: string,
    options?: Options,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const StyledComp = styled(Component) as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Comp = forwardRef((props: any, ref: any) => {
      const mergedProps = options?.defaultProps
        ? { ...options.defaultProps, ...props }
        : props
      const [variantProps, otherProps] = recipe.splitVariantProps(mergedProps)
      const slotStyles = recipe(variantProps) as Record<string, string>
      const forwarded = options?.forwardProps
        ? Object.fromEntries(
            options.forwardProps
              .filter((k) => k in mergedProps)
              .map((k) => [k, mergedProps[k]]),
          )
        : {}
      return (
        <StyleContext.Provider value={slotStyles}>
          <StyledComp
            ref={ref}
            {...otherProps}
            {...forwarded}
            className={slotStyles[slot ?? '']}
          />
        </StyleContext.Provider>
      )
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Comp.displayName = (Component as any).displayName || (Component as any).name
    return Comp
  }

  const withContext = <C extends ElementType>(
    Component: C,
    slot?: string,
    options?: Options,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): any => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const StyledComp = styled(Component) as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const Comp = forwardRef((props: any, ref: any) => {
      const slotStyles = useContext(StyleContext)
      const mergedProps = options?.defaultProps
        ? { ...options.defaultProps, ...props }
        : props
      return (
        <StyledComp
          ref={ref}
          {...mergedProps}
          className={slotStyles?.[slot ?? '']}
        />
      )
    })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Comp.displayName = (Component as any).displayName || (Component as any).name
    return Comp
  }

  return { withProvider, withContext, withRootProvider }
}
