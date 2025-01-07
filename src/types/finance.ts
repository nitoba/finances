export type ExpenseCategory =
  | 'essentials'
  | 'leisure'
  | 'investments'
  | 'knowledge'
  | 'emergency'
export interface Expense {
  id: string
  date: string
  description: string
  amount: number
  category: ExpenseCategory
}

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
