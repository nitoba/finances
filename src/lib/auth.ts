import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { db } from './db/db'
import * as schema from './db/schemas/auth-schema'

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
  },
  database: drizzleAdapter(db, {
    provider: 'sqlite', // or "mysql", "sqlite"
    schema,
    usePlural: true,
  }),
  user: {
    additionalFields: {
      monthlySalary: {
        type: 'number',
        required: false,
        input: false, // don't allow user to set role
      },
    },
  },
  plugins: [nextCookies()],
})
