import { AddExpenseDialog } from '@/components/add-expense-dialog'
import { ExpenseChart } from './_components/expense-chart'
import { ExpenseSummary } from './_components/expense-summary'
import { ExpenseInsights } from './_components/expenses-insights'
import { ExpenseTable } from './_components/expensive-table/expense-table'

export default function Page() {
  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-2">
      <div className="flex flex-col justify-between space-y-2 sm:items-center lg:flex-row">
        <div>
          <h2 className="font-bold text-3xl tracking-tight">
            Controle de Despesas
          </h2>
          <p className="text-muted-foreground">
            Gerencie e acompanhe todas as suas despesas em um só lugar
          </p>
        </div>
        <AddExpenseDialog className="w-full sm:w-auto" />
      </div>
      <ExpenseSummary />
      <ExpenseInsights />
      <ExpenseChart />
      <ExpenseTable />
    </div>
  )
}
