import { Input } from './ui/input'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { toast } from 'sonner'
import { useState } from 'react'

interface SalaryInputProps {
  onCalculate: (salary: number) => void
}

export function SalaryInput({ onCalculate }: SalaryInputProps) {
  const [salary, setSalary] = useState('')
  const handleCalculate = () => {
    const salaryValue = Number(salary)
    if (salaryValue <= 0) {
      toast.error('Please enter a valid salary amount greater than zero')
      return
    }
    onCalculate(salaryValue)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Enter Monthly Salary</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          type="number"
          min="0.01"
          step="0.01"
          value={salary}
          onChange={(e) => setSalary(e.target.value)}
          placeholder="Enter your salary"
          required
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleCalculate} className="w-full mt-4">
          Calculate Distribution
        </Button>
      </CardFooter>
    </Card>
  )
}
