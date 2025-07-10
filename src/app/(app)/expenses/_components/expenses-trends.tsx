'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const categoryData = [
  { name: 'Essentials', value: 962.5, color: '#3b82f6' },
  { name: 'Leisure', value: 605.1, color: '#10b981' },
  { name: 'Investments', value: 0, color: '#f59e0b' },
  { name: 'Knowledge', value: 0, color: '#8b5cf6' },
]

const trendData = [
  {
    label: 'Maior aumento',
    category: 'Leisure',
    percentage: 15.2,
    trend: 'up',
  },
  {
    label: 'Maior redução',
    category: 'Essentials',
    percentage: 8.7,
    trend: 'down',
  },
]

export function ExpenseTrends() {
  const totalValue = categoryData.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle>Tendências de Gastos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trendData.map((item) => (
              <div className="flex items-center" key={item.label}>
                <div className="flex-1 space-y-1">
                  <p className="font-medium text-sm leading-none">
                    {item.label}
                  </p>
                  <p className="text-muted-foreground text-sm">
                    {item.category}
                  </p>
                </div>
                <div
                  className={`flex items-center gap-2 ${
                    item.trend === 'up' ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  {item.trend === 'up' ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span className="font-bold">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Distribuição Atual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px]">
            <ResponsiveContainer height="100%" width="100%">
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  data={categoryData}
                  dataKey="value"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                >
                  {categoryData.map((entry, index) => (
                    <Cell fill={entry.color} key={`cell-${index}`} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {categoryData.map((category) => (
              <div
                className="flex items-center justify-between"
                key={category.name}
              >
                <div className="flex items-center">
                  <div
                    className="mr-2 h-3 w-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm">{category.name}</span>
                </div>
                <span className="font-medium text-sm">
                  {((category.value / totalValue) * 100).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
