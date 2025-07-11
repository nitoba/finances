import type { CategoryBudget } from '@/types/finance'
import type { Expense } from '@/schemas/expense.schema'
import { BudgetRuleOverview } from './budget-rule-overview'
import { BalanceAreaChart } from './charts/aread-chart'
import { BudgetBarChart } from './charts/budget-bar-chart'
import { BudgetPieChart } from './charts/budget-pie-chart'
import { TrendLineChart } from './charts/trend-line-chart'
import { MovingAveragesChart } from './charts/moving-averages-chart'
import { ExpenseRankings } from './expense-ranking'
import { FinancialMetrics } from './financial-metrics'
import { TrendAnalysisPanel } from './trend-analysis-panel'
import { BudgetComparisonWidgets } from './budget-comparison-widgets'

interface DashboardProps {
  budgets: CategoryBudget[]
  trendData: { name: string; [key: string]: string | number }[]
  comparisonData: { name: string; planned: number; actual: number }[]
  balanceData: { name: string; balance: number }[]
  expenses: Expense[]
  onAdjustBudget?: (category: string, amount: number) => void
}

export function DashboardBlocks({
  budgets,
  trendData,
  balanceData,
  expenses,
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

      {/* Budget Comparison Widgets */}
      <BudgetComparisonWidgets budgets={budgets} />

      {/* Advanced Trend Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        <MovingAveragesChart expenses={expenses} />
      </div>

      {/* Comprehensive Trend Analysis Panel */}
      <TrendAnalysisPanel expenses={expenses} />
    </div>
  )
}
