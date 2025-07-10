'use client'

import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { authClient } from '@/lib/auth-client'

type Props = {
  onHandleSignUp: () => void
}

export function SignInForm({ onHandleSignUp }: Props) {
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
      }
    )
  }

  const handleSignInWithGoogle = async () => {
    await authClient.signIn.social(
      {
        provider: 'google',
      },
      {
        onRequest: () => {
          setIsPending(true)
        },
        onError: (ctx) => {
          toast.error('Error signing in', {
            description: ctx.error.message,
          })
          setIsPending(false)
        },
      }
    )
  }

  return (
    <div className={'flex flex-col gap-6'}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bem vindo de volta</CardTitle>
          <CardDescription>
            Entre com sua conta Google ou Email para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSignIn}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  className="w-full"
                  disabled={isPending}
                  onClick={handleSignInWithGoogle}
                  variant="outline"
                >
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Entrar com Google
                </Button>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Ou continuar com
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="m@example.com"
                    required
                    type="email"
                    value={email}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Password</Label>
                    <a
                      className="ml-auto text-sm underline-offset-4 hover:underline"
                      href="#"
                    >
                      Esqueceu sua senha?
                    </a>
                  </div>
                  <Input
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type="password"
                    value={password}
                  />
                </div>
                <Button className="w-full" type="submit">
                  {isPending ? 'Entrando...' : 'Entrar'}
                  {isPending && <Loader2 className="size-4 animate-spin" />}
                </Button>
              </div>
              <div className="text-center text-sm">
                Não tem uma conta?
                <Button
                  className="-ml-2.5"
                  onClick={onHandleSignUp}
                  variant="link"
                >
                  Registrar
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      {/* <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{' '}
        and <a href="#">Privacy Policy</a>.
      </div> */}
    </div>
  )

  // return (
  //   <form onSubmit={handleSignIn} className="space-y-4">
  //     <div className="space-y-2">
  //       <Label htmlFor="email">Email</Label>
  //       <Input
  //         id="email"
  //         type="email"
  //         placeholder="you@example.com"
  //         required
  //         value={email}
  //         onChange={(e) => setEmail(e.target.value)}
  //       />
  //     </div>
  //     <div className="space-y-2">
  //       <Label htmlFor="password">Password</Label>
  //       <Input
  //         id="password"
  //         type="password"
  //         required
  //         value={password}
  //         onChange={(e) => setPassword(e.target.value)}
  //       />
  //     </div>
  //     <Button type="submit" className="w-full" disabled={isPending}>
  //       {isPending ? 'Signing In...' : 'Sign In'}
  //       {isPending && <Loader2 className="animate-spin size-4" />}
  //     </Button>
  //   </form>
  // )
}
