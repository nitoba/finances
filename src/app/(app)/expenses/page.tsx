import { AddExpenseDialog } from '@/components/add-expense-dialog'
import { ExpenseTable } from './_components/expensive-table/expense-table'

export default function Page() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">
          Controle de Despesas
        </h1>
        <p className="text-muted-foreground">
          Gerencie e acompanhe todas as suas despesas em um só lugar
        </p>
      </div>
      <div className="flex flex-col gap-4">
        <AddExpenseDialog className="self-end" />
        <ExpenseTable />
      </div>
    </div>
  )
}
