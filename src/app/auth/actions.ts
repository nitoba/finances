'use server'

import { authClient } from '@/lib/auth-client'

export async function signIn(formData: FormData) {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const email = formData.get('email')
  const password = formData.get('password')
}

export async function signUp(formData: FormData) {
  // Simular um atraso de rede
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const email = formData.get('email')
  const password = formData.get('password')
  const confirmPassword = formData.get('confirmPassword')

  // Aqui você implementaria a lógica real de criação de conta
  if (password !== confirmPassword) {
    return { success: false, message: 'Passwords do not match' }
  }

  // Simular criação de conta bem-sucedida
  return { success: true, message: 'Account created successfully!' }
}
