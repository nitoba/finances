'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { SignInForm } from './sign-in-form'
import { SignUpForm } from './sign-up-form'

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-5">
      <Card className="w-full max-w-md">
        <CardContent>
          {isSignIn ? (
            <SignInForm onHandleSignUp={() => setIsSignIn(false)} />
          ) : (
            <SignUpForm
              onSignUpWithEmailSuccess={() => {
                setIsSignIn(true)
              }}
              onHandleSignIn={function (): void {
                setIsSignIn(true)
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
