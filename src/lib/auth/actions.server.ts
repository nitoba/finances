import { headers } from 'next/headers'
import { auth } from '../auth'

export async function handleSignOut() {
  await auth.api.signOut({
    headers: await headers(),
  })
}
