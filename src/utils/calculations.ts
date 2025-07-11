import type { CurrentUser } from '@/hooks/use-user'
import type { ExpenseCategory } from '@/schemas/category.schema'
import type { Expense } from '@/schemas/expense.schema'
import type { CategoryBudget, SalaryDistribution } from '../types/finance'

export const calculateDistribution = (salary: number): SalaryDistribution => {
  // 70/30 Budget Rule Implementation
  // 70% for needs (split: 80% essentials, 20% leisure)
  // 30% for savings/investments (split: 10% each for investments, knowledge, emergency)

  return {
    essentials: salary * 0.56, // 56% (70% × 80%)
    leisure: salary * 0.14, // 14% (70% × 20%)
    investments: salary * 0.1, // 10%
    knowledge: salary * 0.1, // 10%
    emergency: salary * 0.1, // 10%
  }
}

export const calculateCategoryBudgets = (
  distribution: SalaryDistribution,
  expenses: Expense[]
): CategoryBudget[] => {
  const categories: ExpenseCategory[] = [
    'essentials',
    'leisure',
    'investments',
    'knowledge',
    'emergency',
  ]

  return categories.map((category) => {
    const planned = distribution[category]
    const spent = expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0)

    return {
      category,
      planned,
      spent,
      percentage: planned > 0 ? (spent / planned) * 100 : 0,
    }
  })
}

export const calculateWeeklyTrends = (expenses: Expense[]) => {
  const weeklyTrends: { [key: string]: { [key in ExpenseCategory]: number } } =
    {}

  expenses.forEach((expense) => {
    const date = new Date(expense.date)
    const month = date.toLocaleString('default', { month: 'short' })
    const weekNumber = Math.ceil(date.getDate() / 7)
    const weekKey = `${month} W${weekNumber}`

    if (!weeklyTrends[weekKey]) {
      weeklyTrends[weekKey] = {
        essentials: 0,
        leisure: 0,
        investments: 0,
        knowledge: 0,
        emergency: 0,
      }
    }
    weeklyTrends[weekKey][expense.category] += expense.amount
  })

  return Object.entries(weeklyTrends).map(([week, data]) => ({
    name: week,
    ...data,
  }))
}

export const calculateComparisonData = (
  budgets: CategoryBudget[]
): { name: string; planned: number; actual: number }[] => {
  return budgets.map((budget) => ({
    name: budget.category.charAt(0).toUpperCase() + budget.category.slice(1),
    planned: budget.planned,
    actual: budget.spent,
  }))
}

interface WeeklyPeriod {
  name: string
  startDay: number
  endDay: number
  isPast: boolean
  isCurrentWeek: boolean
  isFuture: boolean
}

interface WeeklyExpense extends WeeklyPeriod {
  actualExpenses: number
}

export const calculateBalanceProjection = (
  salary: number,
  expenses: Expense[]
): {
  name: string
  balance: number
  projected?: boolean
  confidence?: number
}[] => {
  const currentDate = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Get actual days in the current month
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()
  const currentDay = currentDate.getDate()

  // Create weekly periods based on actual calendar weeks
  const weeklyPeriods: WeeklyPeriod[] = []
  for (let day = 1; day <= daysInMonth; day += 7) {
    const weekEnd = Math.min(day + 6, daysInMonth)
    weeklyPeriods.push({
      name: `Week ${Math.ceil(day / 7)}`,
      startDay: day,
      endDay: weekEnd,
      isPast: weekEnd < currentDay,
      isCurrentWeek: day <= currentDay && currentDay <= weekEnd,
      isFuture: day > currentDay,
    })
  }

  // Calculate actual expenses for each week
  const weeklyExpenses: WeeklyExpense[] = weeklyPeriods.map((period) => {
    const periodExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      const expenseDay = expenseDate.getDate()
      return expenseDay >= period.startDay && expenseDay <= period.endDay
    })

    return {
      ...period,
      actualExpenses: periodExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      ),
    }
  })

  // Calculate average weekly spending for projection using historical data
  const pastWeeks = weeklyExpenses.filter((week) => week.isPast)
  const currentMonthAvg =
    pastWeeks.length > 0
      ? pastWeeks.reduce((sum, week) => sum + week.actualExpenses, 0) /
        pastWeeks.length
      : 0

  // Get historical spending patterns for better prediction
  const allExpenses = expenses // This would ideally be all historical expenses, not just current month
  const historicalPatterns = calculateHistoricalSpendingPatterns(allExpenses, 3)

  // Use weighted average: 60% current month, 40% historical average
  const avgWeeklySpending =
    pastWeeks.length > 0
      ? currentMonthAvg * 0.6 + historicalPatterns.averageWeeklySpending * 0.4
      : historicalPatterns.averageWeeklySpending

  // Calculate projection with confidence intervals
  let runningBalance = salary

  return weeklyExpenses.map((week, index) => {
    let weeklySpending = week.actualExpenses
    let confidence = 100
    let projected = false

    // For current week, use actual + projected remaining days
    if (week.isCurrentWeek) {
      const daysPassedInWeek = currentDay - week.startDay + 1
      const daysRemainingInWeek = week.endDay - currentDay
      const avgDailySpending = weeklySpending / daysPassedInWeek || 0

      if (daysRemainingInWeek > 0) {
        const projectedRemaining = avgDailySpending * daysRemainingInWeek
        weeklySpending += projectedRemaining
        confidence = Math.max(70, 100 - daysRemainingInWeek * 5)
        projected = true
      }
    }

    // For future weeks, use average spending pattern
    if (week.isFuture) {
      weeklySpending = avgWeeklySpending
      confidence = Math.max(50, 90 - index * 10)
      projected = true
    }

    runningBalance -= weeklySpending

    return {
      name: week.name,
      balance: Math.round(runningBalance * 100) / 100,
      projected,
      confidence: projected ? confidence : undefined,
    }
  })
}

