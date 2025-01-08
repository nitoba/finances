'use server'

import { db } from '@/lib/db/db'
import { users } from '@/lib/db/schemas/auth-schema'
import { eq } from 'drizzle-orm'
import { createServerAction, ZSAError } from 'zsa'
import z from 'zod'
import { currentUser } from '@/lib/auth/current-session.server'

export const saveSalaryAction = createServerAction()
  .input(
    z.object({
      salary: z.number(),
    }),
  )
  .handler(async ({ input }) => {
    const user = await currentUser()

    if (!user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Not authorized')
    }

    await db
      .update(users)
      .set({ monthlySalary: input.salary })
      .where(eq(users.id, user.id))

    return {
      salary: input.salary,
    }
  })

export const getSalaryAction = createServerAction().handler(async () => {
  const user = await currentUser()
  if (!user) {
    throw new ZSAError('NOT_AUTHORIZED', 'Not authorized')
  }
  const salary = await db.query.users.findFirst({
    where: eq(users.id, user.id),
    columns: {
      monthlySalary: true,
    },
  })

  return salary?.monthlySalary
})
