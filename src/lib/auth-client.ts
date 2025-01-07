import { createAuthClient } from 'better-auth/react'
export const authClient = createAuthClient({
  // Get this url dynamically from the server
  baseURL: 'http://localhost:3000',
})