export const calculateTotalIncome = (user: CurrentUser): number => {
  const totalIncome = user.monthlySalary || 0

  // Adicione outras fontes de renda se houver

  return totalIncome
}

export const calculateSavingsRate = (
  totalIncome: number,
  totalExpenses: number
): number => {
  if (totalIncome === 0) {
    throw new Error('Total income cannot be zero')
  }
  return ((totalIncome - totalExpenses) / totalIncome) * 100
}

export const calculateDiscretionarySpending = (expenses: Expense[]): number => {
  return expenses
    .filter(
      (expense) => expense.category === 'leisure'
      // expense.category === 'entertainment' ||
      // expense.category === 'hobbies',
    )
    .reduce((sum, expense) => sum + expense.amount, 0)
}

export const calculateBudgetUtilization = (
  totalExpenses: number,
  totalBudget: number
): number => {
  if (totalBudget === 0) {
    throw new Error('Total budget cannot be zero')
  }
  return (totalExpenses / totalBudget) * 100
}

export const calculateHistoricalSpendingPatterns = (
  expenses: Expense[],
  months = 3
): {
  averageWeeklySpending: number
  spendingTrend: number
  spendingVariance: number
  categoryPatterns: Record<ExpenseCategory, { average: number; trend: number }>
} => {
  if (expenses.length === 0) {
    return {
      averageWeeklySpending: 0,
      spendingTrend: 0,
      spendingVariance: 0,
      categoryPatterns: {} as Record<
        ExpenseCategory,
        { average: number; trend: number }
      >,
    }
  }

  const now = new Date()
  const monthsAgo = new Date(now.getFullYear(), now.getMonth() - months, 1)

  // Filter expenses from the last N months
  const recentExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return expenseDate >= monthsAgo
  })

  // Group expenses by week
  const weeklyTotals: number[] = []
  const categoryWeeklyTotals: Record<ExpenseCategory, number[]> = {
    essentials: [],
    leisure: [],
    investments: [],
    knowledge: [],
    emergency: [],
  }

  // Calculate weekly spending over the historical period
  for (let week = 0; week < months * 4; week++) {
    const weekStart = new Date(monthsAgo)
    weekStart.setDate(weekStart.getDate() + week * 7)
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)

    const weekExpenses = recentExpenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return expenseDate >= weekStart && expenseDate <= weekEnd
    })

    const weekTotal = weekExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    )
    weeklyTotals.push(weekTotal)

    // Calculate category totals for this week
    for (const category of Object.keys(categoryWeeklyTotals)) {
      const categoryExpenses = weekExpenses.filter(
        (expense) => expense.category === category
      )
      const categoryTotal = categoryExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      )
      categoryWeeklyTotals[category as ExpenseCategory].push(categoryTotal)
    }
  }

  // Calculate statistics
  const averageWeeklySpending =
    weeklyTotals.reduce((sum, total) => sum + total, 0) / weeklyTotals.length

  // Calculate spending trend (linear regression slope)
  const spendingTrend = calculateLinearTrend(weeklyTotals)

  // Calculate variance (measure of spending consistency)
  const variance =
    weeklyTotals.reduce((sum, total) => {
      return sum + (total - averageWeeklySpending) ** 2
    }, 0) / weeklyTotals.length
  const spendingVariance = Math.sqrt(variance)

  // Calculate category patterns
  const categoryPatterns = {} as Record<
    ExpenseCategory,
    { average: number; trend: number }
  >

  for (const [category, totals] of Object.entries(categoryWeeklyTotals)) {
    const categoryAverage =
      totals.reduce((sum, total) => sum + total, 0) / totals.length
    const categoryTrend = calculateLinearTrend(totals)
    categoryPatterns[category as ExpenseCategory] = {
      average: categoryAverage,
      trend: categoryTrend,
    }
  }

  return {
    averageWeeklySpending,
    spendingTrend,
    spendingVariance,
    categoryPatterns,
  }
}

const calculateLinearTrend = (values: number[]): number => {
  if (values.length < 2) {
    return 0
  }

  const n = values.length
  const xSum = ((n - 1) * n) / 2 // Sum of indices 0, 1, 2, ..., n-1
  const ySum = values.reduce((sum, value) => sum + value, 0)
  const xySum = values.reduce((sum, value, index) => sum + value * index, 0)
  const xSquaredSum = values.reduce((sum, _, index) => sum + index * index, 0)

  // Linear regression: y = mx + b, we want slope (m)
  const slope = (n * xySum - xSum * ySum) / (n * xSquaredSum - xSum * xSum)

  return slope || 0
}
