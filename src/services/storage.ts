import { Expense } from '../types/finance'

const EXPENSES_KEY = 'expenses'

const getStoredExpenses = (): Expense[] => {
  const expenses = localStorage.getItem(EXPENSES_KEY)
  return expenses ? JSON.parse(expenses) : []
}

const setStoredExpenses = (expenses: Expense[]) => {
  localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses))
}

const setStoredSalary = (salary: number) => {
  localStorage.setItem('salary', String(salary))
}

export const getExpenses = async (): Promise<Expense[]> => {
  return getStoredExpenses()
}

export const createExpense = async (
  expense: Omit<Expense, 'id'>,
): Promise<Expense> => {
  const expenses = getStoredExpenses()
  const newExpense = { ...expense, id: String(Date.now()) }
  expenses.push(newExpense)
  setStoredExpenses(expenses)
  return newExpense
}

export const updateExpense = async (expense: Expense): Promise<Expense> => {
  let expenses = getStoredExpenses()
  expenses = expenses.map((e) => (e.id === expense.id ? expense : e))
  setStoredExpenses(expenses)
  return expense
}

export const deleteExpense = async (id: string): Promise<void> => {
  let expenses = getStoredExpenses()
  expenses = expenses.filter((e) => e.id !== id)
  setStoredExpenses(expenses)
}

export const getSalary = async (): Promise<number> => {
  const salary = localStorage.getItem('salary')
  return salary ? Number(salary) : 0
}

export const saveSalary = async (salary: number): Promise<void> => {
  setStoredSalary(salary)
}
