'use client'

import { useState } from 'react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { Button } from '@/components/ui/button'
import { EnhancedChartContainer } from '@/components/enhanced-chart-container'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import type { Expense } from '@/schemas/expense.schema'
import { calculateMovingAverages } from '@/utils/calculations'
import { cn } from '@/lib/utils'

interface MovingAveragesChartProps {
  expenses: Expense[]
}

const chartConfig = {
  essentials: {
    label: 'Essentials',
    color: 'hsl(217, 91%, 60%)',
  },
  leisure: {
    label: 'Leisure',
    color: 'hsl(142, 71%, 45%)',
  },
  investments: {
    label: 'Investments',
    color: 'hsl(262, 83%, 58%)',
  },
  knowledge: {
    label: 'Knowledge',
    color: 'hsl(25, 95%, 53%)',
  },
  emergency: {
    label: 'Emergency',
    color: 'hsl(346, 87%, 43%)',
  },
} satisfies ChartConfig

const periodLabels = {
  7: 'Semanal',
  14: 'Quinzenal',
  30: 'Mensal',
} as const

export function MovingAveragesChart({ expenses }: MovingAveragesChartProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<7 | 14 | 30>(7)
  const [activeChart, setActiveChart] = useState<
    keyof typeof chartConfig | 'all'
  >('all')

  const movingAverages = calculateMovingAverages(expenses, [7, 14, 30])
  const data = movingAverages[selectedPeriod] || []

  const isEmpty = !data || data.length === 0

  const handleExport = () => {
    const csvData = data.map((item) => ({
      Period: item.name,
      ...Object.fromEntries(
        Object.keys(chartConfig).map((key) => [
          chartConfig[key as keyof typeof chartConfig].label,
          item[key] || 0,
        ])
      ),
    }))

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map((row) => Object.values(row).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `moving-averages-${periodLabels[selectedPeriod].toLowerCase()}-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <EnhancedChartContainer
      title="Médias Móveis"
      description={`Análise de médias móveis ${periodLabels[selectedPeriod].toLowerCase()}`}
      isEmpty={isEmpty}
      emptyMessage="Não há dados suficientes para calcular médias móveis"
      onExport={handleExport}
      chartConfig={chartConfig}
    >
      <div className="space-y-4">
        {/* Period Selection */}
        <div className="flex flex-wrap gap-2">
          <div className="mr-2 self-center text-muted-foreground text-sm">
            Período:
          </div>
          {Object.entries(periodLabels).map(([period, label]) => (
            <Button
              key={period}
              size="sm"
              variant={
                selectedPeriod === Number(period) ? 'default' : 'outline'
              }
              onClick={() => setSelectedPeriod(Number(period) as 7 | 14 | 30)}
              className="h-8 px-3 font-medium text-xs"
            >
              {label}
            </Button>
          ))}
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={activeChart === 'all' ? 'default' : 'outline'}
            onClick={() => setActiveChart('all')}
            className={cn(
              'h-8 px-3 font-medium text-xs transition-all',
              activeChart === 'all'
                ? 'bg-primary text-primary-foreground shadow-sm'
                : 'border-gray-200 bg-transparent text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
            )}
          >
            Todas Categorias
          </Button>
          {Object.entries(chartConfig).map(([key, config]) => (
            <Button
              key={key}
              size="sm"
              variant={activeChart === key ? 'default' : 'outline'}
              onClick={() => setActiveChart(key as keyof typeof chartConfig)}
              className={cn(
                'h-8 px-3 font-medium text-xs transition-all',
                activeChart === key
                  ? 'text-primary-foreground shadow-sm'
                  : 'border-gray-200 bg-transparent text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800'
              )}
              style={
                activeChart === key ? { backgroundColor: config.color } : {}
              }
            >
              {config.label}
            </Button>
          ))}
        </div>

        {/* Chart */}
        <ChartContainer className="h-[350px] w-full" config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
            role="img"
            aria-label={`Moving averages chart for ${periodLabels[selectedPeriod].toLowerCase()} periods showing ${activeChart === 'all' ? 'all categories' : chartConfig[activeChart as keyof typeof chartConfig]?.label || activeChart} trends`}
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
              aria-label="Time periods"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              className="text-xs"
              tick={{ fontSize: 12 }}
              aria-label="Average spending amount in dollars"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            {activeChart === 'all' ? (
              Object.entries(chartConfig).map(([key, config]) => (
                <Line
                  key={key}
                  dataKey={key}
                  type="monotone"
                  stroke={config.color}
                  strokeWidth={2}
                  dot={{ r: 3, strokeWidth: 2, fill: 'var(--background)' }}
                  activeDot={{ r: 5, strokeWidth: 0 }}
                  aria-label={`${config.label} moving average trend`}
                />
              ))
            ) : (
              <Line
                dataKey={activeChart}
                type="monotone"
                stroke={chartConfig[activeChart].color}
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: 'var(--background)' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                aria-label={`${chartConfig[activeChart].label} moving average trend`}
              />
            )}
          </LineChart>
        </ChartContainer>
      </div>
    </EnhancedChartContainer>
  )
}
