'use client'

import { Input } from './ui/input'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { toast } from 'sonner'
import { useState } from 'react'
import { useServerAction } from 'zsa-react'
import { saveSalaryAction } from '@/services/actions/user.action'
import { Loader2 } from 'lucide-react'

interface SalaryInputProps {
  onCalculate: (salary: number) => void
}

export function SalaryInput({ onCalculate }: SalaryInputProps) {
  const { isPending, execute } = useServerAction(saveSalaryAction, {
    onSuccess: (res) => {
      onCalculate(res.data.salary)
    },
    onError: (error) => {
      toast.error(error.err.message)
    },
  })
  const [salary, setSalary] = useState('')

  const handleCalculate = async () => {
    const salaryValue = Number(salary)
    if (salaryValue <= 0) {
      toast.error('Please enter a valid salary amount greater than zero')
    }

    await execute({ salary: salaryValue })
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
          {isPending ? 'Calculating...' : 'Calculate'}
          {isPending && <Loader2 className="animate-spin size-4" />}
        </Button>
      </CardFooter>
    </Card>
  )
}
