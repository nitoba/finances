'use client'

import {
  AlertTriangle,
  Lightbulb,
  Minus,
  Target,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import type { Expense } from '@/schemas/expense.schema'
import {
  calculateMonthlyComparison,
  calculateSpendingTrendAnalysis,
  type MonthlyComparison,
  type SpendingTrendAnalysis,
} from '@/utils/calculations'

interface TrendAnalysisPanelProps {
  expenses: Expense[]
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount)
}

const getTrendIcon = (trend: 'increasing' | 'decreasing' | 'stable') => {
  switch (trend) {
    case 'increasing':
      return <TrendingUp className="h-4 w-4 text-red-500" />
    case 'decreasing':
      return <TrendingDown className="h-4 w-4 text-green-500" />
    default:
      return <Minus className="h-4 w-4 text-gray-500" />
  }
}

const getTrendColor = (trend: 'increasing' | 'decreasing' | 'stable') => {
  switch (trend) {
    case 'increasing':
      return 'text-red-600 bg-red-50'
    case 'decreasing':
      return 'text-green-600 bg-green-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

const getVolatilityColor = (volatility: 'high' | 'medium' | 'low') => {
  switch (volatility) {
    case 'high':
      return 'text-red-600 bg-red-50'
    case 'medium':
      return 'text-yellow-600 bg-yellow-50'
    default:
      return 'text-green-600 bg-green-50'
  }
}

const CategoryTrendCard = ({
  category,
  data,
}: {
  category: string
  data: SpendingTrendAnalysis['categoryTrends'][keyof SpendingTrendAnalysis['categoryTrends']]
}) => (
  <Card className="h-full">
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <CardTitle className="font-medium text-base capitalize">
          {category}
        </CardTitle>
        <div className="flex items-center gap-2">
          {getTrendIcon(data.trend)}
          <Badge
            className={cn('text-xs', getTrendColor(data.trend))}
            variant="outline"
          >
            {data.trend}
          </Badge>
        </div>
      </div>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Média Semanal</p>
          <p className="font-medium">{formatCurrency(data.averageSpending)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Previsão 4 Semanas</p>
          <p className="font-medium">{formatCurrency(data.prediction)}</p>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Volatilidade</span>
          <Badge
            className={cn('text-xs', getVolatilityColor(data.volatility))}
            variant="outline"
          >
            {data.volatility}
          </Badge>
        </div>
        <Progress className="h-2" max={50} value={data.changePercentage} />
        <p className="mt-1 text-muted-foreground text-xs">
          {data.changePercentage.toFixed(1)}% variação
        </p>
      </div>
    </CardContent>
  </Card>
)

const MonthlyComparisonCard = ({
  comparison,
}: {
  comparison: MonthlyComparison
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Target className="h-5 w-5" />
        Comparação Mensal
      </CardTitle>
      <CardDescription>
        Mudanças nos gastos em relação ao mês anterior
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <p className="text-muted-foreground text-sm">Mês Anterior</p>
          <p className="font-bold text-2xl">
            {formatCurrency(comparison.previousMonth.total)}
          </p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground text-sm">Mês Atual</p>
          <p className="font-bold text-2xl">
            {formatCurrency(comparison.currentMonth.total)}
          </p>
        </div>
      </div>

      <div className="text-center">
        <div
          className={cn(
            'inline-flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-sm',
            comparison.changes.totalChange >= 0
              ? 'bg-red-50 text-red-700'
              : 'bg-green-50 text-green-700'
          )}
        >
          {comparison.changes.totalChange >= 0 ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          {formatCurrency(Math.abs(comparison.changes.totalChange))}(
          {Math.abs(comparison.changes.totalChangePercentage).toFixed(1)}%)
        </div>
      </div>

      <div className="space-y-2">
        {Object.entries(comparison.changes.categoryChanges).map(
          ([category, change]) => (
            <div
              className="flex items-center justify-between text-sm"
              key={category}
            >
              <span className="font-medium capitalize">{category}</span>
              <span
                className={cn(
                  change.change >= 0 ? 'text-red-600' : 'text-green-600'
                )}
              >
                {change.change >= 0 ? '+' : ''}
                {formatCurrency(change.change)}(
                {change.changePercentage.toFixed(1)}%)
              </span>
            </div>
          )
        )}
      </div>
    </CardContent>
  </Card>
)

const InsightsPanel = ({ analysis }: { analysis: SpendingTrendAnalysis }) => (
  <div className="space-y-4">
    {analysis.insights.length > 0 && (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Insights Financeiros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysis.insights.map((insight, index) => (
              <li className="flex items-start gap-2 text-sm" key={index}>
                <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-yellow-500" />
                {insight}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    )}

    {analysis.recommendations.length > 0 && (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-500" />
            Recomendações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {analysis.recommendations.map((recommendation, index) => (
              <li className="flex items-start gap-2 text-sm" key={index}>
                <div className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500" />
                {recommendation}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    )}
  </div>
)

export function TrendAnalysisPanel({ expenses }: TrendAnalysisPanelProps) {
  const [analysisMonths, setAnalysisMonths] = useState(3)

  const analysis = calculateSpendingTrendAnalysis(expenses, analysisMonths)
  const monthlyComparison = calculateMonthlyComparison(expenses)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-bold text-2xl tracking-tight">
            Análise de Tendências
          </h2>
          <p className="text-muted-foreground">
            Análise detalhada dos seus padrões de gastos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setAnalysisMonths(1)}
            size="sm"
            variant={analysisMonths === 1 ? 'default' : 'outline'}
          >
            1M
          </Button>
          <Button
            onClick={() => setAnalysisMonths(3)}
            size="sm"
            variant={analysisMonths === 3 ? 'default' : 'outline'}
          >
            3M
          </Button>
          <Button
            onClick={() => setAnalysisMonths(6)}
            size="sm"
            variant={analysisMonths === 6 ? 'default' : 'outline'}
          >
            6M
          </Button>
        </div>
      </div>

      <Tabs className="space-y-4" defaultValue="trends">
        <TabsList className="grid w-full grid-cols-3 gap-3">
          <TabsTrigger value="trends">Tendências por Categoria</TabsTrigger>
          <TabsTrigger value="comparison">Comparação Mensal</TabsTrigger>
          <TabsTrigger value="insights">Insights & Recomendações</TabsTrigger>
        </TabsList>

        <TabsContent className="space-y-4" value="trends">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Object.entries(analysis.categoryTrends).map(([category, data]) => (
              <CategoryTrendCard
                category={category}
                data={data}
                key={category}
              />
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tendência Geral</CardTitle>
              <CardDescription>
                Análise consolidada dos gastos gerais
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-muted-foreground text-sm">Direção</p>
                  <div className="mt-1 flex items-center justify-center gap-2">
                    {getTrendIcon(analysis.overallTrend.direction)}
                    <span className="font-medium capitalize">
                      {analysis.overallTrend.direction}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Força</p>
                  <p className="mt-1 font-bold text-lg">
                    {analysis.overallTrend.strength.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground text-sm">Confiança</p>
                  <p className="mt-1 font-bold text-lg">
                    {analysis.overallTrend.confidence.toFixed(0)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <MonthlyComparisonCard comparison={monthlyComparison} />
        </TabsContent>

        <TabsContent value="insights">
          <InsightsPanel analysis={analysis} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
