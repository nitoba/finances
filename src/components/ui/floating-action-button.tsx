'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const fabVariants = cva(
  'inline-flex items-center justify-center rounded-full font-medium shadow-lg transition-all hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-95 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        success: 'bg-green-600 text-white hover:bg-green-700',
        warning: 'bg-orange-600 text-white hover:bg-orange-700',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
      },
      size: {
        default: 'h-14 w-14',
        lg: 'h-16 w-16',
        sm: 'h-12 w-12',
      },
      position: {
        'bottom-right': 'fixed right-6 bottom-6 z-50',
        'bottom-left': 'fixed bottom-6 left-6 z-50',
        'top-right': 'fixed top-6 right-6 z-50',
        'top-left': 'fixed top-6 left-6 z-50',
        'center-bottom': '-translate-x-1/2 fixed bottom-6 left-1/2 z-50',
        relative: 'relative',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
      position: 'bottom-right',
    },
  }
)

export interface FloatingActionButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof fabVariants> {
  asChild?: boolean
}

const FloatingActionButton = React.forwardRef<
  HTMLButtonElement,
  FloatingActionButtonProps
>(({ className, variant, size, position, asChild = false, ...props }, ref) => {
  return (
    <button
      className={cn(fabVariants({ variant, size, position, className }))}
      ref={ref}
      {...props}
    />
  )
})
FloatingActionButton.displayName = 'FloatingActionButton'

export { FloatingActionButton, fabVariants }
