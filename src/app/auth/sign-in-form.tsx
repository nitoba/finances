'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/auth-client'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isPending, setIsPending] = useState(false)

  const { replace } = useRouter()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onRequest: () => {
          setIsPending(true)
        },
        onSuccess: () => {
          // redirect to dashboard
          toast.success('Signed in successfully!')
          replace('/dashboard')
        },
        onError: (ctx) => {
          toast.error('Error signing in', {
            description: ctx.error.message,
          })
          setIsPending(false)
        },
      },
    )
  }

  return (
    <form onSubmit={handleSignIn} className="space-y-4">
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
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? 'Signing In...' : 'Sign In'}
        {isPending && <Loader2 className="animate-spin size-4" />}
      </Button>
    </form>
  )
}
