import { betterAuth } from 'better-auth'
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
  }),
})
