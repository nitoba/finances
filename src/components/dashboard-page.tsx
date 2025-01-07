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
import { Toaster } from '@/components/ui/sonner'
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
import { getSalary, saveSalary } from '../services/storage'

export function DashboardPage() {
  const [salary, setSalary] = useState<number>(0)
  const [distribution, setDistribution] = useState<SalaryDistribution | null>(
    null,
  )

  const { data: expenses } = useExpenses()

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
    getSalary().then((res) => {
      if (res !== 0) {
        setSalary(res)
        handleCalculate(res)
      }
    })
  }, [])

  const handleCalculate = (salary: number) => {
    setDistribution(calculateDistribution(salary))
    saveSalary(+salary)
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
  const balanceData = distribution
    ? calculateBalanceProjection(salary, filteredExpenses)
    : []

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          className={cn('flex justify-between', {
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

        {!distribution && !salary && (
          <SalaryInput onCalculate={handleCalculate} />
        )}

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
      </div>
      <Toaster richColors />
    </div>
  )
}
