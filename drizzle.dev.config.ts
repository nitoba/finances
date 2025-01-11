import { defineConfig } from 'drizzle-kit'
import { env } from './src/lib/env'

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/lib/db/schemas/*',
  out: './src/lib/db/migrations',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
