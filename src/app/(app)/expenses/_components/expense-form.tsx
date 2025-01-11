import React, { useState } from 'react'
import { CalendarIcon, PlusCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

import { useCreateExpense } from '@/hooks/use-expenses'
import { ExpenseCategory } from '@/schemas/category.schema'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface ExpenseFormProps {
  onAddExpense: () => void
}

export function ExpenseForm({ onAddExpense }: ExpenseFormProps) {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState<ExpenseCategory>('essentials')
  const createExpenseMutation = useCreateExpense()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !description || !amount) return

    await createExpenseMutation.mutateAsync(
      {
        date: date.toISOString(),
        description,
        amount: parseFloat(amount),
        category,
      },
      {
        onSuccess: () => {
          onAddExpense()
        },
      },
    )

    setDescription('')
    setAmount('')
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Expense</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && 'text-muted-foreground',
                )}
              >
                <CalendarIcon />
                {date ? (
                  new Date(date).toLocaleDateString()
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <Input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full"
            placeholder="Enter description"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full"
            placeholder="Enter amount"
            step="0.01"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <Select
            onValueChange={(value) => setCategory(value as ExpenseCategory)}
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
      <Button
        type="submit"
        className="mt-4 flex items-center justify-center w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        Add Expense
      </Button>
    </form>
  )
}
