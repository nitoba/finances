'use client'

import { useState, useEffect } from 'react'

import { MonthSelector } from './month-selector'
import dayjs from 'dayjs'

import { toast } from 'sonner'
import { getSalaryAction } from '@/services/actions/user.action'
import { useServerActionQuery } from '@/hooks/server-action-hooks'
import { useQueryClient } from '@tanstack/react-query'
import { LoadingDashboard } from './loading-dashboard'
import { useExpenses } from '@/hooks/use-expenses'
import { SalaryDistribution } from '@/types/finance'
import {
  calculateBalanceProjection,
  calculateCategoryBudgets,
  calculateComparisonData,
  calculateDistribution,
  calculateWeeklyTrends,
} from '@/utils/calculations'
import { cn } from '@/lib/utils'
import { DashboardBlocks } from './dashboard-blocks'
import { AddExpenseDialog } from '../../../../components/add-expense-dialog'

export function Dashboard() {
  const queryClient = useQueryClient()
  const { data: expenses, isLoading: isGettingExpenses } = useExpenses()
  const [distribution, setDistribution] = useState<SalaryDistribution | null>(
    null,
  )

  const { data: salary, isLoading: isGettingSalary } = useServerActionQuery(
    getSalaryAction,
    {
      queryKey: ['salary'],
      input: undefined,
    },
  )

  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7),
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

  useEffect(() => {
    if (salary) {
      handleCalculate(salary)
    } else {
      setDistribution(null)
    }
  }, [salary])

  const handleCalculate = async (salary: number) => {
    try {
      setDistribution(calculateDistribution(salary))
      queryClient.setQueryData(['salary'], salary)
    } catch (error) {
      toast.error('Failed to save salary')
    }
  }

  const filteredExpenses =
    expenses?.filter(
      (expense) =>
        dayjs(expense.date).get('month') === dayjs(selectedMonth).get('month'),
    ) ?? []

  const trendData = calculateWeeklyTrends(filteredExpenses)
  const comparisonData = distribution
    ? calculateComparisonData(
        calculateCategoryBudgets(distribution, filteredExpenses),
      )
    : []
  const balanceData =
    distribution && salary
      ? calculateBalanceProjection(salary, filteredExpenses)
      : []

  return (
    <div className="min-h-screen py-8 sm:px-4">
      <>
        <div
          className={cn('flex flex-col sm:flex-row justify-between', {
            'justify-center': !distribution,
          })}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Personal Finance Manager (70/30 Rule)
          </h1>

          {distribution && <AddExpenseDialog className="w-full sm:w-auto" />}
        </div>

        <div className="space-y-8 mt-8">
          {isGettingExpenses || isGettingSalary || !distribution ? (
            <LoadingDashboard />
          ) : (
            <>
              <MonthSelector
                selectedMonth={selectedMonth}
                onMonthChange={setSelectedMonth}
              />
              <DashboardBlocks
                budgets={calculateCategoryBudgets(
                  distribution,
                  filteredExpenses,
                )}
                trendData={trendData}
                comparisonData={comparisonData}
                balanceData={balanceData}
              />
            </>
          )}
        </div>
      </>
    </div>
  )
}
