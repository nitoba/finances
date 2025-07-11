'use client'

import { useMemo } from 'react'
import type { CategoryBudget } from '@/types/finance'

interface UseChartDataOptions {
  enableAnimations?: boolean
  theme?: 'light' | 'dark'
}

export function useChartData(data: any[], options: UseChartDataOptions = {}) {
  const { enableAnimations = true, theme = 'light' } = options

  const memoizedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) {
      return []
    }

    return data.map((item, index) => ({
      ...item,
      // Add animation delay for staggered effects
      animationDelay: enableAnimations ? index * 100 : 0,
    }))
  }, [data, enableAnimations])

  const chartColors = useMemo(() => {
    const colors = {
      light: {
        essentials: 'hsl(217, 91%, 60%)',
        leisure: 'hsl(142, 71%, 45%)',
        investments: 'hsl(262, 83%, 58%)',
        knowledge: 'hsl(25, 95%, 53%)',
        emergency: 'hsl(346, 87%, 43%)',
        grid: 'hsl(var(--muted-foreground))',
        text: 'hsl(var(--foreground))',
        background: 'hsl(var(--background))',
      },
      dark: {
        essentials: 'hsl(217, 91%, 70%)',
        leisure: 'hsl(142, 71%, 55%)',
        investments: 'hsl(262, 83%, 68%)',
        knowledge: 'hsl(25, 95%, 63%)',
        emergency: 'hsl(346, 87%, 53%)',
        grid: 'hsl(var(--muted-foreground))',
        text: 'hsl(var(--foreground))',
        background: 'hsl(var(--background))',
      },
    }

    return colors[theme]
  }, [theme])

  const isEmpty = useMemo(() => {
    return !memoizedData || memoizedData.length === 0
  }, [memoizedData])

  const hasValidData = useMemo(() => {
    if (isEmpty) return false

    return memoizedData.some((item) => {
      if (typeof item === 'object' && item !== null) {
        return Object.values(item).some(
          (value) => typeof value === 'number' && !isNaN(value) && value !== 0
        )
      }
      return false
    })
  }, [memoizedData, isEmpty])

  return {
    data: memoizedData,
    chartColors,
    isEmpty,
    hasValidData,
    dataLength: memoizedData.length,
  }
}

export function useBudgetChartData(budgets: CategoryBudget[]) {
  return useMemo(() => {
    if (!budgets || budgets.length === 0) {
      return {
        pieData: [],
        barData: [],
        totalSpent: 0,
        totalPlanned: 0,
        utilizationRate: 0,
      }
    }

    const totalSpent = budgets.reduce((sum, budget) => sum + budget.spent, 0)
    const totalPlanned = budgets.reduce(
      (sum, budget) => sum + budget.planned,
      0
    )
    const utilizationRate =
      totalPlanned > 0 ? (totalSpent / totalPlanned) * 100 : 0

    const pieData = budgets.map((budget) => ({
      name: budget.category,
      value: budget.spent,
      percentage: totalSpent > 0 ? (budget.spent / totalSpent) * 100 : 0,
      planned: budget.planned,
      utilization:
        budget.planned > 0 ? (budget.spent / budget.planned) * 100 : 0,
    }))

    const barData = budgets.map((budget) => ({
      category: budget.category,
      planned: budget.planned,
      spent: budget.spent,
      utilization:
        budget.planned > 0 ? (budget.spent / budget.planned) * 100 : 0,
      isOverBudget: budget.spent > budget.planned,
    }))

    return {
      pieData,
      barData,
      totalSpent,
      totalPlanned,
      utilizationRate,
    }
  }, [budgets])
}

export function useBalanceChartData(
  balanceData: {
    name: string
    balance: number
    projected?: boolean
    confidence?: number
  }[]
) {
  return useMemo(() => {
    if (!balanceData || balanceData.length === 0) {
      return {
        data: [],
        trend: 0,
        currentBalance: 0,
        projectedWeeks: 0,
        averageWeeklyChange: 0,
      }
    }

    const trend =
      balanceData.length >= 2
        ? ((balanceData[balanceData.length - 1].balance -
            balanceData[0].balance) /
            balanceData[0].balance) *
          100
        : 0

    const currentBalance = balanceData[balanceData.length - 1]?.balance || 0
    const projectedWeeks = balanceData.filter((item) => item.projected).length

    // Calculate average weekly change
    const changes = []
    for (let i = 1; i < balanceData.length; i++) {
      changes.push(balanceData[i].balance - balanceData[i - 1].balance)
    }
    const averageWeeklyChange =
      changes.length > 0
        ? changes.reduce((sum, change) => sum + change, 0) / changes.length
        : 0

    return {
      data: balanceData,
      trend,
      currentBalance,
      projectedWeeks,
      averageWeeklyChange,
    }
  }, [balanceData])
}
