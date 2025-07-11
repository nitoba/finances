'use client'

import { Minus, Plus, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import type { CategoryBudget } from '@/types/finance'

interface BudgetRuleOverviewProps {
  budgets: CategoryBudget[]
  onAdjustBudget?: (category: string, amount: number) => void
}

const categoryConfig = {
  essentials: {
    label: 'Essentials',
    description: 'Housing, utilities, groceries',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-100 dark:bg-blue-900/20',
    textColor: 'text-blue-700 dark:text-blue-400',
    percentage: '56%',
  },
  leisure: {
    label: 'Leisure',
    description: 'Entertainment, dining out',
    color: 'bg-green-500',
    lightColor: 'bg-green-100 dark:bg-green-900/20',
    textColor: 'text-green-700 dark:text-green-400',
    percentage: '14%',
  },
  investments: {
    label: 'Investments',
    description: 'Stocks, bonds, retirement',
    color: 'bg-purple-500',
    lightColor: 'bg-purple-100 dark:bg-purple-900/20',
    textColor: 'text-purple-700 dark:text-purple-400',
    percentage: '10%',
  },
  knowledge: {
    label: 'Knowledge',
    description: 'Books, courses, education',
    color: 'bg-orange-500',
    lightColor: 'bg-orange-100 dark:bg-orange-900/20',
    textColor: 'text-orange-700 dark:text-orange-400',
    percentage: '10%',
  },
  emergency: {
    label: 'Emergency',
    description: 'Emergency fund savings',
    color: 'bg-red-500',
    lightColor: 'bg-red-100 dark:bg-red-900/20',
    textColor: 'text-red-700 dark:text-red-400',
    percentage: '10%',
  },
}

export function BudgetRuleOverview({
  budgets,
  onAdjustBudget,
}: BudgetRuleOverviewProps) {
  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="font-semibold text-xl">
                70/30 Budget Rule
              </CardTitle>
              <p className="mt-1 text-muted-foreground text-sm">
                Your money allocation across categories
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-medium text-muted-foreground text-sm">
                  This Month
                </p>
                <p className="font-semibold text-2xl">
                  $
                  {budgets
                    .reduce((sum, budget) => sum + budget.spent, 0)
                    .toLocaleString()}
                </p>
              </div>
              {onAdjustBudget && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="h-8 w-8" size="icon" variant="outline">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>Budget Settings (⌘+B)</span>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4">
            {budgets.map((budget) => {
              const config =
                categoryConfig[budget.category as keyof typeof categoryConfig]
              const progressValue = Math.min(
                (budget.spent / budget.planned) * 100,
                100
              )
              const isOverBudget = budget.spent > budget.planned

              return (
                <div className="space-y-2" key={budget.category}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn('h-3 w-3 rounded-full', config.color)}
                      />
                      <div>
                        <p className="font-medium text-sm">{config.label}</p>
                        <p className="text-muted-foreground text-xs">
                          {config.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          ${budget.spent.toLocaleString()} / $
                          {budget.planned.toLocaleString()}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          {config.percentage} of income
                        </p>
                      </div>
                      {onAdjustBudget && (
                        <div className="flex items-center gap-1">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                className="h-6 w-6"
                                onClick={() =>
                                  onAdjustBudget(budget.category, -50)
                                }
                                size="icon"
                                variant="outline"
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <span>Decrease budget by $50</span>
                            </TooltipContent>
                          </Tooltip>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                className="h-6 w-6"
                                onClick={() =>
                                  onAdjustBudget(budget.category, 50)
                                }
                                size="icon"
                                variant="outline"
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <span>Increase budget by $50</span>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Progress
                      className={cn('h-2', {
                        '[&>div]:bg-red-500': isOverBudget,
                        [`[&>div]:${config.color.replace('bg-', 'bg-')}`]:
                          !isOverBudget,
                      })}
                      value={progressValue}
                    />
                    <div className="flex justify-between text-muted-foreground text-xs">
                      <span>{progressValue.toFixed(1)}% used</span>
                      {isOverBudget && (
                        <span className="font-medium text-red-500">
                          ${(budget.spent - budget.planned).toLocaleString()}{' '}
                          over
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Summary Section */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div
                className={cn(
                  'rounded-lg p-3',
                  categoryConfig.essentials.lightColor
                )}
              >
                <p className="font-medium text-muted-foreground text-xs">
                  NEEDS (70%)
                </p>
                <p
                  className={cn(
                    'font-semibold text-lg',
                    categoryConfig.essentials.textColor
                  )}
                >
                  $
                  {(
                    (budgets.find((b) => b.category === 'essentials')?.spent ||
                      0) +
                    (budgets.find((b) => b.category === 'leisure')?.spent || 0)
                  ).toLocaleString()}
                </p>
              </div>
              <div
                className={cn(
                  'rounded-lg p-3',
                  categoryConfig.investments.lightColor
                )}
              >
                <p className="font-medium text-muted-foreground text-xs">
                  SAVINGS (30%)
                </p>
                <p
                  className={cn(
                    'font-semibold text-lg',
                    categoryConfig.investments.textColor
                  )}
                >
                  $
                  {budgets
                    .filter((b) =>
                      ['investments', 'knowledge', 'emergency'].includes(
                        b.category
                      )
                    )
                    .reduce((sum, budget) => sum + budget.spent, 0)
                    .toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  )
}
