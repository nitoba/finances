import { Expense } from '@/schemas/expense.schema'
import { CategoryBudget, SalaryDistribution } from '../types/finance'
import { ExpenseCategory } from '@/schemas/category.schema'

export const calculateDistribution = (salary: number): SalaryDistribution => {
  const essentialsTotal = salary * 0.7

  return {
    essentials: essentialsTotal, // 80% of 70%
    leisure: essentialsTotal * 0.2, // 20% of 70%
    investments: salary * 0.1,
    knowledge: salary * 0.1,
    emergency: salary * 0.1,
  }
}

export const calculateCategoryBudgets = (
  distribution: SalaryDistribution,
  expenses: Expense[],
): CategoryBudget[] => {
  const categories: ExpenseCategory[] = [
    'essentials',
    'leisure',
    'investments',
    'knowledge',
    'emergency',
  ]

  return categories.map((category) => {
    const planned =
      category === 'essentials'
        ? distribution.essentials
        : category === 'leisure'
          ? distribution.leisure
          : category === 'investments'
            ? distribution.investments
            : category === 'knowledge'
              ? distribution.knowledge
              : distribution.emergency

    const spent = expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0)

    return {
      category,
      planned,
      spent,
      percentage: (spent / planned) * 100,
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
  budgets: CategoryBudget[],
): { name: string; planned: number; actual: number }[] => {
  return budgets.map((budget) => ({
    name: budget.category.charAt(0).toUpperCase() + budget.category.slice(1),
    planned: budget.planned,
    actual: budget.spent,
  }))
}

export const calculateBalanceProjection = (
  salary: number,
  expenses: Expense[],
): { name: string; balance: number }[] => {
  const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4']
  const weeklyExpenses = Array(4).fill(0)

  expenses.forEach((expense) => {
    const week = Math.floor(new Date(expense.date).getDate() / 7)
    weeklyExpenses[week] += expense.amount
  })

  let remainingBalance = salary
  return weeks.map((week, index) => {
    remainingBalance -= weeklyExpenses[index]
    return { name: week, balance: remainingBalance }
  })
}
