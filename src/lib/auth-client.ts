import { createAuthClient } from 'better-auth/react'

const baseURL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000'

export const authClient = createAuthClient({
  // Get this url dynamically from the server
  baseURL,
})
