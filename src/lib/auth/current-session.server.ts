import { betterFetch } from '@better-fetch/fetch'
import { auth } from '../auth' // path to your Better Auth server instance
import { headers } from 'next/headers'
import { NextRequest } from 'next/server'

export async function currentUser() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  })

  if (!session) {
    return null
  }

  return session.user
}

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return session
}
