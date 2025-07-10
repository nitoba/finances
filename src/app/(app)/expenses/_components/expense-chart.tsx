'use client'

import dayjs from 'dayjs'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useExpenses } from '@/hooks/use-expenses'
import { useUser } from '@/hooks/use-user'
import { LoadingExpenseChart } from './loading-expense-chart'

export function ExpenseChart() {
  const { user } = useUser()
  const { data: expenses } = useExpenses()

  if (!(user && expenses)) {
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
    {} as Record<string, number>
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
        <ResponsiveContainer height={350} width="100%">
          <BarChart data={data}>
            <XAxis
              axisLine={false}
              dataKey="name"
              fontSize={12}
              stroke="#888888"
              tickLine={false}
            />
            <YAxis
              axisLine={false}
              fontSize={12}
              stroke="#888888"
              tickFormatter={(value) => `$${value}`}
              tickLine={false}
            />
            <Bar
              className="fill-primary"
              dataKey="total"
              fill="currentColor"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
