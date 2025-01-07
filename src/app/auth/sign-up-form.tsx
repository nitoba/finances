'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export type SignUpFormProps = {
  onSuccess: () => void
}

export function SignUpForm({ onSuccess }: SignUpFormProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPending, setIsPending] = useState(false)

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data } = await authClient.signUp.email(
      {
        name,
        email,
        password,
      },
      {
        onRequest: () => {
          setIsPending(true)
        },
        onSuccess: () => {
          // redirect to the dashboard
          toast.success('Account created successfully!')
          onSuccess()
        },
        onError: (ctx) => {
          toast.error('Error creating account', {
            description: ctx.error.message,
          })
          setIsPending(false)
        },
      },
    )

    console.log(data)
  }

  return (
    <form onSubmit={signUp} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="John Doe"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Signing Up...' : 'Sign Up'}
        {isPending && <Loader2 className="animate-spin size-4" />}
      </Button>
    </form>
  )
}
