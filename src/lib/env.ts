import { config } from 'dotenv'
import { z } from 'zod'
config()

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DATABASE_AUTH_TOKEN: z.string().min(1),
})

export type Env = z.infer<typeof envSchema>

export const env = envSchema.parse(process.env)
