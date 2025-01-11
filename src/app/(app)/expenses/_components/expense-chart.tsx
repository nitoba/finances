'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useExpenses } from '@/hooks/use-expenses'
import { useUser } from '@/hooks/use-user'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import dayjs from 'dayjs'
import { LoadingExpenseChart } from './loading-expense-chart'

export function ExpenseChart() {
  const { user } = useUser()
  const { data: expenses } = useExpenses()

  if (!user || !expenses) {
    return <LoadingExpenseChart />
  }

  // Calcular os gastos diários
  const dailyExpenses = expenses.reduce(
    (acc, expense) => {
      const date = dayjs(expense.date).format('DD/MM')
      if (!acc[date]) {
        acc[date] = 0
      }
      acc[date] += expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  // Converter os dados para o formato necessário pelo gráfico
  const data = Object.keys(dailyExpenses).map((date) => ({
    name: date,
    total: dailyExpenses[date],
  }))

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
