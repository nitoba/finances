'use client'

import { ArrowDown, ArrowUp } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const categoryData = [
  {
    category: 'Essentials',
    amount: 1882.77,
    percentageOfTotal: 50.5,
    trend: 'up',
    previousAmount: 1650.0,
    color: '#3b82f6', // blue-500
  },
  {
    category: 'Leisure',
    amount: 609.1,
    percentageOfTotal: 16.3,
    trend: 'down',
    previousAmount: 750.0,
    color: '#10b981', // emerald-500
  },
  {
    category: 'Investments',
    amount: 530.41,
    percentageOfTotal: 14.2,
    trend: 'up',
    previousAmount: 480.0,
    color: '#f59e0b', // amber-500
  },
  {
    category: 'Emergency',
    amount: 700.0,
    percentageOfTotal: 18.8,
    trend: 'neutral',
    previousAmount: 700.0,
    color: '#ef4444', // red-500
  },
  {
    category: 'Knowledge',
    amount: 0.0,
    percentageOfTotal: 0,
    trend: 'down',
    previousAmount: 100.0,
    color: '#8b5cf6', // violet-500
  },
]

export function ExpenseRankings() {
  const sortedCategories = [...categoryData].sort((a, b) => b.amount - a.amount)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Expense Rankings</CardTitle>
          <CardDescription>
            Breakdown of expenses by category with month-over-month changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {sortedCategories.map((category) => (
              <div key={category.category} className="flex items-center">
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {category.category}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {category.percentageOfTotal}% of total expenses
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {category.trend === 'up' ? (
                    <ArrowUp className="h-4 w-4 text-red-500" />
                  ) : category.trend === 'down' ? (
                    <ArrowDown className="h-4 w-4 text-green-500" />
                  ) : null}
                  <span className="font-bold">
                    ${category.amount.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Category Distribution</CardTitle>
          <CardDescription>
            Visual representation of spending by category
          </CardDescription>
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
                  dataKey="amount"
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
                            ${data.amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-400">
                            {data.percentageOfTotal}% of total
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
              <div key={category.category} className="flex items-center">
                <div
                  className="mr-2 h-3 w-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                <span className="text-sm">{category.category}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
