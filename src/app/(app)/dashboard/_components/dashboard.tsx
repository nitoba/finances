'use client'

import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'

import { toast } from 'sonner'
import { useServerActionQuery } from '@/hooks/server-action-hooks'
import { useExpenses } from '@/hooks/use-expenses'
import { cn } from '@/lib/utils'
import { getSalaryAction } from '@/services/actions/user.action'
import type { SalaryDistribution } from '@/types/finance'
import {
  calculateBalanceProjection,
  calculateCategoryBudgets,
  calculateComparisonData,
  calculateDistribution,
  calculateWeeklyTrends,
} from '@/utils/calculations'
import { AddExpenseDialog } from '../../../../components/add-expense-dialog'
import { DashboardBlocks } from './dashboard-blocks'
import { LoadingDashboard } from './loading-dashboard'
import { MonthSelector } from './month-selector'

export function Dashboard() {
  const queryClient = useQueryClient()
  const { data: expenses, isLoading: isGettingExpenses } = useExpenses()
  const [distribution, setDistribution] = useState<SalaryDistribution | null>(
    null
  )

  const { data: salary, isLoading: isGettingSalary } = useServerActionQuery(
    getSalaryAction,
    {
      queryKey: ['salary'],
      input: undefined,
    }
  )

  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7)
  )

  useEffect(() => {
    // Function to reset expenses at the start of a new month
    const resetMonthlyExpenses = () => {
      // Check if expenses exist and if the last expense is from the previous month
      if (expenses && expenses.length > 0) {
        const currentMonth = new Date().getMonth()
        const lastExpenseMonth = expenses.length
          ? new Date(expenses[0].date).getMonth()
          : currentMonth
        if (currentMonth !== lastExpenseMonth) {
          // Reset expenses for the new month
          // You can implement this logic here
        }
      }
    }
    resetMonthlyExpenses()
  }, [expenses])

  const handleCalculate = (salaryValue: number) => {
    try {
      setDistribution(calculateDistribution(salaryValue))
      queryClient.setQueryData(['salary'], salaryValue)
    } catch (_error) {
      toast.error('Failed to save salary')
    }
  }

  useEffect(() => {
    if (salary) {
      handleCalculate(salary)
    } else {
      setDistribution(null)
    }
  }, [salary, handleCalculate])

  const filteredExpenses =
    expenses?.filter(
      (expense) =>
        dayjs(expense.date).get('month') === dayjs(selectedMonth).get('month')
    ) ?? []

  const trendData = calculateWeeklyTrends(filteredExpenses)
  const comparisonData = distribution
    ? calculateComparisonData(
        calculateCategoryBudgets(distribution, filteredExpenses)
      )
    : []
  const balanceData =
    distribution && salary
      ? calculateBalanceProjection(salary, filteredExpenses)
      : []

  return (
    <div className="min-h-screen py-8 sm:px-4">
      <div
        className={cn('flex flex-col justify-between sm:flex-row', {
          'justify-center': !distribution,
        })}
      >
        <h1 className="mb-8 font-bold text-3xl text-gray-900">
          Personal Finance Manager (70/30 Rule)
        </h1>

        {distribution && <AddExpenseDialog className="w-full sm:w-auto" />}
      </div>

      <div className="mt-8 space-y-8">
        {isGettingExpenses || isGettingSalary || !distribution ? (
          <LoadingDashboard />
        ) : (
          <>
            <MonthSelector
              onMonthChange={setSelectedMonth}
              selectedMonth={selectedMonth}
            />
            <DashboardBlocks
              balanceData={balanceData}
              budgets={calculateCategoryBudgets(distribution, filteredExpenses)}
              comparisonData={comparisonData}
              trendData={trendData}
            />
          </>
        )}
      </div>
    </div>
  )
}
