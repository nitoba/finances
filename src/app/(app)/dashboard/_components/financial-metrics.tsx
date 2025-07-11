'use client'

import {
  ArrowDownIcon,
  ArrowUpIcon,
  DollarSign,
  PiggyBank,
  Target,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useExpenses } from '@/hooks/use-expenses'
import { useUser } from '@/hooks/use-user'
import {
  calculateBudgetUtilization,
  calculateDiscretionarySpending,
  calculateSavingsRate,
  calculateTotalIncome,
} from '@/utils/calculations'

interface MetricCardProps {
  title: string
  value: string
  change?: {
    value: number
    type: 'positive' | 'negative'
  }
  icon: React.ReactNode
  description: string
  gradient?: string
}

function MetricCard({
  title,
  value,
  change,
  icon,
  description,
  gradient,
}: MetricCardProps) {
  return (
    <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50/50 shadow-gray-200/40 shadow-lg dark:from-gray-900 dark:to-gray-800/50 dark:shadow-gray-900/40">
      {gradient && <div className={`absolute inset-0 opacity-5 ${gradient}`} />}
      <CardContent className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              {icon}
            </div>
            <div>
              <p className="font-medium text-muted-foreground text-sm">
                {title}
              </p>
              <p className="font-semibold text-2xl tracking-tight">{value}</p>
            </div>
          </div>
          {change && (
            <div
              className={`flex items-center gap-1 rounded-full px-2.5 py-1 font-medium text-xs ${
                change.type === 'positive'
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
              }`}
            >
              {change.type === 'positive' ? (
                <ArrowUpIcon className="h-3 w-3" />
              ) : (
                <ArrowDownIcon className="h-3 w-3" />
              )}
              {Math.abs(change.value)}%
            </div>
          )}
        </div>
        <p className="mt-3 text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  )
}

export function FinancialMetrics() {
  const { user } = useUser()
  const { data: expenses } = useExpenses()

  if (!(user && expenses)) {
    return null
  }

  const totalIncome = calculateTotalIncome(user)
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  )

  const savingsRate = calculateSavingsRate(totalIncome, totalExpenses)
  const discretionarySpending = calculateDiscretionarySpending(expenses)
  const budgetUtilization = calculateBudgetUtilization(
    totalExpenses,
    totalIncome
  )

  const metrics = [
    {
      title: 'Monthly Income',
      value: `$${totalIncome.toLocaleString()}`,
      icon: <DollarSign className="h-5 w-5" />,
      description: 'Total monthly income',
      gradient: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    },
    {
      title: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      change: { value: 5.2, type: 'positive' as const },
      icon: <PiggyBank className="h-5 w-5" />,
      description: 'Percentage of income saved',
      gradient: 'bg-gradient-to-r from-green-500 to-emerald-500',
    },
    {
      title: 'Budget Used',
      value: `${budgetUtilization.toFixed(1)}%`,
      change: { value: 2.1, type: 'negative' as const },
      icon: <Target className="h-5 w-5" />,
      description: 'Of total monthly budget',
      gradient: 'bg-gradient-to-r from-orange-500 to-red-500',
    },
    {
      title: 'Discretionary',
      value: `$${discretionarySpending.toLocaleString()}`,
      icon: <TrendingUp className="h-5 w-5" />,
      description: 'Non-essential spending',
      gradient: 'bg-gradient-to-r from-purple-500 to-pink-500',
    },
  ]

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} {...metric} />
      ))}
    </div>
  )
}
