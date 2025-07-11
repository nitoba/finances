import type { CategoryBudget } from '@/types/finance'
import { BudgetRuleOverview } from './budget-rule-overview'
import { BalanceAreaChart } from './charts/aread-chart'
import { BudgetBarChart } from './charts/budget-bar-chart'
import { BudgetPieChart } from './charts/budget-pie-chart'
import { TrendLineChart } from './charts/trend-line-chart'
import { ExpenseRankings } from './expense-ranking'
import { FinancialMetrics } from './financial-metrics'

interface DashboardProps {
  budgets: CategoryBudget[]
  trendData: { name: string; [key: string]: string | number }[]
  comparisonData: { name: string; planned: number; actual: number }[]
  balanceData: { name: string; balance: number }[]
  onAdjustBudget?: (category: string, amount: number) => void
}

export function DashboardBlocks({
  budgets,
  trendData,
  balanceData,
  onAdjustBudget,
}: DashboardProps) {
  return (
    <div className="space-y-8">
      {/* Financial Metrics Overview */}
      <FinancialMetrics />

      {/* Budget Rule Overview and Expense Rankings */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BudgetRuleOverview
            budgets={budgets}
            onAdjustBudget={onAdjustBudget}
          />
        </div>
        <div>
          <ExpenseRankings />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        <BudgetPieChart budgets={budgets} />
        <BudgetBarChart budgets={budgets} />
      </div>

      {/* Trends and Projections */}
      <div className="grid gap-6 md:grid-cols-2">
        <TrendLineChart data={trendData} />
        <BalanceAreaChart data={balanceData} />
      </div>
    </div>
  )
}
