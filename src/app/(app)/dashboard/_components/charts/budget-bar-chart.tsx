'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import { EnhancedChartContainer } from '@/components/enhanced-chart-container'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { cn } from '@/lib/utils'
import type { CategoryBudget } from '@/types/finance'

interface BudgetBarChartProps {
  budgets: CategoryBudget[]
}

const chartConfig = {
  planned: {
    label: 'Planned',
    color: 'hsl(220, 14%, 83%)',
  },
  spent: {
    label: 'Spent',
    color: 'hsl(217, 91%, 60%)',
  },
} satisfies ChartConfig

export function BudgetBarChart({ budgets }: BudgetBarChartProps) {
  const data = budgets.map((budget) => ({
    category: budget.category,
    name: budget.category.charAt(0).toUpperCase() + budget.category.slice(1),
    planned: budget.planned,
    spent: budget.spent,
  }))

  const totalPlanned = budgets.reduce((acc, budget) => acc + budget.planned, 0)
  const totalSpent = budgets.reduce((acc, budget) => acc + budget.spent, 0)
  const budgetUtilization =
    totalPlanned > 0 ? (totalSpent / totalPlanned) * 100 : 0
  const isOverBudget = budgetUtilization > 100
  const isEmpty = !budgets || budgets.length === 0

  const handleExport = () => {
    // Export chart data as CSV
    const csvData = data.map((item) => ({
      Category: item.name,
      Planned: item.planned,
      Spent: item.spent,
      'Utilization (%)':
        item.planned > 0 ? ((item.spent / item.planned) * 100).toFixed(1) : '0',
    }))

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map((row) => Object.values(row).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `budget-comparison-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <EnhancedChartContainer
      chartConfig={chartConfig}
      description="Planned vs actual spending by category"
      emptyMessage="No budget data available for comparison"
      isEmpty={isEmpty}
      onExport={handleExport}
      title="Budget vs. Spending"
    >
      <div className="space-y-4">
        {/* Budget Utilization Badge */}
        <div className="flex items-center justify-between">
          <div
            className={cn(
              'inline-flex items-center gap-1 rounded-full px-3 py-1 font-medium text-sm',
              isOverBudget
                ? 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                : 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
            )}
          >
            {isOverBudget ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            {budgetUtilization.toFixed(1)}%
          </div>
          <p className="text-gray-500 text-xs dark:text-gray-400">
            Budget utilization
          </p>
        </div>

        {/* Chart */}
        <ChartContainer className="w-full" config={chartConfig}>
          <BarChart
            accessibilityLayer
            aria-label="Budget vs spending comparison chart showing planned versus actual spending by category"
            data={data}
            margin={{
              top: 10,
              right: 30,
              left: 20,
              bottom: 0,
            }}
            role="img"
          >
            <CartesianGrid
              stroke="hsl(var(--muted-foreground))"
              strokeOpacity={0.1}
              vertical={false}
            />
            <XAxis
              aria-label="Categories"
              axisLine={false}
              className="text-sm"
              dataKey="name"
              height={60}
              tick={{ fontSize: 13, textAnchor: 'middle' }}
              tickLine={false}
            />
            <YAxis
              aria-label="Amount in dollars"
              axisLine={false}
              className="text-xs"
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <ChartTooltip
              content={<ChartTooltipContent />}
              cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
            />
            <Bar
              aria-label="Planned budget"
              dataKey="planned"
              fill="var(--color-planned)"
              opacity={0.8}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              aria-label="Actual spending"
              dataKey="spent"
              fill="var(--color-spent)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-gradient-to-r from-blue-50 to-blue-100/50 p-4 dark:from-blue-900/20 dark:to-blue-800/10">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-500" />
              <span className="font-medium text-blue-900 text-sm dark:text-blue-100">
                Total Spent
              </span>
            </div>
            <p className="mt-1 font-semibold text-2xl text-blue-900 dark:text-blue-100">
              ${totalSpent.toLocaleString()}
            </p>
          </div>
          <div className="rounded-lg bg-gradient-to-r from-gray-50 to-gray-100/50 p-4 dark:from-gray-900/20 dark:to-gray-800/10">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-gray-400" />
              <span className="font-medium text-gray-900 text-sm dark:text-gray-100">
                Total Planned
              </span>
            </div>
            <p className="mt-1 font-semibold text-2xl text-gray-900 dark:text-gray-100">
              ${totalPlanned.toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </EnhancedChartContainer>
  )
}
