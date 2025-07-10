'use client'

import { BarChart, Calculator, TrendingUp } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useExpenses } from '@/hooks/use-expenses'
import { useUser } from '@/hooks/use-user'
import {
  calculateBudgetUtilization,
  calculateDiscretionarySpending,
  calculateSavingsRate,
  calculateTotalIncome,
} from '@/utils/calculations'

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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* 
      Savings Rate (Taxa de Poupança):
      A taxa de poupança é a porcentagem da renda que é economizada após todas as despesas. 
      É uma métrica importante para avaliar a saúde financeira e a capacidade de poupar para o futuro.
      */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">Savings Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">{savingsRate.toFixed(2)}%</div>
          <p className="text-muted-foreground text-xs">Of total income</p>
        </CardContent>
      </Card>
      {/* 
      Gastos discricionários são despesas não essenciais, como lazer, entretenimento e hobbies. 
      Monitorar esses gastos ajuda a entender onde o dinheiro está sendo gasto além das necessidades básicas.
      */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">
            Discretionary Spending
          </CardTitle>
          <BarChart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">
            ${discretionarySpending.toFixed(2)}
          </div>
          <p className="text-muted-foreground text-xs">This month</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="font-medium text-sm">
            Budget Utilization
          </CardTitle>
          <Calculator className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="font-bold text-2xl">
            {budgetUtilization.toFixed(2)}%
          </div>
          <p className="text-muted-foreground text-xs">
            Of total monthly budget
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
