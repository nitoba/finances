'use client'

import * as React from 'react'
import {
  Calculator,
  FileText,
  Keyboard,
  Plus,
  PlusCircle,
  Settings,
  TrendingUp,
} from 'lucide-react'
import { FloatingActionButton } from '@/components/ui/floating-action-button'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { ControlledAddExpenseDialog } from './controlled-add-expense-dialog'
import { QuickReportGenerator } from './quick-report-generator'

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  shortcut?: string
  action: () => void
  variant?: 'default' | 'success' | 'warning' | 'destructive'
}

interface QuickActionsProps {
  className?: string
  onAddExpense?: () => void
  onBudgetSettings?: () => void
  onGenerateReport?: () => void
}

export function QuickActions({
  className,
  onAddExpense,
  onBudgetSettings,
  onGenerateReport,
}: QuickActionsProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [showAddExpense, setShowAddExpense] = React.useState(false)
  const [showReportGenerator, setShowReportGenerator] = React.useState(false)

  const quickActions: QuickAction[] = [
    {
      id: 'add-expense',
      label: 'Add Expense',
      icon: <PlusCircle className="h-5 w-5" />,
      shortcut: '⌘+E',
      action: () => {
        setShowAddExpense(true)
        onAddExpense?.()
      },
      variant: 'success',
    },
    {
      id: 'budget-settings',
      label: 'Budget Settings',
      icon: <Settings className="h-5 w-5" />,
      shortcut: '⌘+B',
      action: () => {
        onBudgetSettings?.()
      },
    },
    {
      id: 'generate-report',
      label: 'Generate Report',
      icon: <FileText className="h-5 w-5" />,
      shortcut: '⌘+R',
      action: () => {
        setShowReportGenerator(true)
        onGenerateReport?.()
      },
    },
    {
      id: 'calculator',
      label: 'Quick Calculator',
      icon: <Calculator className="h-5 w-5" />,
      shortcut: '⌘+C',
      action: () => {
        // Open calculator modal
      },
    },
  ]

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey) {
        switch (event.key.toLowerCase()) {
          case 'e':
            event.preventDefault()
            setShowAddExpense(true)
            onAddExpense?.()
            break
          case 'b':
            event.preventDefault()
            onBudgetSettings?.()
            break
          case 'r':
            event.preventDefault()
            setShowReportGenerator(true)
            onGenerateReport?.()
            break
          case 'c':
            event.preventDefault()
            // Open calculator
            break
          case 'k':
            event.preventDefault()
            setIsExpanded(!isExpanded)
            break
        }
      }

      // ESC to close expanded menu
      if (event.key === 'Escape' && isExpanded) {
        setIsExpanded(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isExpanded, onAddExpense, onBudgetSettings, onGenerateReport])

  return (
    <TooltipProvider>
      <div className={cn('fixed right-6 bottom-6 z-50', className)}>
        {/* Backdrop overlay when expanded */}
        {isExpanded && (
          <div
            className="-z-10 fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsExpanded(false)}
          />
        )}

        {/* Quick action buttons */}
        <div className="flex flex-col-reverse gap-3">
          {isExpanded &&
            quickActions.map((action, index) => (
              <div
                key={action.id}
                className="slide-in-from-bottom-2 fade-in animate-in duration-200"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="lg"
                      variant={
                        action.variant === 'success' ? 'default' : 'secondary'
                      }
                      className={cn(
                        'h-12 w-12 rounded-full shadow-lg transition-all hover:shadow-xl',
                        action.variant === 'success' &&
                          'bg-green-600 hover:bg-green-700'
                      )}
                      onClick={() => {
                        action.action()
                        setIsExpanded(false)
                      }}
                    >
                      {action.icon}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="left" className="mr-4">
                    <div className="flex items-center gap-2">
                      <span>{action.label}</span>
                      {action.shortcut && (
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-muted-foreground text-xs opacity-100">
                          {action.shortcut}
                        </kbd>
                      )}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </div>
            ))}

          {/* Main FAB */}
          <Tooltip>
            <TooltipTrigger asChild>
              <FloatingActionButton
                variant="success"
                size="lg"
                position="relative"
                onClick={() => setIsExpanded(!isExpanded)}
                className={cn(
                  'transition-transform duration-200',
                  isExpanded && 'rotate-45'
                )}
              >
                <Plus className="h-6 w-6" />
              </FloatingActionButton>
            </TooltipTrigger>
            <TooltipContent side="left" className="mr-4">
              <div className="flex items-center gap-2">
                <span>Quick Actions</span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-muted-foreground text-xs opacity-100">
                  ⌘+K
                </kbd>
              </div>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Keyboard shortcut indicator */}
        {isExpanded && (
          <div className="-top-12 fade-in absolute right-0 animate-in duration-200">
            <div className="rounded-lg border border-border bg-background/95 px-3 py-2 shadow-lg backdrop-blur">
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Keyboard className="h-4 w-4" />
                <span>Press ESC to close</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Expense Dialog */}
      <ControlledAddExpenseDialog
        open={showAddExpense}
        onOpenChange={setShowAddExpense}
        onAddExpense={onAddExpense}
      />

      {/* Quick Report Generator */}
      <QuickReportGenerator
        open={showReportGenerator}
        onOpenChange={setShowReportGenerator}
      />
    </TooltipProvider>
  )
}
