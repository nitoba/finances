'use client'

import { useState, useEffect } from 'react'
import { SalaryInput } from './salary-input'
import { Dashboard } from './dashboard'
import { ExpenseForm } from './expense-form'
import { ExpenseTable } from './expensive-table/expense-table'
import { SalaryDistribution } from '../types/finance'
import {
  calculateDistribution,
  calculateCategoryBudgets,
  calculateWeeklyTrends,
  calculateComparisonData,
  calculateBalanceProjection,
} from '../utils/calculations'
import { Button } from './ui/button'
import { PlusCircle } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import { cn } from '../lib/utils'
import { MonthSelector } from './month-selector'
import dayjs from 'dayjs'
import { useExpenses } from '../hooks/use-expenses'
import { Skeleton } from './ui/skeleton'
import { toast } from 'sonner'
import { getSalaryAction } from '@/services/actions/user.action'
import { useServerActionQuery } from '@/hooks/server-action-hooks'
import { useQueryClient } from '@tanstack/react-query'

export function DashboardRootPage() {
  const queryClient = useQueryClient()
  const { data: expenses } = useExpenses()
  const { data: salary, isLoading: isGettingSalary } = useServerActionQuery(
    getSalaryAction,
    {
      queryKey: ['salary'],
      input: undefined,
    },
  )
  const [distribution, setDistribution] = useState<SalaryDistribution | null>(
    null,
  )

  const [selectedMonth, setSelectedMonth] = useState<string>(
    new Date().toISOString().slice(0, 7),
  )

  const [expensiveFormIsOpen, setExpensiveFormIsOpen] = useState(false)

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
    <div className="min-h-screen py-8 px-4">
      <>
        <div
          className={cn('flex flex-col sm:flex-row justify-between', {
            'justify-center': !distribution,
          })}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Personal Finance Manager (70/30 Rule)
          </h1>

          {distribution && (
            <Dialog
              open={expensiveFormIsOpen}
              onOpenChange={setExpensiveFormIsOpen}
            >
              <DialogTrigger asChild>
                <Button>
                  Add Expense
                  <PlusCircle className="size-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[900px]">
                <DialogHeader>
                  <DialogTitle>New Transaction</DialogTitle>
                  <DialogDescription>
                    Fill in the transaction details below to add a new expense
                    to your financial tracking.
                  </DialogDescription>
                </DialogHeader>

                <ExpenseForm
                  onAddExpense={() => setExpensiveFormIsOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>

        {isGettingSalary ? (
          <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
            <Skeleton className="w-full h-12 rounded-lg" />
            <Skeleton className="w-3/4 h-4 rounded-md" />
            <div className="w-full space-y-4 mt-4">
              <Skeleton className="w-full h-14 rounded-lg" />
              <Skeleton className="w-32 h-10 rounded-md ml-auto" />
            </div>
          </div>
        ) : !salary && !isGettingSalary ? (
          <SalaryInput onCalculate={handleCalculate} />
        ) : null}

        {distribution && (
          <div className="space-y-8 mt-8">
            <MonthSelector
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
            />

            <Dashboard
              budgets={calculateCategoryBudgets(distribution, filteredExpenses)}
              trendData={trendData}
              comparisonData={comparisonData}
              balanceData={balanceData}
            />

            <ExpenseTable />
          </div>
        )}
      </>
    </div>
  )
}
