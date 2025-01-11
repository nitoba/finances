'use client'

import { Expense } from '@/schemas/expense.schema'
import { ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'

export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: 'createdAt',
    header: 'Date',
    cell: ({ row }) => dayjs(row.getValue('createdAt')).format('DD/MM/YYYY'),
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => `$${row.getValue<number>('amount').toFixed(2)}`,
  },
  {
    accessorKey: 'category',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.getValue('category') as string
      return (
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
          ${
            category === 'essentials'
              ? 'bg-blue-100 text-blue-800'
              : category === 'leisure'
                ? 'bg-purple-100 text-purple-800'
                : category === 'investments'
                  ? 'bg-green-100 text-green-800'
                  : category === 'knowledge'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
          }`}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </span>
      )
    },
  },
]
