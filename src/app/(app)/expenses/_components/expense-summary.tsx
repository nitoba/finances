'use client'

import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  TrendingDown,
  Wallet,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useExpenses } from '@/hooks/use-expenses'
import { useServerActionQuery } from '@/hooks/server-action-hooks'
import dayjs from 'dayjs'
import { getExpensesByMonthAction } from '@/services/actions/expenses.action'

const previousMonth = dayjs().subtract(1, 'month').toDate().toISOString()

export function ExpenseSummary() {
  const { data: expenses } = useExpenses()
  const { data: previousExpenses = [], isLoading } = useServerActionQuery(
    getExpensesByMonthAction,
    {
      queryKey: ['previous-expenses', previousMonth],
      input: { month: previousMonth },
    },
  )

  if (!expenses || isLoading) {
    return null
  }

  const totalExpenses = expenses.reduce(
    (acc, expense) => acc + expense.amount,
    0,
  )
  const previousTotalExpenses = previousExpenses.reduce(
    (acc, expense) => acc + expense.amount,
    0,
  )

  const daysInCurrentMonth = dayjs().daysInMonth()
  const daysInPreviousMonth = dayjs(previousMonth).daysInMonth()

  const averagePerDay = totalExpenses / daysInCurrentMonth
  const previousAveragePerDay = previousTotalExpenses / daysInPreviousMonth

  const averagePerDayChangePercentage =
    ((averagePerDay - previousAveragePerDay) / previousAveragePerDay) * 100

  const highestExpense = expenses.reduce(
    (max, expense) => (expense.amount > max.amount ? expense : max),
    expenses[0],
  )
  const highestExpenseCategory = highestExpense.category

  const categoryTotals = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>,
  )

  const mainCategory = Object.keys(categoryTotals).reduce(
    (max, category) =>
      categoryTotals[category] > categoryTotals[max] ? category : max,
    Object.keys(categoryTotals)[0],
  )
  const mainCategoryPercentage =
    (categoryTotals[mainCategory] / totalExpenses) * 100

  const expenseChangePercentage =
    ((totalExpenses - previousTotalExpenses) / previousTotalExpenses) * 100

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Gastos</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${totalExpenses.toFixed(2)}</div>
          <p className="flex items-center text-xs text-muted-foreground">
            {expenseChangePercentage >= 0 ? (
              <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
            ) : (
              <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
            )}
            {expenseChangePercentage.toFixed(1)}% em relação ao mês anterior
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Maior Gasto</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${highestExpense.amount.toFixed(2)}
          </div>
          <p className="text-xs text-muted-foreground">
            {highestExpense.description} - {highestExpenseCategory}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Média por Dia</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${averagePerDay.toFixed(2)}</div>
          <p className="flex items-center text-xs text-muted-foreground">
            {averagePerDayChangePercentage >= 0 ? (
              <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
            ) : (
              <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
            )}
            {averagePerDayChangePercentage.toFixed(1)}% em relação ao mês
            anterior
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Categoria Principal
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {mainCategory.charAt(0).toUpperCase() + mainCategory.slice(1)}
          </div>
          <p className="text-xs text-muted-foreground">
            {mainCategoryPercentage.toFixed(2)}% dos gastos totais
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
