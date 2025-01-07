import { AlertTriangle } from 'lucide-react'
import { CategoryBudget } from '@/types/finance'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BudgetPieChart } from './charts/budget-pie-chart'
import { BudgetBarChart } from './charts/budget-bar-chart'
import { TrendLineChart } from './charts/trend-line-chart'
import { BalanceAreaChart } from './charts/aread-chart'
import { cn } from '@/lib/utils'

interface DashboardProps {
  budgets: CategoryBudget[]
  trendData: { name: string; [key: string]: string | number }[]
  comparisonData: { name: string; planned: number; actual: number }[]
  balanceData: { name: string; balance: number }[]
}

export function Dashboard({ budgets, trendData, balanceData }: DashboardProps) {
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
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {budgets.map((budget) => {
          const isOverBudget = budget.percentage > 100
          const isAlmostOverBudget =
            budget.percentage > 80 && budget.percentage <= 100
          const categoryColor = getCategoryColor(budget.category)

          return (
            <Card
              key={budget.category}
              className={cn({
                'ring-1 ring-red-500': isOverBudget,
                'ring-1 ring-yellow-500': isAlmostOverBudget,
              })}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium capitalize">
                  {budget.category}
                </CardTitle>
                {isOverBudget && (
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">
                    ${budget.spent.toFixed(2)}
                    <span className="text-xs text-muted-foreground ml-2">
                      / ${budget.planned.toFixed(2)}
                    </span>
                  </p>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className={cn('h-full rounded-full', {
                        'bg-red-500': isOverBudget,
                        'bg-yellow-500': isAlmostOverBudget,
                        [categoryColor]: !isOverBudget && !isAlmostOverBudget,
                      })}
                      style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {budget.percentage.toFixed(1)}% used
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expense Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetPieChart budgets={budgets} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Budget vs. Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <BudgetBarChart budgets={budgets} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Spending Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendLineChart data={trendData} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Projected Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <BalanceAreaChart data={balanceData} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
