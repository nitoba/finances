// 'use client'

import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from 'recharts'

import { CategoryBudget } from '@/types/finance'
import { ChartConfig } from '@/components/ui/chart'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'

const COLORS = {
  essentials: '#3b82f6',
  leisure: '#8b5cf6',
  investments: '#22c55e',
  knowledge: '#eab308',
  emergency: '#ef4444',
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
  const sortedCategories = budgets.map((budget) => ({
    name: budget.category.charAt(0).toUpperCase() + budget.category.slice(1),
    value: budget.spent,
    planned: budget.planned,
    color: chartConfig[budget.category].color,
  }))

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Expense Distribution</CardTitle>
        <CardDescription>Current Budget Distribution</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sortedCategories}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                labelLine={false}
              >
                {sortedCategories.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload
                    return (
                      <div className="rounded-lg bg-white p-2 shadow-md">
                        <p className="font-semibold">{data.category}</p>
                        <p className="text-sm text-gray-500">
                          ${data.value.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-400">
                          {data.planned} of total
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {sortedCategories.map((category) => (
            <div key={category.name} className="flex items-center">
              <div
                className="mr-2 h-3 w-3 rounded-full"
                style={{ backgroundColor: category.color }}
              />
              <span className="text-sm">{category.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
