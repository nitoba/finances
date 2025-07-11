import { ArrowDown, ArrowUp } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useExpenses } from '@/hooks/use-expenses'
import { useUser } from '@/hooks/use-user'

export function ExpenseRankings() {
  const { user } = useUser()
  const { data: expenses } = useExpenses()

  if (!(user && expenses)) {
    return null
  }

  const categories = [
    'essentials',
    'leisure',
    'investments',
    'emergency',
    'knowledge',
  ]
  const categoryData = categories.map((category) => {
    const categoryExpenses = expenses.filter(
      (expense) => expense.category === category
    )
    const amount = categoryExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    )
    const previousAmount = 0 // Aqui você pode adicionar lógica para obter o valor anterior, se disponível
    const trend =
      amount > previousAmount
        ? 'up'
        : amount < previousAmount
          ? 'down'
          : 'neutral'
    const percentageOfTotal =
      (amount / expenses.reduce((sum, expense) => sum + expense.amount, 0)) *
      100

    return {
      category: category.charAt(0).toUpperCase() + category.slice(1),
      amount,
      percentageOfTotal,
      trend,
      previousAmount,
      color: getColorForCategory(category),
    }
  })

  const sortedCategories = categoryData.sort((a, b) => b.amount - a.amount)

  return (
    <Card className="lg:col-span-4">
      <CardHeader>
        <CardTitle>Expense Rankings</CardTitle>
        <CardDescription>
          Breakdown of expenses by category with month-over-month changes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {sortedCategories.map((category) => (
            <div className="flex items-center" key={category.category}>
              <div className="flex-1 space-y-1">
                <p className="font-medium text-sm leading-none">
                  {category.category}
                </p>
                <p className="text-muted-foreground text-sm">
                  {category.percentageOfTotal.toFixed(2)}% of total expenses
                </p>
              </div>
              <div className="flex items-center gap-2">
                {category.trend === 'up' ? (
                  <ArrowUp className="h-4 w-4 text-red-500" />
                ) : category.trend === 'down' ? (
                  <ArrowDown className="h-4 w-4 text-green-500" />
                ) : null}
                <span className="font-bold">${category.amount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function getColorForCategory(category: string): string {
  switch (category) {
    case 'essentials':
      return '#3b82f6' // blue-500
    case 'leisure':
      return '#10b981' // emerald-500
    case 'investments':
      return '#f59e0b' // amber-500
    case 'emergency':
      return '#ef4444' // red-500
    case 'knowledge':
      return '#8b5cf6' // violet-500
    default:
      return '#000000' // default color
  }
}
