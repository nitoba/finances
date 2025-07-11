import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@radix-ui/react-select'
import dayjs from 'dayjs'
import { CalendarIcon } from 'lucide-react'
import React from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import type { ExpenseCategory } from '@/schemas/category.schema'
import type { Expense } from '@/schemas/expense.schema'

interface ExpenseEditFormProps {
  expense: Expense
  onSave: (expense: Expense) => void
  onCancel: () => void
}

export function ExpenseEditForm({
  expense,
  onSave,
  onCancel,
}: ExpenseEditFormProps) {
  const [formData, setFormData] = React.useState({
    date: expense.date,
    description: expense.description,
    amount: expense.amount.toString(),
    category: expense.category,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const updatedExpense: Expense = {
      ...expense,
      date: formData.date,
      description: formData.description,
      amount: Number.parseFloat(formData.amount),
      category: formData.category as ExpenseCategory,
    }
    onSave(updatedExpense)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleChangeDate = (date: Date | undefined) => {
    if (date) {
      setFormData((prev) => ({
        ...prev,
        date: date.toISOString().split('T')[0],
      }))
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label className="font-medium text-sm" htmlFor="date">
            Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className="w-full justify-start text-left font-normal"
                variant={'outline'}
              >
                <CalendarIcon />
                {dayjs(formData.date).format('DD/MM/YYYY')}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                initialFocus
                mode="single"
                onSelect={handleChangeDate}
                selected={new Date(expense.date)}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="font-medium text-sm" htmlFor="description">
            Description
          </label>
          <Input
            id="description"
            name="description"
            onChange={handleChange}
            required
            value={formData.description}
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium text-sm" htmlFor="amount">
            Amount
          </label>
          <Input
            id="amount"
            name="amount"
            onChange={handleChange}
            required
            step="0.01"
            type="number"
            value={formData.amount}
          />
        </div>

        <div className="space-y-2">
          <label className="font-medium text-sm" htmlFor="category">
            Category
          </label>
          <Select
            onValueChange={(value) =>
              handleChange({
                target: { name: 'category', value },
              } as React.ChangeEvent<HTMLSelectElement>)
            }
            value={formData.category}
          >
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="essentials">Essentials</SelectItem>
              <SelectItem value="leisure">Leisure</SelectItem>
              <SelectItem value="investments">Investments</SelectItem>
              <SelectItem value="knowledge">Knowledge</SelectItem>
              <SelectItem value="emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter>
        <Button onClick={onCancel} type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </form>
  )
}
