import { authClient } from '../auth-client'

export async function handleSignOut() {
  return await authClient.signOut()
}
