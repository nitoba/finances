'use client'

import dayjs from 'dayjs'
import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  TrendingDown,
  Wallet,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useServerActionQuery } from '@/hooks/server-action-hooks'
import { useExpenses } from '@/hooks/use-expenses'
import { getExpensesByMonthAction } from '@/services/actions/expenses.action'
import { LoadingExpenseCards } from './loading-expense-cards'

const previousMonth = dayjs().subtract(1, 'month').toDate().toISOString()

export function ExpenseSummary() {
  const { data: expenses } = useExpenses()
  const { data: previousExpenses = [], isLoading } = useServerActionQuery(
    getExpensesByMonthAction,
    {
      queryKey: ['previous-expenses', previousMonth],
      input: { month: previousMonth },
    }
  )

  if (!expenses || isLoading) {
    return <LoadingExpenseCards />
  }

  const totalExpenses = expenses.reduce(
    (acc, expense) => acc + expense.amount,
    0
  )
  const previousTotalExpenses = previousExpenses.reduce(
    (acc, expense) => acc + expense.amount,
    0
  )

  const daysInCurrentMonth = dayjs().daysInMonth()
  const daysInPreviousMonth = dayjs(previousMonth).daysInMonth()

  const averagePerDay = totalExpenses / daysInCurrentMonth
  const previousAveragePerDay =
    previousTotalExpenses > 0 ? previousTotalExpenses / daysInPreviousMonth : 0

  const averagePerDayChangePercentage =
    previousAveragePerDay > 0
      ? ((averagePerDay - previousAveragePerDay) / previousAveragePerDay) * 100
      : 0

  const highestExpense = expenses.reduce(
    (max, expense) => (expense.amount > max.amount ? expense : max),
    expenses[0]
  )
  const highestExpenseCategory = highestExpense.category

  const categoryTotals = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>
  )

  const mainCategory = Object.keys(categoryTotals).reduce(
    (max, category) =>
      categoryTotals[category] > categoryTotals[max] ? category : max,
    Object.keys(categoryTotals)[0]
  )
  const mainCategoryPercentage =
    totalExpenses > 0 ? (categoryTotals[mainCategory] / totalExpenses) * 100 : 0

  const expenseChangePercentage =
    previousTotalExpenses > 0
      ? ((totalExpenses - previousTotalExpenses) / previousTotalExpenses) * 100
      : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Total Gastos</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">${totalExpenses.toFixed(2)}</div>
          <p className="flex items-center text-muted-foreground text-xs">
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
          <CardTitle className="font-medium text-sm">Maior Gasto</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">
            ${highestExpense.amount.toFixed(2)}
          </div>
          <p className="text-muted-foreground text-xs">
            {highestExpense.description} - {highestExpenseCategory}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Média por Dia</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">${averagePerDay.toFixed(2)}</div>
          <p className="flex items-center text-muted-foreground text-xs">
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
          <CardTitle className="font-medium text-sm">
            Categoria Principal
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">
            {mainCategory.charAt(0).toUpperCase() + mainCategory.slice(1)}
          </div>
          <p className="text-muted-foreground text-xs">
            {mainCategoryPercentage.toFixed(2)}% dos gastos totais
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
