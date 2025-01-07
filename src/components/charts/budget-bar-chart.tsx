'use client'

import { TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { CategoryBudget } from '@/types/finance'

interface BudgetBarChartProps {
  budgets: CategoryBudget[]
}

const COLORS = {
  planned: '#94a3b8',
  spent: '#3b82f6',
}

const chartConfig = {
  planned: {
    label: 'Planned',
    color: '#94a3b8',
  },
  spent: {
    label: 'Spent',
    color: '#3b82f6',
  },
} satisfies ChartConfig

export function BudgetBarChart({ budgets }: BudgetBarChartProps) {
  const data = budgets.map((budget) => ({
    name: budget.category.charAt(0).toUpperCase() + budget.category.slice(1),
    planned: budget.planned,
    spent: budget.spent,
  }))

  function calculateTrend(budgets: CategoryBudget[]) {
    const totalPlanned = budgets.reduce(
      (acc, budget) => acc + budget.planned,
      0,
    )
    const totalSpent = budgets.reduce((acc, budget) => acc + budget.spent, 0)
    const trend = totalSpent / totalPlanned

    return trend.toFixed(2)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Bar Chart</CardTitle>
        <CardDescription>Planned vs Spent</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="planned" fill={COLORS.planned} radius={4} />
            <Bar dataKey="spent" fill={COLORS.spent} radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by {calculateTrend(budgets)}% this month{' '}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing budget data for the selected period
        </div>
      </CardFooter>
    </Card>
  )
}
