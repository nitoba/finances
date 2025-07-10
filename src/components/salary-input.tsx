'use client'

import { useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { useServerAction } from 'zsa-react'
import { saveSalaryAction } from '@/services/actions/user.action'
import { Button } from './ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'

export function SalaryInput() {
  const { replace } = useRouter()
  const queryClient = useQueryClient()
  const { isPending, execute } = useServerAction(saveSalaryAction, {
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['salary'] })
      replace('/dashboard')
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
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle>Enter Monthly Salary</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          min="0.01"
          onChange={(e) => setSalary(e.target.value)}
          placeholder="Enter your salary"
          required
          step="0.01"
          type="number"
          value={salary}
        />
      </CardContent>
      <CardFooter>
        <Button className="mt-4 w-full" onClick={handleCalculate}>
          {isPending ? 'Calculating...' : 'Calculate'}
          {isPending && <Loader2 className="size-4 animate-spin" />}
        </Button>
      </CardFooter>
    </Card>
  )
}
