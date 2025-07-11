'use client'

import { useState } from 'react'
import { FileText, Download, Calendar, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface QuickReportGeneratorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function QuickReportGenerator({
  open,
  onOpenChange,
}: QuickReportGeneratorProps) {
  const [reportType, setReportType] = useState<string>('')
  const [period, setPeriod] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)

  const reportTypes = [
    {
      value: 'spending-summary',
      label: 'Spending Summary',
      description: 'Overview of expenses by category',
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      value: 'budget-analysis',
      label: 'Budget Analysis',
      description: 'Budget vs actual spending comparison',
      icon: <FileText className="h-4 w-4" />,
    },
    {
      value: 'monthly-report',
      label: 'Monthly Report',
      description: 'Complete financial overview',
      icon: <Calendar className="h-4 w-4" />,
    },
  ]

  const periods = [
    { value: 'current-month', label: 'Current Month' },
    { value: 'last-month', label: 'Last Month' },
    { value: 'last-3-months', label: 'Last 3 Months' },
    { value: 'year-to-date', label: 'Year to Date' },
  ]

  const handleGenerateReport = async () => {
    if (!(reportType && period)) return

    setIsGenerating(true)

    try {
      // Simulate report generation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real implementation, this would:
      // 1. Fetch the required data based on reportType and period
      // 2. Format the data into a report structure
      // 3. Generate a PDF or CSV file
      // 4. Trigger download

      console.log(`Generating ${reportType} for ${period}`)

      // Mock download trigger
      const fileName = `${reportType}-${period}-${new Date().toISOString().split('T')[0]}.pdf`
      console.log(`Downloaded: ${fileName}`)

      onOpenChange(false)
    } catch (error) {
      console.error('Failed to generate report:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Quick Report Generator
          </DialogTitle>
          <DialogDescription>
            Generate financial reports quickly using Cmd+R shortcut.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Type Selection */}
          <div className="space-y-3">
            <label className="font-medium text-sm">Report Type</label>
            <div className="grid gap-3">
              {reportTypes.map((type) => (
                <Card
                  key={type.value}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    reportType === type.value
                      ? 'bg-primary/5 ring-2 ring-primary'
                      : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setReportType(type.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        {type.icon}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">{type.label}</h4>
                        <p className="text-muted-foreground text-sm">
                          {type.description}
                        </p>
                      </div>
                      <div className="flex h-4 w-4 items-center justify-center">
                        {reportType === type.value && (
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Period Selection */}
          <div className="space-y-3">
            <label className="font-medium text-sm">Time Period</label>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger>
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                {periods.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateReport}
            disabled={!(reportType && period) || isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Generating Report...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Generate Report
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
