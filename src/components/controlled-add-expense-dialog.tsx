'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { ExpenseForm } from '../app/(app)/expenses/_components/expense-form'

type ControlledAddExpenseDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddExpense?: () => void
}

export function ControlledAddExpenseDialog({
  open,
  onOpenChange,
  onAddExpense,
}: ControlledAddExpenseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Quick Add Expense</DialogTitle>
          <DialogDescription>
            Add a new expense quickly using the shortcut Cmd+E or the floating
            action button.
          </DialogDescription>
        </DialogHeader>

        <ExpenseForm
          onAddExpense={() => {
            onAddExpense?.()
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
