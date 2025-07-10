import dayjs from 'dayjs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface MonthSelectorProps {
  selectedMonth: string
  onMonthChange: (month: string) => void
}

export function MonthSelector({
  selectedMonth,
  onMonthChange,
}: MonthSelectorProps) {
  const handleMonthChange = (month: string) => {
    onMonthChange(month)
  }

  const months = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setMonth(i)
    return date.toISOString().slice(0, 7)
  })

  return (
    <div className="mb-4">
      <label
        className="block font-medium text-gray-700 text-sm"
        htmlFor="month"
      >
        Select Month
      </label>
      <Select
        name="month"
        onValueChange={handleMonthChange}
        value={selectedMonth}
      >
        <SelectTrigger>
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((month) => (
            <SelectItem key={month} value={month}>
              {dayjs(month).format('MMMM YYYY')}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
