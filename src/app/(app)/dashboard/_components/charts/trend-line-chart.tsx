'use client'
import { useState } from 'react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import colors from 'tailwindcss/colors'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { type ChartConfig, ChartContainer } from '@/components/ui/chart'

interface TrendLineChartProps {
  data: { name: string; [key: string]: number | string }[]
}

const chartConfig = {
  essentials: {
    label: 'Essentials',
    color: colors.blue['500'],
  },
  leisure: {
    label: 'Leisure',
    color: colors.purple['500'],
  },
  investments: {
    label: 'Investments',
    color: colors.green['500'],
  },
  knowledge: {
    label: 'Knowledge',
    color: colors.yellow['500'],
  },
  emergency: {
    label: 'Emergency',
    color: colors.red['500'],
  },
} satisfies ChartConfig

export function TrendLineChart({ data }: TrendLineChartProps) {
  const [activeChart, setActiveChart] = useState<
    keyof typeof chartConfig | 'all'
  >('all')

  return (
    <Card className="flex flex-col gap-2 sm:block sm:flex-row">
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Weekly Spending Trends</CardTitle>

          <CardDescription>
            Showing trends for different categories
          </CardDescription>
        </div>
        <div className="flex flex-wrap gap-2 px-2 py-2">
          <Button
            className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left data-[active=true]:bg-muted/80"
            data-active={activeChart === 'all'}
            onClick={() => {
              setActiveChart('all')
            }}
            variant="outline"
          >
            <span className="text-muted-foreground text-xs">
              Show All Categories
            </span>
          </Button>
          {Object.keys(chartConfig).map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <Button
                className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/80"
                data-active={activeChart === chart}
                key={chart}
                onClick={() => setActiveChart(chart)}
                variant="outline"
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
              </Button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          className="aspect-auto h-[250px] w-full"
          config={chartConfig}
        >
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              axisLine={false}
              dataKey="name"
              minTickGap={32}
              tickLine={false}
              tickMargin={8}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            {activeChart === 'all' ? (
              Object.keys(chartConfig).map((key) => (
                <Line
                  dataKey={key}
                  dot={false}
                  key={key}
                  stroke={chartConfig[key as keyof typeof chartConfig].color}
                  strokeWidth={2}
                  type="monotone"
                />
              ))
            ) : (
              <Line
                dataKey={activeChart}
                dot={false}
                stroke={chartConfig[activeChart].color}
                strokeWidth={2}
                type="monotone"
              />
            )}
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
