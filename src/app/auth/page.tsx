'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { SignInForm } from './sign-in-form'
import { SignUpForm } from './sign-up-form'

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{isSignIn ? 'Sign In' : 'Sign Up'}</CardTitle>
          <CardDescription>
            {isSignIn
              ? 'Enter your credentials to access your account'
              : 'Create a new account to get started'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSignIn ? (
            <SignInForm />
          ) : (
            <SignUpForm
              onSuccess={() => {
                setIsSignIn(true)
              }}
            />
          )}
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsSignIn(!isSignIn)}
              className="text-sm text-blue-600 hover:underline"
            >
              {isSignIn
                ? "Don't have an account? Sign Up"
                : 'Already have an account? Sign In'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
