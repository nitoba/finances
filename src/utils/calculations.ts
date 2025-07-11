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
  const weeklyTrends: {
    [chave: string]: { [key in ExpenseCategory]: number }
  } = {}

  for (const expense of expenses) {
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
  }

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

// Enhanced Spending Trend Analysis Functions
export interface SpendingTrendAnalysis {
  categoryTrends: Record<
    ExpenseCategory,
    {
      trend: 'increasing' | 'decreasing' | 'stable'
      changePercentage: number
      averageSpending: number
      volatility: 'high' | 'medium' | 'low'
      prediction: number
    }
  >
  overallTrend: {
    direction: 'increasing' | 'decreasing' | 'stable'
    strength: number
    confidence: number
  }
  insights: string[]
  recommendations: string[]
}

const analyzeCategoryTrend = (trend: number) => {
  if (trend > 0.1) {
    return 'increasing'
  }
  if (trend < -0.1) {
    return 'decreasing'
  }
  return 'stable'
}

const analyzeVolatility = (changePercentage: number) => {
  if (changePercentage > 30) {
    return 'high'
  }
  if (changePercentage > 15) {
    return 'medium'
  }
  return 'low'
}

const analyzeOverallDirection = (spendingTrend: number) => {
  if (spendingTrend > 0.1) {
    return 'increasing'
  }
  if (spendingTrend < -0.1) {
    return 'decreasing'
  }
  return 'stable'
}

export const calculateSpendingTrendAnalysis = (
  expenses: Expense[],
  months = 3
): SpendingTrendAnalysis => {
  const patterns = calculateHistoricalSpendingPatterns(expenses, months)
  const categoryTrends: Record<
    ExpenseCategory,
    {
      trend: 'increasing' | 'decreasing' | 'stable'
      changePercentage: number
      averageSpending: number
      volatility: 'high' | 'medium' | 'low'
      prediction: number
    }
  > = {} as Record<
    ExpenseCategory,
    {
      trend: 'increasing' | 'decreasing' | 'stable'
      changePercentage: number
      averageSpending: number
      volatility: 'high' | 'medium' | 'low'
      prediction: number
    }
  >
  const insights: string[] = []
  const recommendations: string[] = []

  // Analyze each category
  for (const [category, pattern] of Object.entries(patterns.categoryPatterns)) {
    const trend = analyzeCategoryTrend(pattern.trend)
    const changePercentage = Math.abs(pattern.trend) * 100
    const volatility = analyzeVolatility(changePercentage)

    // Simple prediction: current average + trend
    const prediction = pattern.average + pattern.trend * 4 // 4 weeks ahead

    categoryTrends[category as ExpenseCategory] = {
      trend,
      changePercentage: Math.round(changePercentage * 100) / 100,
      averageSpending: Math.round(pattern.average * 100) / 100,
      volatility,
      prediction: Math.round(prediction * 100) / 100,
    }

    // Generate insights
    if (trend === 'increasing' && changePercentage > 20) {
      insights.push(
        `${category} spending is increasing rapidly (+${changePercentage.toFixed(1)}%)`
      )
      recommendations.push(
        `Consider reviewing your ${category} budget and identifying areas to reduce spending`
      )
    }

    if (volatility === 'high') {
      insights.push(`${category} spending shows high volatility`)
      recommendations.push(
        `Try to establish more consistent spending patterns for ${category}`
      )
    }
  }

  // Overall trend analysis
  const overallDirection = analyzeOverallDirection(patterns.spendingTrend)
  const strength = Math.abs(patterns.spendingTrend)
  const confidence = Math.max(
    0,
    100 - (patterns.spendingVariance / patterns.averageWeeklySpending) * 100
  )

  // Add overall insights
  if (overallDirection === 'increasing') {
    insights.push('Overall spending trend is increasing')
    recommendations.push(
      'Review your budget and identify areas for cost reduction'
    )
  } else if (overallDirection === 'decreasing') {
    insights.push('Overall spending trend is decreasing - great progress!')
  }

  if (confidence < 70) {
    insights.push('Spending patterns show high variability')
    recommendations.push('Focus on creating more consistent spending habits')
  }

  return {
    categoryTrends,
    overallTrend: {
      direction: overallDirection,
      strength: Math.round(strength * 100) / 100,
      confidence: Math.round(confidence * 100) / 100,
    },
    insights,
    recommendations,
  }
}

