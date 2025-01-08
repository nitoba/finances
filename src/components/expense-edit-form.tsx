import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { DialogFooter } from './ui/dialog'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from './ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'
import { Expense } from '@/schemas/expense.schema'
import { ExpenseCategory } from '@/schemas/category.schema'
import dayjs from 'dayjs'
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
      amount: parseFloat(formData.amount),
      category: formData.category as ExpenseCategory,
    }
    onSave(updatedExpense)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="date">
            Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon />
                {dayjs(formData.date).format('DD/MM/YYYY')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={new Date(expense.date)}
                onSelect={handleChangeDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="description">
            Description
          </label>
          <Input
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="amount">
            Amount
          </label>
          <Input
            id="amount"
            name="amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="category">
            Category
          </label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              handleChange({
                target: { name: 'category', value },
              } as React.ChangeEvent<HTMLSelectElement>)
            }
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
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </form>
  )
}
