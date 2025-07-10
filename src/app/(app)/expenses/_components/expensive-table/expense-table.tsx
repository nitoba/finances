'use client'

import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  useDeleteExpense,
  useExpenses,
  useUpdateExpense,
} from '@/hooks/use-expenses'
import type { Expense } from '@/schemas/expense.schema'
import { ExpenseEditForm } from '../expense-edit-form'
import { columns } from './columns'
import { DataTable } from './data-table'
import { TableLoading } from './table-loading'

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
      deleteExpenseMutation.mutate(
        { id: selectedExpense.id },
        {
          onSuccess: () => {
            setIsDeleteDialogOpen(false)
            toast('Expense deleted', {
              description: 'The expense has been successfully deleted.',
            })
          },
        }
      )
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
                <Button className="h-8 w-8 p-0" variant="ghost">
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
    [handleDelete, handleEdit]
  )

  if (isLoading) {
    return <TableLoading />
  }
  if (error) {
    return <div>Error loading expenses</div>
  }

  return (
    <div className="w-full overflow-hidden rounded-lg bg-white shadow-md">
      <h2 className="bg-gray-50 p-6 font-bold text-2xl text-gray-800">
        Expense Records
      </h2>
      <DataTable columns={columnsWithActions} data={expenses} />

      {/* Edit Dialog */}
      <Dialog onOpenChange={setIsEditDialogOpen} open={isEditDialogOpen}>
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
              onCancel={() => setIsEditDialogOpen(false)}
              onSave={handleUpdateExpense}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog onOpenChange={setIsDeleteDialogOpen} open={isDeleteDialogOpen}>
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
              onClick={() => setIsDeleteDialogOpen(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button onClick={handleConfirmDelete} variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
