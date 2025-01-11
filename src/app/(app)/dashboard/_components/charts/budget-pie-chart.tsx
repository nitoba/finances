// 'use client'

import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from 'recharts'

import { CategoryBudget } from '@/types/finance'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'

const chartConfig = {
  essentials: {
    label: 'Essentials',
    color: 'hsl(var(--chart-1))',
  },
  leisure: {
    label: 'Leisure',
    color: 'hsl(var(--chart-2))',
  },
  investments: {
    label: 'Investments',
    color: 'hsl(var(--chart-3))',
  },
  knowledge: {
    label: 'Knowledge',
    color: 'hsl(var(--chart-4))',
  },
  emergency: {
    label: 'Emergency',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig

interface BudgetPieChartProps {
  budgets: CategoryBudget[]
}

const COLORS = {
  essentials: '#3b82f6',
  leisure: '#8b5cf6',
  investments: '#22c55e',
  knowledge: '#eab308',
  emergency: '#ef4444',
}

export function BudgetPieChart({ budgets }: BudgetPieChartProps) {
  const data = budgets.map((budget) => ({
    name: budget.category.charAt(0).toUpperCase() + budget.category.slice(1),
    value: budget.spent,
    planned: budget.planned,
  }))

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center sm:pb-0 pb-5">
        <CardTitle>Expense Distribution</CardTitle>
        <CardDescription>Current Budget Distribution</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-auto sm:aspect-square h-[350px] sm:max-h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelKey="category"
                    nameKey="name"
                    indicator="line"
                    labelFormatter={(_, payload) => {
                      return chartConfig[
                        payload?.[0].dataKey as keyof typeof chartConfig
                      ]?.label
                    }}
                  />
                }
              />
              <Pie
                data={data}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={80}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      COLORS[entry.name.toLowerCase() as keyof typeof COLORS]
                    }
                  />
                ))}
              </Pie>
              <Pie
                data={data}
                dataKey="planned"
                cx="50%"
                cy="50%"
                innerRadius={90}
                outerRadius={100}
                labelLine={false}
                opacity={0.3}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-planned-${index}`}
                    fill={
                      COLORS[entry.name.toLowerCase() as keyof typeof COLORS]
                    }
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm mt-5">
        <div className="flex items-center gap-2 font-medium leading-none">
          Budget Overview
        </div>
        <div className="leading-none text-muted-foreground">
          Showing current budget distribution
        </div>
      </CardFooter>
    </Card>
  )
}
