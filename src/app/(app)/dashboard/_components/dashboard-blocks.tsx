import { CategoryBudget } from '@/types/finance'
import { BudgetPieChart } from './charts/budget-pie-chart'
import { BudgetBarChart } from './charts/budget-bar-chart'
import { TrendLineChart } from './charts/trend-line-chart'
import { BalanceAreaChart } from './charts/aread-chart'
import { BudgetStatusCards } from './componente'

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <BudgetPieChart budgets={budgets} />
        <BudgetBarChart budgets={budgets} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <TrendLineChart data={trendData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <BalanceAreaChart data={balanceData} />
      </div>
    </div>
  )
}
