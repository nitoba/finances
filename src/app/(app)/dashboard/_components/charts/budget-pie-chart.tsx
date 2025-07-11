'use client'

import { Cell, Pie, PieChart } from 'recharts'
import { EnhancedChartContainer } from '@/components/enhanced-chart-container'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import type { CategoryBudget } from '@/types/finance'

const COLORS = {
  essentials: 'hsl(217, 91%, 60%)',
  leisure: 'hsl(142, 71%, 45%)',
  investments: 'hsl(262, 83%, 58%)',
  knowledge: 'hsl(25, 95%, 53%)',
  emergency: 'hsl(346, 87%, 43%)',
}

const chartConfig = {
  essentials: {
    label: 'Essentials',
    color: COLORS.essentials,
  },
  leisure: {
    label: 'Leisure',
    color: COLORS.leisure,
  },
  investments: {
    label: 'Investments',
    color: COLORS.investments,
  },
  knowledge: {
    label: 'Knowledge',
    color: COLORS.knowledge,
  },
  emergency: {
    label: 'Emergency',
    color: COLORS.emergency,
  },
} satisfies ChartConfig

interface BudgetPieChartProps {
  budgets: CategoryBudget[]
}

export function BudgetPieChart({ budgets }: BudgetPieChartProps) {
  const total = budgets?.reduce((sum, budget) => sum + budget.spent, 0) || 0
  const chartData =
    budgets?.map((budget) => ({
      category: budget.category,
      amount: budget.spent,
      fill:
        chartConfig[budget.category as keyof typeof chartConfig]?.color ||
        '#888888',
    })) || []

  // Filter out entries with zero or negative amounts for the pie chart
  const validChartData = chartData.filter((item) => item.amount > 0)
  const isEmpty =
    !budgets ||
    budgets.length === 0 ||
    total === 0 ||
    validChartData.length === 0

  const handleExport = () => {
    if (!budgets || budgets.length === 0) {
      return
    }

    // Export chart data as CSV
    const csvData = budgets.map((budget) => {
      const percentage = total > 0 ? (budget.spent / total) * 100 : 0
      return {
        Category:
          chartConfig[budget.category as keyof typeof chartConfig]?.label ||
          budget.category,
        Amount: budget.spent,
        'Percentage (%)': percentage.toFixed(1),
      }
    })

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map((row) => Object.values(row).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `expense-distribution-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <EnhancedChartContainer
      chartConfig={chartConfig}
      description="Budget allocation across categories"
      emptyMessage="No expense data available for distribution analysis"
      height={450}
      isEmpty={isEmpty}
      onExport={handleExport}
      title="Expense Distribution"
    >
      <div className="space-y-6">
        {/* Chart */}
        <div className="flex items-center justify-center">
          <ChartContainer
            className="mx-auto aspect-square h-[280px] w-[280px]"
            config={chartConfig}
          >
            <PieChart
              aria-label="Expense distribution pie chart showing budget allocation across categories"
              height={280}
              role="img"
              width={280}
            >
              <ChartTooltip
                content={<ChartTooltipContent hideLabel />}
                cursor={false}
              />
              <Pie
                aria-label="Budget allocation by category"
                cx="50%"
                cy="50%"
                data={validChartData}
                dataKey="amount"
                innerRadius={60}
                nameKey="category"
                outerRadius={100}
                paddingAngle={2}
                stroke="hsl(var(--background))"
                strokeWidth={2}
              >
                {validChartData.map((entry, index) => (
                  <Cell
                    aria-label={`${entry.category}: $${entry.amount.toLocaleString()}`}
                    fill={entry.fill}
                    key={`cell-${
                      // biome-ignore lint/suspicious/noArrayIndexKey: '<explanation>'
                      index
                    }`}
                  />
                ))}
              </Pie>
            </PieChart>
          </ChartContainer>
        </div>

        {/* Modern Legend */}
        <div className="grid grid-cols-2 gap-3">
          {budgets
            ?.filter((budget) => budget.spent > 0)
            .map((budget) => {
              const config =
                chartConfig[budget.category as keyof typeof chartConfig]
              const percentage = total > 0 ? (budget.spent / total) * 100 : 0

              if (!config) {
                return null
              }

              return (
                <div className="flex items-center gap-3" key={budget.category}>
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: config.color }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="truncate font-medium text-gray-700 text-sm dark:text-gray-300">
                        {config.label}
                      </p>
                      <p className="font-semibold text-gray-900 text-sm dark:text-gray-100">
                        {percentage.toFixed(1)}%
                      </p>
                    </div>
                    <p className="text-gray-500 text-xs dark:text-gray-400">
                      ${budget.spent.toLocaleString()}
                    </p>
                  </div>
                </div>
              )
            }) || []}
        </div>
      </div>
    </EnhancedChartContainer>
  )
}
