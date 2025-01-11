'use client'

import { AlertCircle, ArrowUpRight, Banknote, CreditCard } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const insightsData = [
  {
    title: 'Gasto Recorrente Mais Alto',
    value: 'Aluguel',
    amount: '$700.00',
    icon: Banknote,
  },
  {
    title: 'Categoria com Maior Variação',
    value: 'Leisure',
    amount: '+15.2%',
    icon: ArrowUpRight,
  },
  {
    title: 'Transação Mais Frequente',
    value: 'Uber',
    amount: '5x',
    icon: CreditCard,
  },
  {
    title: 'Alerta de Orçamento',
    value: 'Leisure',
    amount: '90% usado',
    icon: AlertCircle,
  },
]

export function ExpenseInsights() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {insightsData.map((item) => (
        <Card key={item.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            <item.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground">{item.amount}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
