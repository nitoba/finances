import axios from 'axios'
import { Expense } from '../types/finance'

const api = axios.create({
  baseURL: 'https://api.example.com', // Substitua pela URL real da API
})

export const getExpenses = async (): Promise<Expense[]> => {
  const response = await api.get('/expenses')
  return response.data
}

export const createExpense = async (
  expense: Omit<Expense, 'id'>,
): Promise<Expense> => {
  const response = await api.post('/expenses', expense)
  return response.data
}

export const updateExpense = async (expense: Expense): Promise<Expense> => {
  const response = await api.put(`/expenses/${expense.id}`, expense)
  return response.data
}

export const deleteExpense = async (id: string): Promise<void> => {
  await api.delete(`/expenses/${id}`)
}

export default api
