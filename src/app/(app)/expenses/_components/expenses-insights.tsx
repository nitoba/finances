'use client'
import dayjs from 'dayjs'
import { ArrowUpRight, Banknote, CreditCard, PieChart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useServerActionQuery } from '@/hooks/server-action-hooks'
import { useExpenses } from '@/hooks/use-expenses'
import { useUser } from '@/hooks/use-user'
import type { Expense } from '@/schemas/expense.schema'
import { getExpensesByMonthAction } from '@/services/actions/expenses.action'
import { LoadingExpenseCards } from './loading-expense-cards'

const previousMonth = dayjs().subtract(1, 'month').toDate().toISOString()

type InsightItem = {
  title: string
  value?: string
  amount: string
  icon: React.ElementType
  details?: { category: string; average: number }[]
}

export function ExpenseInsights() {
  const { user } = useUser()
  const { data: expenses } = useExpenses()
  const { data: previousExpenses = [], isLoading } = useServerActionQuery(
    getExpensesByMonthAction,
    {
      queryKey: ['previous-expenses', previousMonth],
      input: { month: previousMonth },
    }
  )

  if (!(user && expenses) || isLoading) {
    return <LoadingExpenseCards />
  }

  // Gasto Recorrente Mais Alto
  const recurringExpenses = expenses.filter((expense) => expense.isRecurring)

  let highestRecurringExpense: Partial<Expense> | null = null
  if (recurringExpenses.length > 0) {
    highestRecurringExpense = recurringExpenses.reduce(
      (max, expense) => (expense.amount > max.amount ? expense : max),
      recurringExpenses[0]
    )
  } else {
    highestRecurringExpense = {
      description: 'Sem despesa recorrente',
      amount: 0,
    }
  }

  // Categoria com Maior Variação
  const categoryTotals = expenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>
  )

  const previousCategoryTotals = previousExpenses.reduce(
    (acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    },
    {} as Record<string, number>
  )

  const categoryWithHighestVariation = Object.keys(categoryTotals).reduce(
    (max, category) => {
      const variation =
        (categoryTotals[category] - (previousCategoryTotals[category] || 0)) /
        (previousCategoryTotals[category] || 1)
      return variation > max.variation ? { category, variation } : max
    },
    { category: '', variation: 0 }
  )

  // Transação Mais Frequente
  const transactionFrequency = expenses.reduce(
    (acc, expense) => {
      acc[expense.description.toLowerCase()] =
        (acc[expense.description.toLowerCase()] || 0) + 1
      return acc
    },
    {} as Record<string, number>
  )
  const mostFrequentTransaction = Object.keys(transactionFrequency).reduce(
    (max, description) =>
      transactionFrequency[description] > transactionFrequency[max]
        ? description
        : max,
    Object.keys(transactionFrequency)[0]
  )

  // Gasto Médio por Categoria
  const averageSpendingPerCategory = Object.keys(categoryTotals).map(
    (category) => {
      const total = categoryTotals[category]
      const count = expenses.filter(
        (expense) => expense.category === category
      ).length
      return { category, average: total / count }
    }
  )

  const insightsData: InsightItem[] = [
    {
      title: 'Gasto Recorrente Mais Alto',
      value: highestRecurringExpense.description,
      amount: `$${highestRecurringExpense.amount?.toFixed(2)}`,
      icon: Banknote,
    },
    {
      title: 'Categoria com Maior Variação',
      value: categoryWithHighestVariation.category,
      amount: `${categoryWithHighestVariation.variation.toFixed(2)}%`,
      icon: ArrowUpRight,
    },
    {
      title: 'Transação Mais Frequente',
      value: mostFrequentTransaction,
      amount: `${transactionFrequency[mostFrequentTransaction]}x`,
      icon: CreditCard,
    },
    {
      title: 'Gasto Médio por Categoria',
      value: '',
      amount: '',
      icon: PieChart,
      details: averageSpendingPerCategory,
    },
  ]

  return (
    <div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {insightsData.map((item) => (
          <InsightCard item={item} key={item.title} />
        ))}
      </div>
    </div>
  )
}

type InsightCardProps = {
  item: InsightItem
}

function InsightCard({ item }: InsightCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-medium text-sm">{item.title}</CardTitle>
        <item.icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {item.details ? (
          <ul className="flex flex-wrap gap-2">
            {item.details.map((detail) => (
              <li
                className="flex justify-between gap-3 rounded-md bg-gray-100 p-2 text-sm"
                key={detail.category}
              >
                <span className="font-semibold text-muted-foreground">
                  {detail.category.toUpperCase()}
                </span>
                <span className="font-bold text-foreground">
                  ${detail.average.toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <div className="max-w-52 text-balance font-bold text-2xl">
              {item.value}
            </div>
            <p className="text-muted-foreground text-xs">{item.amount}</p>
          </>
        )}
      </CardContent>
    </Card>
  )
}
