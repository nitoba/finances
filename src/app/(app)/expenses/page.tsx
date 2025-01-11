import { AddExpenseDialog } from '@/components/add-expense-dialog'
import { ExpenseTable } from './_components/expensive-table/expense-table'
import { ExpenseSummary } from './_components/expense-summary'
import { ExpenseChart } from './_components/expense-chart'
import { ExpenseInsights } from './_components/expenses-insights'
import { ExpenseTrends } from './_components/expenses-trends'

export default function Page() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-2 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Controle de Despesas
          </h2>
          <p className="text-muted-foreground">
            Gerencie e acompanhe todas as suas despesas em um só lugar
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <AddExpenseDialog />
        </div>
      </div>
      <ExpenseSummary />
      <ExpenseInsights />
      <ExpenseTrends />
      <ExpenseChart />
      <ExpenseTable />
    </div>
  )
}
