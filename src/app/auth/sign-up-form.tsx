'use client'

import { Loader2 } from 'lucide-react'
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

export type SignUpFormProps = {
  onSignUpWithEmailSuccess: () => void
  onHandleSignIn: () => void
}

export function SignUpForm({ onHandleSignIn }: SignUpFormProps) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPending, setIsPending] = useState(false)
  const [isSignUpping, setIsSignUpping] = useState(false)

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      toast.error('Senhas não coincidem')
      return
    }

    await authClient.signUp.email(
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
          onHandleSignIn()
        },
        onError: (ctx) => {
          toast.error('Error creating account', {
            description: ctx.error.message,
          })
          setIsPending(false)
        },
      }
    )
  }

  const handleSignUpWithGoogle = async (e: React.FormEvent) => {
    e.preventDefault()
    await authClient.signIn.social(
      {
        provider: 'google',
      },
      {
        onRequest: () => {
          setIsSignUpping(true)
        },
        onError: (ctx) => {
          toast.error('Erro ao criar conta', {
            description: ctx.error.message,
          })
          setIsSignUpping(false)
        },
      }
    )
  }

  return (
    <div className={'flex flex-col gap-6'}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Crie sua conta</CardTitle>
          <CardDescription>
            Registre-se com sua conta Google ou Email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSignUp}>
            <div className="grid gap-6">
              <div className="flex flex-col gap-4">
                <Button
                  className="w-full"
                  disabled={isPending || isSignUpping}
                  onClick={handleSignUpWithGoogle}
                  variant="outline"
                >
                  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Registrar com Google
                </Button>
              </div>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-border after:border-t">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Ou continuar com
                </span>
              </div>
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="email">Nome</Label>
                  <Input
                    disabled={isPending || isSignUpping}
                    id="nome"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome"
                    required
                    type="nome"
                    value={name}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    disabled={isPending || isSignUpping}
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
                    <Label htmlFor="password">Senha</Label>
                  </div>
                  <Input
                    disabled={isPending || isSignUpping}
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    type="password"
                    value={password}
                  />
                </div>
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="password">Confirmar senha</Label>
                  </div>
                  <Input
                    disabled={isPending || isSignUpping}
                    id="confirm-password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    type="confirm-password"
                    value={confirmPassword}
                  />
                </div>
                <Button
                  className="w-full"
                  disabled={isPending || isSignUpping}
                  type="submit"
                >
                  {isPending ? 'Registrando...' : 'Registrar'}
                  {isPending && <Loader2 className="size-4 animate-spin" />}
                </Button>
              </div>
              <div className="text-center text-sm">
                Já tem uma conta?
                <Button
                  className="-ml-2.5"
                  disabled={isPending || isSignUpping}
                  onClick={onHandleSignIn}
                  type="button"
                  variant="link"
                >
                  Fazer login
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
}
