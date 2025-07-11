'use client'

import * as ProgressPrimitive from '@radix-ui/react-progress'
import * as React from 'react'

import { cn } from '@/lib/utils'

type Props = {
  progressIndicatorProps?: ProgressPrimitive.ProgressIndicatorProps
} & ProgressPrimitive.ProgressProps

const Progress = React.forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  Props
>(({ className, value, progressIndicatorProps, ...props }, ref) => (
  <ProgressPrimitive.Root
    className={cn(
      'relative h-2 w-full overflow-hidden rounded-full bg-secondary',
      className
    )}
    ref={ref}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn(
        'h-full w-full flex-1 bg-primary transition-all',
        progressIndicatorProps?.className
      )}
      style={{
        transform: `translateX(-${100 - (value || 0)}%)`,
        ...progressIndicatorProps?.style,
      }}
      {...progressIndicatorProps}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
