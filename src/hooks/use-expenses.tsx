import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from '../services/storage'
import { toast } from 'sonner'

export const useExpenses = () => {
  return useQuery({ queryKey: ['expenses'], queryFn: getExpenses })
}

export const useCreateExpense = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createExpense,
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
  return useMutation({
    mutationFn: updateExpense,
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
  return useMutation({
    mutationFn: deleteExpense,
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
