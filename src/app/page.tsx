import { SalaryInput } from '@/components/salary-input'
import { SignOutButton } from '@/components/sign-out-button'
import { Button } from '@/components/ui/button'
import { currentUser } from '@/lib/auth/current-session.server'
import { redirect } from 'next/navigation'

export default async function Page() {
  const user = await currentUser()

  if (user?.monthlySalary && user?.monthlySalary > 0) {
    return redirect('/dashboard')
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <span className="text-4xl font-bold">Welcome to Finances</span>
      <SalaryInput />
      <SignOutButton>
        <Button className="w-28" variant="outline">
          Sair
        </Button>
      </SignOutButton>
    </div>
  )
}