export interface MonthlyComparison {
  currentMonth: {
    total: number
    byCategory: Record<ExpenseCategory, number>
  }
  previousMonth: {
    total: number
    byCategory: Record<ExpenseCategory, number>
  }
  changes: {
    totalChange: number
    totalChangePercentage: number
    categoryChanges: Record<
      ExpenseCategory,
      {
        change: number
        changePercentage: number
      }
    >
  }
}

export const calculateMonthlyComparison = (
  expenses: Expense[]
): MonthlyComparison => {
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear

  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    )
  })

  const previousMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date)
    return (
      expenseDate.getMonth() === previousMonth &&
      expenseDate.getFullYear() === previousYear
    )
  })

  const categories: ExpenseCategory[] = [
    'essentials',
    'leisure',
    'investments',
    'knowledge',
    'emergency',
  ]

  const currentByCategory = {} as Record<ExpenseCategory, number>
  const previousByCategory = {} as Record<ExpenseCategory, number>

  for (const category of categories) {
    currentByCategory[category] = currentMonthExpenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0)

    previousByCategory[category] = previousMonthExpenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0)
  }

  const currentTotal = Object.values(currentByCategory).reduce(
    (sum, amount) => sum + amount,
    0
  )
  const previousTotal = Object.values(previousByCategory).reduce(
    (sum, amount) => sum + amount,
    0
  )

  const totalChange = currentTotal - previousTotal
  const totalChangePercentage =
    previousTotal > 0 ? (totalChange / previousTotal) * 100 : 0

  const categoryChanges = {} as Record<
    ExpenseCategory,
    { change: number; changePercentage: number }
  >

  for (const category of categories) {
    const change = currentByCategory[category] - previousByCategory[category]
    const changePercentage =
      previousByCategory[category] > 0
        ? (change / previousByCategory[category]) * 100
        : 0

    categoryChanges[category] = {
      change: Math.round(change * 100) / 100,
      changePercentage: Math.round(changePercentage * 100) / 100,
    }
  }

  return {
    currentMonth: {
      total: Math.round(currentTotal * 100) / 100,
      byCategory: currentByCategory,
    },
    previousMonth: {
      total: Math.round(previousTotal * 100) / 100,
      byCategory: previousByCategory,
    },
    changes: {
      totalChange: Math.round(totalChange * 100) / 100,
      totalChangePercentage: Math.round(totalChangePercentage * 100) / 100,
      categoryChanges,
    },
  }
}

export const calculateMovingAverages = (
  expenses: Expense[],
  periods = [7, 14, 30]
): Record<number, { name: string; [key: string]: number | string }[]> => {
  const result: Record<
    number,
    { name: string; [key: string]: number | string }[]
  > = {}

  for (const period of periods) {
    const movingAverages: { name: string; [key: string]: number | string }[] =
      []
    const now = new Date()

    for (let i = 0; i < 12; i++) {
      // Last 12 periods
      const endDate = new Date(now)
      endDate.setDate(endDate.getDate() - i * period)
      const startDate = new Date(endDate)
      startDate.setDate(startDate.getDate() - period + 1)

      const periodExpenses = expenses.filter((expense) => {
        const expenseDate = new Date(expense.date)
        return expenseDate >= startDate && expenseDate <= endDate
      })

      const categories: ExpenseCategory[] = [
        'essentials',
        'leisure',
        'investments',
        'knowledge',
        'emergency',
      ]
      const categoryTotals: Record<string, number> = {}

      for (const category of categories) {
        categoryTotals[category] = periodExpenses
          .filter((expense) => expense.category === category)
          .reduce((sum, expense) => sum + expense.amount, 0)
      }

      let periodName: string
      if (period === 7) {
        periodName = `${12 - i}W`
      } else if (period === 14) {
        periodName = `${12 - i}B`
      } else {
        periodName = `${12 - i}M`
      }

      movingAverages.unshift({
        name: periodName,
        ...categoryTotals,
      })
    }

    result[period] = movingAverages
  }

  return result
}
