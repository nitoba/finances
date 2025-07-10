import type { CategoryBudget } from '@/types/finance'
import { BalanceAreaChart } from './charts/aread-chart'
import { BudgetBarChart } from './charts/budget-bar-chart'
import { BudgetPieChart } from './charts/budget-pie-chart'
import { TrendLineChart } from './charts/trend-line-chart'
import { BudgetStatusCards } from './componente'
import { ExpenseRankings } from './expense-ranking'
import { FinancialMetrics } from './financial-metrics'

interface DashboardProps {
  budgets: CategoryBudget[]
  trendData: { name: string; [key: string]: string | number }[]
  comparisonData: { name: string; planned: number; actual: number }[]
  balanceData: { name: string; balance: number }[]
}

export function DashboardBlocks({
  budgets,
  trendData,
  balanceData,
}: DashboardProps) {
  return (
    <div className="space-y-8">
      <BudgetStatusCards budgets={budgets} />

      <div className="flex-1 space-y-4">
        <FinancialMetrics />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <ExpenseRankings />
          <BudgetPieChart budgets={budgets} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
        <BudgetBarChart budgets={budgets} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
        <TrendLineChart data={trendData} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-1">
        <BalanceAreaChart data={balanceData} />
      </div>
    </div>
  )
}
