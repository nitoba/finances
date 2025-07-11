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
import { cn } from '@/lib/utils'

interface TrendLineChartProps {
  data: { name: string; [key: string]: number | string }[]
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

export function TrendLineChart({ data }: TrendLineChartProps) {
  const [activeChart, setActiveChart] = useState<
    keyof typeof chartConfig | 'all'
  >('all')

  const isEmpty = !data || data.length === 0

  const handleExport = () => {
    // Export chart data as CSV
    const csvData = data.map((item) => ({
      Week: item.name,
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
    link.download = `spending-trends-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <EnhancedChartContainer
      title="Spending Trends"
      description="Weekly spending patterns across categories"
      isEmpty={isEmpty}
      emptyMessage="No spending data available for trend analysis"
      onExport={handleExport}
      chartConfig={chartConfig}
    >
      <div className="space-y-4">
        {/* Filter Buttons */}
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
            All Categories
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
        <ChartContainer className="h-[300px] w-full" config={chartConfig}>
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
            aria-label={`Spending trends line chart showing ${activeChart === 'all' ? 'all categories' : chartConfig[activeChart as keyof typeof chartConfig]?.label || activeChart} over time`}
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
              aria-label="Spending amount in dollars"
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            {activeChart === 'all' ? (
              Object.entries(chartConfig).map(([key, config]) => (
                <Line
                  key={key}
                  dataKey={key}
                  type="monotone"
                  stroke={config.color}
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: 'var(--background)' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  aria-label={`${config.label} spending trend`}
                />
              ))
            ) : (
              <Line
                dataKey={activeChart}
                type="monotone"
                stroke={chartConfig[activeChart].color}
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2, fill: 'var(--background)' }}
                activeDot={{ r: 7, strokeWidth: 0 }}
                aria-label={`${chartConfig[activeChart].label} spending trend`}
              />
            )}
          </LineChart>
        </ChartContainer>
      </div>
    </EnhancedChartContainer>
  )
}
