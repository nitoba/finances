import { AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import type { CategoryBudget } from '@/types/finance'

type Props = {
  budgets: CategoryBudget[]
}

export function BudgetStatusCards({ budgets }: Props) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'essentials':
        return 'bg-blue-500'
      case 'leisure':
        return 'bg-purple-500'
      case 'investments':
        return 'bg-green-500'
      case 'knowledge':
        return 'bg-yellow-500'
      case 'emergency':
        return 'bg-red-500'
      default:
        return 'bg-gray-500'
    }
  }
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
      {budgets.map((budget) => {
        const isOverBudget = budget.percentage > 100
        const isAlmostOverBudget =
          budget.percentage > 80 && budget.percentage < 100
        const categoryColor = getCategoryColor(budget.category)

        const completedBudget = budget.planned === budget.spent

        return (
          <Card
            className={cn({
              'ring-1 ring-red-500': isOverBudget,
              'ring-1 ring-yellow-500': isAlmostOverBudget,
              'ring-1 ring-green-500': completedBudget,
            })}
            key={budget.category}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm capitalize">
                {budget.category}
              </CardTitle>
              {isOverBudget && (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-bold text-2xl">
                  ${budget.spent.toFixed(2)}
                  <span className="ml-2 text-muted-foreground text-xs">
                    / ${budget.planned.toFixed(2)}
                  </span>
                </p>
                <div className="h-2 rounded-full bg-muted">
                  <div
                    className={cn('h-full rounded-full', {
                      'bg-red-500': isOverBudget,
                      'bg-yellow-500': isAlmostOverBudget,
                      [categoryColor]: !(isOverBudget || isAlmostOverBudget),
                    })}
                    style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                  />
                </div>
                <p className="text-muted-foreground text-xs">
                  {budget.percentage.toFixed(1)}% used
                </p>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
