'use client'
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ChartConfig, ChartContainer } from '@/components/ui/chart'
import { green, blue, purple, yellow, red } from 'tailwindcss/colors'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface TrendLineChartProps {
  data: { name: string; [key: string]: number | string }[]
}

const chartConfig = {
  essentials: {
    label: 'Essentials',
    color: blue['500'],
  },
  leisure: {
    label: 'Leisure',
    color: purple['500'],
  },
  investments: {
    label: 'Investments',
    color: green['500'],
  },
  knowledge: {
    label: 'Knowledge',
    color: yellow['500'],
  },
  emergency: {
    label: 'Emergency',
    color: red['500'],
  },
} satisfies ChartConfig

export function TrendLineChart({ data }: TrendLineChartProps) {
  const [activeChart, setActiveChart] =
    useState<keyof typeof chartConfig>('essentials')

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Expense Category Trends</CardTitle>

          <CardDescription>
            Showing trends for different categories
          </CardDescription>
        </div>
        <div className="flex gap-2 px-2 py-2 flex-wrap">
          {Object.keys(chartConfig).map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <Button
                key={chart}
                variant="outline"
                data-active={activeChart === chart}
                className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/80"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  {chartConfig[chart].label}
                </span>
              </Button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
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
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={chartConfig[activeChart].color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
