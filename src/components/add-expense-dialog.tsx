'use client'

import { PlusCircle } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import { ExpenseForm } from '../app/(app)/expenses/_components/expense-form'

type AddExpenseDialogProps = {
  onAddExpense?: () => void
  className?: string
}

export function AddExpenseDialog({
  onAddExpense,
  className,
}: AddExpenseDialogProps) {
  const [expensiveFormIsOpen, setExpensiveFormIsOpen] = useState(false)

  return (
    <Dialog onOpenChange={setExpensiveFormIsOpen} open={expensiveFormIsOpen}>
      <DialogTrigger asChild>
        <Button className={cn('w-fit', className)}>
          Add Expense
          <PlusCircle className="size-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>New Transaction</DialogTitle>
          <DialogDescription>
            Fill in the transaction details below to add a new expense to your
            financial tracking.
          </DialogDescription>
        </DialogHeader>

        <ExpenseForm
          onAddExpense={() => {
            onAddExpense?.()
            setExpensiveFormIsOpen(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}
