'use client'

import { AlertCircle, Download, Maximize2 } from 'lucide-react'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'

interface EnhancedChartContainerProps {
  title: string
  description?: string
  children: React.ReactNode
  isLoading?: boolean
  hasError?: boolean
  errorMessage?: string
  isEmpty?: boolean
  emptyMessage?: string
  onExport?: () => void
  onFullscreen?: () => void
  className?: string
  chartConfig?: any
  height?: string | number
  showControls?: boolean
}

export function EnhancedChartContainer({
  title,
  description,
  children,
  isLoading = false,
  hasError = false,
  errorMessage = 'Failed to load chart data',
  isEmpty = false,
  emptyMessage = 'No data available',
  onExport,
  onFullscreen,
  className,
  height = 350,
  showControls = true,
}: EnhancedChartContainerProps) {
  const [isAnimating, setIsAnimating] = React.useState(false)

  React.useEffect(() => {
    if (!(isLoading || hasError || isEmpty)) {
      setIsAnimating(true)
      const timer = setTimeout(() => setIsAnimating(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [isLoading, hasError, isEmpty])

  const handleExport = React.useCallback(() => {
    if (onExport) {
      onExport()
    } else {
      // Default export functionality
      console.log(`Exporting chart: ${title}`)
    }
  }, [onExport, title])

  const handleFullscreen = React.useCallback(() => {
    if (onFullscreen) {
      onFullscreen()
    } else {
      // Default fullscreen functionality
      console.log(`Fullscreen chart: ${title}`)
    }
  }, [onFullscreen, title])

  const renderChartContent = () => {
    if (hasError) {
      return (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <AlertCircle className="mb-4 h-12 w-12 text-destructive" />
          <h3 className="mb-2 font-semibold text-lg">Chart Error</h3>
          <p className="max-w-md text-muted-foreground text-sm">
            {errorMessage}
          </p>
          <Button
            className="mt-4"
            onClick={() => window.location.reload()}
            size="sm"
            variant="outline"
          >
            Retry
          </Button>
        </div>
      )
    }

    if (isEmpty) {
      return (
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            <div className="h-6 w-6 rounded bg-muted-foreground/30" />
          </div>
          <h3 className="mb-2 font-semibold text-lg">No Data</h3>
          <p className="max-w-md text-muted-foreground text-sm">
            {emptyMessage}
          </p>
        </div>
      )
    }

    if (isLoading) {
      return (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-64 w-full" />
          <div className="flex justify-center space-x-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-16" />
          </div>
        </div>
      )
    }

    return (
      <div
        className={cn(
          'transition-all duration-500 ease-out',
          isAnimating && 'fade-in slide-in-from-bottom-2 animate-in'
        )}
      >
        <div className="w-full" style={{ minHeight: height }}>
          {children}
        </div>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <Card
        className={cn(
          'border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-gray-200/40 shadow-lg dark:from-gray-900 dark:to-gray-800/50 dark:shadow-gray-900/40',
          className
        )}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="font-semibold text-gray-900 text-lg dark:text-gray-100">
                {title}
              </CardTitle>
              {description && (
                <p className="text-gray-600 text-sm dark:text-gray-400">
                  {description}
                </p>
              )}
            </div>

            {showControls && !isLoading && !hasError && !isEmpty && (
              <div className="flex items-center gap-2">
                {onExport && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="h-8 w-8"
                        onClick={handleExport}
                        size="icon"
                        variant="outline"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Export Chart</span>
                    </TooltipContent>
                  </Tooltip>
                )}

                {onFullscreen && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        className="h-8 w-8"
                        onClick={handleFullscreen}
                        size="icon"
                        variant="outline"
                      >
                        <Maximize2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <span>Fullscreen</span>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent>{renderChartContent()}</CardContent>
      </Card>
    </TooltipProvider>
  )
}
