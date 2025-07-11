'use client'

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { TrendingUp, TrendingDown, Download, Info } from 'lucide-react'
import { EnhancedChartContainer } from '@/components/enhanced-chart-container'
import { useBalanceChartData } from '@/hooks/use-chart-data'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
} from '@/components/ui/chart'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface AreaChartProps {
  data: {
    name: string
    balance: number
    projected?: boolean
    confidence?: number
  }[]
}

const chartConfig = {
  balance: {
    label: 'Balance',
    color: 'hsl(142, 71%, 45%)',
  },
} satisfies ChartConfig

export function BalanceAreaChart({ data }: AreaChartProps) {
  const {
    data: chartData,
    trend,
    currentBalance,
    projectedWeeks,
    averageWeeklyChange,
  } = useBalanceChartData(data)

  const isPositiveTrend = trend >= 0
  const isEmpty = chartData.length === 0

  const handleExport = () => {
    // Export chart data as CSV
    const csvData = chartData.map((item) => ({
      Week: item.name,
      Balance: item.balance,
      Projected: item.projected,
      Confidence: item.confidence || 100,
    }))

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map((row) => Object.values(row).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `balance-projection-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <EnhancedChartContainer
      title="Balance Projection"
      description="Account balance trend over time with projections"
      isEmpty={isEmpty}
      emptyMessage="No balance data available for visualization"
      onExport={handleExport}
      chartConfig={chartConfig}
    >
      <div className="space-y-4">
        {/* Enhanced Header with Metrics */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge
              variant={isPositiveTrend ? 'default' : 'destructive'}
              className="flex items-center gap-1"
            >
              {isPositiveTrend ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              {Math.abs(trend).toFixed(1)}% trend
            </Badge>

            {projectedWeeks > 0 && (
              <Badge variant="outline" className="flex items-center gap-1">
                <Info className="h-3 w-3" />
                {projectedWeeks} weeks projected
              </Badge>
            )}
          </div>

          <div className="text-right">
            <p className="text-muted-foreground text-sm">Weekly Change</p>
            <p
              className={cn(
                'font-semibold',
                averageWeeklyChange >= 0 ? 'text-green-600' : 'text-red-600'
              )}
            >
              {averageWeeklyChange >= 0 ? '+' : ''}$
              {averageWeeklyChange.toFixed(0)}
            </p>
          </div>
        </div>

        {/* Current Balance Display */}
        <div className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-4 dark:from-green-900/10 dark:to-emerald-900/10">
          <p className="font-medium text-green-700 text-sm dark:text-green-400">
            Current Balance
          </p>
          <p className="font-bold text-3xl text-green-900 dark:text-green-100">
            ${currentBalance.toLocaleString()}
          </p>
        </div>

        {/* Chart */}
        <AreaChart
          accessibilityLayer
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="hsl(var(--muted-foreground))"
            strokeOpacity={0.1}
          />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            className="text-xs"
            tick={{ fontSize: 12 }}
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            className="text-xs"
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <ChartTooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="rounded-lg border bg-background p-3 shadow-md">
                    <p className="font-medium">{label}</p>
                    <p className="text-muted-foreground text-sm">
                      Balance:{' '}
                      <span className="font-semibold text-foreground">
                        ${data.balance.toLocaleString()}
                      </span>
                    </p>
                    {data.projected && data.confidence && (
                      <p className="text-muted-foreground text-xs">
                        Projected ({data.confidence}% confidence)
                      </p>
                    )}
                  </div>
                )
              }
              return null
            }}
            cursor={{
              stroke: 'var(--color-balance)',
              strokeWidth: 1,
              strokeDasharray: '4 4',
            }}
          />
          <defs>
            <linearGradient id="fillBalance" x1="0" x2="0" y1="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-balance)"
                stopOpacity={0.3}
              />
              <stop
                offset="95%"
                stopColor="var(--color-balance)"
                stopOpacity={0.05}
              />
            </linearGradient>
          </defs>
          <Area
            dataKey="balance"
            type="monotone"
            fill="url(#fillBalance)"
            fillOpacity={1}
            stroke="var(--color-balance)"
            strokeWidth={3}
            dot={{
              r: 4,
              strokeWidth: 2,
              fill: 'var(--background)',
              stroke: 'var(--color-balance)',
            }}
            activeDot={{ r: 6, strokeWidth: 0, fill: 'var(--color-balance)' }}
            animationBegin={0}
            animationDuration={1500}
          />
        </AreaChart>
      </div>
    </EnhancedChartContainer>
  )
}
