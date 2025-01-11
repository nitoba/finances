import {
  ArrowDown,
  ArrowUp,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Wallet,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ExpenseSummary() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Gastos</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$1,521.60</div>
          <p className="flex items-center text-xs text-muted-foreground">
            <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
            +20.1% em relação ao mês anterior
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Maior Gasto</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$700.00</div>
          <p className="text-xs text-muted-foreground">Aluguel - Essentials</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Média por Dia</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">$169.07</div>
          <p className="flex items-center text-xs text-muted-foreground">
            <ArrowDown className="mr-1 h-4 w-4 text-emerald-500" />
            -12% em relação ao mês anterior
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Categoria Principal
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">Essentials</div>
          <p className="text-xs text-muted-foreground">62% dos gastos totais</p>
        </CardContent>
      </Card>
    </div>
  )
}
