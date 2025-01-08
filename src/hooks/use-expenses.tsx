import { useQueryClient } from '@tanstack/react-query'

import { toast } from 'sonner'
import {
  useServerActionMutation,
  useServerActionQuery,
} from './server-action-hooks'
import {
  createNewExpenseAction,
  deleteExpenseAction,
  getExpensesFromUserAction,
  updateExpenseAction,
} from '@/services/actions/expenses.action'

export const useExpenses = () => {
  return useServerActionQuery(getExpensesFromUserAction, {
    queryKey: ['expenses'],
    input: undefined,
  })
}

export const useCreateExpense = () => {
  const queryClient = useQueryClient()
  return useServerActionMutation(createNewExpenseAction, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      toast.success('Despesa criada com sucesso')
    },
    onError: (error) => {
      console.error('Erro ao criar despesa:', error)
      toast.error('Erro ao criar despesa')
    },
  })
}

export const useUpdateExpense = () => {
  const queryClient = useQueryClient()
  return useServerActionMutation(updateExpenseAction, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      toast.success('Despesa atualizada com sucesso')
    },
    onError: (error) => {
      console.error('Erro ao atualizar despesa:', error)
      toast.error('Erro ao atualizar despesa')
    },
  })
}

export const useDeleteExpense = () => {
  const queryClient = useQueryClient()
  return useServerActionMutation(deleteExpenseAction, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      toast.success('Despesa excluída com sucesso')
    },
    onError: (error) => {
      console.error('Erro ao excluir despesa:', error)
      toast.error('Erro ao excluir despesa')
    },
  })
}
