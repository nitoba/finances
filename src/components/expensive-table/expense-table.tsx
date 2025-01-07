'use client'

import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { DataTable } from './data-table'
import { columns } from './columns'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ExpenseEditForm } from '../expense-edit-form'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import {
  useExpenses,
  useUpdateExpense,
  useDeleteExpense,
} from '@/hooks/use-expenses'
import { Expense } from '@/types/finance'

export function ExpenseTable() {
  const { data: expenses = [], isLoading, error } = useExpenses()
  const updateExpenseMutation = useUpdateExpense()
  const deleteExpenseMutation = useDeleteExpense()

  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleEdit = (expense: Expense) => {
    setSelectedExpense(expense)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (expense: Expense) => {
    setSelectedExpense(expense)
    setIsDeleteDialogOpen(true)
  }

  const handleUpdateExpense = (updatedExpense: Expense) => {
    updateExpenseMutation.mutate(updatedExpense, {
      onSuccess: () => {
        setIsEditDialogOpen(false)
        toast('Expense updated', {
          description: 'The expense has been successfully updated.',
        })
      },
    })
  }

  const handleConfirmDelete = () => {
    if (selectedExpense) {
      deleteExpenseMutation.mutate(selectedExpense.id, {
        onSuccess: () => {
          setIsDeleteDialogOpen(false)
          toast('Expense deleted', {
            description: 'The expense has been successfully deleted.',
          })
        },
      })
    }
  }

  const columnsWithActions = useMemo(
    () => [
      ...columns,
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                  <span>Edit</span>
                  <Pencil className="h-4 w-4" />
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => handleDelete(row.original)}>
                  <span>Remove</span>
                  <Trash2 className="h-4 w-4 text-red-500" />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        },
      },
    ],
    [],
  )

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading expenses</div>

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      <h2 className="text-2xl font-bold p-6 bg-gray-50 text-gray-800">
        Expense Records
      </h2>
      <DataTable columns={columnsWithActions} data={expenses} />

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Expense</DialogTitle>
            <DialogDescription>
              Make changes to your expense here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          {selectedExpense && (
            <ExpenseEditForm
              expense={selectedExpense}
              onSave={handleUpdateExpense}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this expense? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
