import { useQueryClient } from '@tanstack/react-query'

import { toast } from 'sonner'
import {
  createNewExpenseAction,
  deleteExpenseAction,
  getExpensesFromUserAction,
  updateExpenseAction,
} from '@/services/actions/expenses.action'
import {
  useServerActionMutation,
  useServerActionQuery,
} from './server-action-hooks'

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
    onError: (_error) => {
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
    onError: (_error) => {
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
    onError: (_error) => {
      toast.error('Erro ao excluir despesa')
    },
  })
}
