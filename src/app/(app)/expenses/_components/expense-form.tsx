import { CalendarIcon, PlusCircle } from 'lucide-react'
import type React from 'react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useCreateExpense } from '@/hooks/use-expenses'
import { cn } from '@/lib/utils'
import type { ExpenseCategory } from '@/schemas/category.schema'

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
    if (!(date && description && amount)) return

    await createExpenseMutation.mutateAsync(
      {
        date: date.toISOString(),
        description,
        amount: Number.parseFloat(amount),
        category,
      },
      {
        onSuccess: () => {
          onAddExpense()
        },
      }
    )

    setDescription('')
    setAmount('')
  }

  return (
    <form className="w-full" onSubmit={handleSubmit}>
      <h2 className="mb-4 font-bold text-2xl text-gray-800">Add New Expense</h2>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block font-medium text-gray-700 text-sm">
            Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
                variant="outline"
              >
                <CalendarIcon />
                {date ? (
                  new Date(date).toLocaleDateString()
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                initialFocus
                mode="single"
                onSelect={setDate}
                selected={date}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <label className="mb-1 block font-medium text-gray-700 text-sm">
            Description
          </label>
          <Input
            className="w-full"
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter description"
            required
            type="text"
            value={description}
          />
        </div>
        <div>
          <label className="mb-1 block font-medium text-gray-700 text-sm">
            Amount
          </label>
          <Input
            className="w-full"
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            required
            step="0.01"
            type="number"
            value={amount}
          />
        </div>
        <div>
          <label className="mb-1 block font-medium text-gray-700 text-sm">
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
        className="mt-4 flex w-full items-center justify-center rounded-md bg-green-600 px-4 py-2 text-white transition-colors hover:bg-green-700"
        type="submit"
      >
        <PlusCircle className="mr-2 h-5 w-5" />
        Add Expense
      </Button>
    </form>
  )
}
