'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const data = [
  {
    name: '01/01',
    total: 500.0,
  },
  {
    name: '07/01',
    total: 700.0,
  },
  {
    name: '08/01',
    total: 69.0,
  },
  {
    name: '09/01',
    total: 269.6,
  },
  {
    name: '05/01',
    total: 28.0,
  },
]

export function ExpenseChart() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Gastos por Dia</CardTitle>
        <CardDescription>
          Visualização dos gastos diários no período selecionado
        </CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Bar
              dataKey="total"
              fill="currentColor"
              radius={[4, 4, 0, 0]}
              className="fill-primary"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
