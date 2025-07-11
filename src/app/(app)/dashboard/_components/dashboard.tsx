'use client'

import { useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useCallback, useEffect, useState } from 'react'

import { toast } from 'sonner'
import { useServerActionQuery } from '@/hooks/server-action-hooks'
import { useExpenses } from '@/hooks/use-expenses'
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
import { QuickActions } from '../../../../components/quick-actions'
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

  const handleCalculate = useCallback(
    (salaryValue: number) => {
      try {
        setDistribution(calculateDistribution(salaryValue))
        queryClient.setQueryData(['salary'], salaryValue)
      } catch (_error) {
        toast.error('Failed to save salary')
      }
    },
    [queryClient]
  )

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
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="font-semibold text-3xl tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Track your finances with the 70/30 budgeting rule
          </p>
        </div>
        {distribution && (
          <div className="flex items-center gap-3">
            <MonthSelector
              onMonthChange={setSelectedMonth}
              selectedMonth={selectedMonth}
            />
            <AddExpenseDialog />
          </div>
        )}
      </div>

      {/* Main Content */}
      {isGettingExpenses || isGettingSalary || !distribution ? (
        <LoadingDashboard />
      ) : (
        <DashboardBlocks
          balanceData={balanceData}
          budgets={calculateCategoryBudgets(distribution, filteredExpenses)}
          comparisonData={comparisonData}
          onAdjustBudget={(_category, _amount) => {
            // TODO: Implement actual budget adjustment logic
          }}
          trendData={trendData}
        />
      )}

      {/* Quick Actions */}
      {distribution && (
        <QuickActions
          onAddExpense={() => {
            // Handle expense addition - could invalidate queries
            queryClient.invalidateQueries({ queryKey: ['expenses'] })
          }}
          onBudgetSettings={() => {
            // Navigate to budget settings or open modal
          }}
          onGenerateReport={() => {
            // Generate and download report
          }}
        />
      )}
    </div>
  )
}
