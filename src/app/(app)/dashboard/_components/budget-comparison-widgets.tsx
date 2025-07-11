'use client'

import { AlertTriangle, CheckCircle, Eye, TrendingUp, Zap } from 'lucide-react'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import type { CategoryBudget } from '@/types/finance'

interface BudgetComparisonWidgetsProps {
  budgets: CategoryBudget[]
  onDrillDown?: (category: string) => void
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount)
}

const getBudgetStatus = (planned: number, spent: number) => {
  const percentage = planned > 0 ? (spent / planned) * 100 : 0

  if (percentage <= 75) {
    return { status: 'good', color: 'green', label: 'Excelente' }
  }
  if (percentage <= 90) {
    return { status: 'warning', color: 'yellow', label: 'Atenção' }
  }
  if (percentage <= 100) {
    return { status: 'danger', color: 'orange', label: 'Limite' }
  }
  return { status: 'over', color: 'red', label: 'Excedido' }
}

const BudgetProgressCard = ({
  budget,
  onDrillDown,
}: {
  budget: CategoryBudget
  onDrillDown?: (category: string) => void
}) => {
  const { status, label } = getBudgetStatus(budget.planned, budget.spent)
  const percentage =
    budget.planned > 0 ? (budget.spent / budget.planned) * 100 : 0
  const remaining = Math.max(0, budget.planned - budget.spent)

  const getProgressColor = () => {
    switch (status) {
      case 'good':
        return 'bg-green-500'
      case 'warning':
        return 'bg-yellow-500'
      case 'danger':
        return 'bg-orange-500'
      case 'over':
        return 'bg-red-500'
      default:
        return 'bg-blue-500'
    }
  }

  const getBackgroundColor = () => {
    switch (status) {
      case 'good':
        return 'bg-green-50 border-green-200 dark:bg-green-950/50'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/50'
      case 'danger':
        return 'bg-orange-50 border-orange-200 dark:bg-orange-950/50'
      case 'over':
        return 'bg-red-50 border-red-200 dark:bg-red-950/50'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all hover:shadow-md',
        getBackgroundColor()
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="font-medium text-base capitalize">
            {budget.category}
          </CardTitle>
          <Badge
            className={cn(
              'font-medium text-xs',
              status === 'good' &&
                'border-green-300 bg-green-100 text-green-700',
              status === 'warning' &&
                'border-yellow-300 bg-yellow-100 text-yellow-700',
              status === 'danger' &&
                'border-orange-300 bg-orange-100 text-orange-700',
              status === 'over' && 'border-red-300 bg-red-100 text-red-700'
            )}
            variant="outline"
          >
            {label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{percentage.toFixed(1)}%</span>
          </div>
          <div className="relative">
            <Progress
              className="h-3"
              progressIndicatorProps={{
                className: 'bg-transparent',
              }}
              value={Math.min(percentage, 100)}
            />
            <div
              className={cn(
                'absolute top-0 left-0 h-3 rounded-full transition-all',
                getProgressColor()
              )}
              style={{ width: `${Math.min(percentage, 100)}%` }}
            />
            {percentage > 100 && (
              <div className="-top-1 -right-1 absolute">
                <AlertTriangle className="h-4 w-4 text-red-500" />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Gasto</p>
            <p className="font-semibold">{formatCurrency(budget.spent)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Planejado</p>
            <p className="font-semibold">{formatCurrency(budget.planned)}</p>
          </div>
        </div>

        <div className="flex items-center justify-between border-t pt-2">
          <div className="text-sm">
            <span className="text-muted-foreground">
              {status === 'over' ? 'Excesso: ' : 'Restante: '}
            </span>
            <span
              className={cn(
                'font-medium',
                status === 'over' ? 'text-red-600' : 'text-green-600'
              )}
            >
              {status === 'over'
                ? formatCurrency(budget.spent - budget.planned)
                : formatCurrency(remaining)}
            </span>
          </div>
          {onDrillDown && (
            <Button
              className="h-8 px-2"
              onClick={() => onDrillDown(budget.category)}
              size="sm"
              variant="ghost"
            >
              <Eye className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const BudgetOverviewCard = ({ budgets }: { budgets: CategoryBudget[] }) => {
  const totalPlanned = budgets.reduce((sum, b) => sum + b.planned, 0)
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0)
  const overallPercentage =
    totalPlanned > 0 ? (totalSpent / totalPlanned) * 100 : 0

  const categoriesOnTrack = budgets.filter((b) => b.percentage <= 90).length
  const categoriesOverBudget = budgets.filter((b) => b.percentage > 100).length
  const categoriesAtRisk = budgets.filter(
    (b) => b.percentage > 90 && b.percentage <= 100
  ).length

  const getOverallStatus = () => {
    if (overallPercentage <= 75) {
      return { color: 'green', icon: CheckCircle, label: 'Excelente controle' }
    }
    if (overallPercentage <= 90) {
      return { color: 'yellow', icon: Zap, label: 'Atenção necessária' }
    }
    if (overallPercentage <= 100) {
      return {
        color: 'orange',
        icon: AlertTriangle,
        label: 'Próximo do limite',
      }
    }
    return { color: 'red', icon: AlertTriangle, label: 'Orçamento excedido' }
  }

  const { color, icon: StatusIcon, label } = getOverallStatus()

  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <StatusIcon className={cn('h-5 w-5', `text-${color}-500`)} />
          Visão Geral do Orçamento
        </CardTitle>
        <CardDescription>
          {label} - {overallPercentage.toFixed(1)}% do orçamento total utilizado
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <Progress
              className="h-4"
              value={Math.min(overallPercentage, 100)}
            />
            <div
              className={cn(
                'absolute top-0 left-0 h-4 rounded-full transition-all',
                color === 'green' && 'bg-green-500',
                color === 'yellow' && 'bg-yellow-500',
                color === 'orange' && 'bg-orange-500',
                color === 'red' && 'bg-red-500'
              )}
              style={{ width: `${Math.min(overallPercentage, 100)}%` }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-4">
            <div className="space-y-1">
              <p className="font-bold text-2xl text-green-600">
                {categoriesOnTrack}
              </p>
              <p className="text-muted-foreground text-sm">No controle</p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-2xl text-yellow-600">
                {categoriesAtRisk}
              </p>
              <p className="text-muted-foreground text-sm">Em risco</p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-2xl text-red-600">
                {categoriesOverBudget}
              </p>
              <p className="text-muted-foreground text-sm">Excedidas</p>
            </div>
            <div className="space-y-1">
              <p className="font-bold text-2xl">{budgets.length}</p>
              <p className="text-muted-foreground text-sm">Total</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Total Gasto</p>
              <p className="font-bold text-xl">{formatCurrency(totalSpent)}</p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Total Planejado</p>
              <p className="font-bold text-xl">
                {formatCurrency(totalPlanned)}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const BudgetAlertsPanel = ({ budgets }: { budgets: CategoryBudget[] }) => {
  const alerts = budgets
    .map((budget) => {
      const percentage =
        budget.planned > 0 ? (budget.spent / budget.planned) * 100 : 0

      if (percentage > 100) {
        return {
          type: 'error' as const,
          category: budget.category,
          message: `Excedeu o orçamento em ${formatCurrency(budget.spent - budget.planned)}`,
          percentage,
        }
      }

      if (percentage > 90) {
        return {
          type: 'warning' as const,
          category: budget.category,
          message: `Próximo do limite (${percentage.toFixed(1)}% usado)`,
          percentage,
        }
      }

      return null
    })
    .filter(Boolean)
    .sort((a, b) => (b?.percentage || 0) - (a?.percentage || 0))

  if (alerts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Alertas de Orçamento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="py-6 text-center">
            <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-500" />
            <p className="text-muted-foreground">
              Todas as categorias estão dentro do orçamento planejado!
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-orange-500" />
          Alertas de Orçamento
          <Badge className="ml-2" variant="destructive">
            {alerts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div
              className={cn(
                'flex items-center gap-3 rounded-lg border p-3',
                alert?.type === 'error'
                  ? 'border-red-200 bg-red-50 dark:bg-red-950/50'
                  : 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/50'
              )}
              // biome-ignore lint/suspicious/noArrayIndexKey: quero usar o index
              key={index}
            >
              {alert?.type === 'error' ? (
                <AlertTriangle className="h-5 w-5 flex-shrink-0 text-red-500" />
              ) : (
                <TrendingUp className="h-5 w-5 flex-shrink-0 text-yellow-500" />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm capitalize">
                  {alert?.category}
                </p>
                <p className="text-muted-foreground text-sm">
                  {alert?.message}
                </p>
              </div>
              <Badge
                className={cn(
                  'text-xs',
                  alert?.type === 'error'
                    ? 'border-red-300 bg-red-100 text-red-700'
                    : 'border-yellow-300 bg-yellow-100 text-yellow-700'
                )}
                variant="outline"
              >
                {alert?.percentage.toFixed(0)}%
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function BudgetComparisonWidgets({
  budgets,
  onDrillDown,
}: BudgetComparisonWidgetsProps) {
  const [view, setView] = useState<'cards' | 'overview'>('cards')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg">
            Comparação Orçamento vs Real
          </h3>
          <p className="text-muted-foreground text-sm">
            Acompanhe o progresso do seu orçamento por categoria
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setView('cards')}
            size="sm"
            variant={view === 'cards' ? 'default' : 'outline'}
          >
            Cards
          </Button>
          <Button
            onClick={() => setView('overview')}
            size="sm"
            variant={view === 'overview' ? 'default' : 'outline'}
          >
            Visão Geral
          </Button>
        </div>
      </div>

      <Tabs
        onValueChange={(value) => setView(value as 'cards' | 'overview')}
        value={view}
      >
        <TabsContent className="space-y-6" value="cards">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {budgets.map((budget) => (
              <BudgetProgressCard
                budget={budget}
                key={budget.category}
                onDrillDown={onDrillDown}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent className="space-y-6" value="overview">
          <div className="grid gap-6 lg:grid-cols-2">
            <BudgetOverviewCard budgets={budgets} />
            <BudgetAlertsPanel budgets={budgets} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
