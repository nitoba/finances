import type { ExpenseCategory } from '@/schemas/category.schema'

export interface CategoryBudget {
  category: ExpenseCategory
  planned: number
  spent: number
  percentage: number
}

export interface SalaryDistribution {
  essentials: number
  leisure: number
  investments: number
  knowledge: number
  emergency: number
}
