'use server'

import { currentUser } from '@/lib/auth/current-session.server'
import { db } from '@/lib/db/db'
import { expenses } from '@/lib/db/schemas/expenses-schema'
import { expenseSchema } from '@/schemas/expense.schema'
import { and, eq } from 'drizzle-orm'

import { createServerAction, ZSAError } from 'zsa'

export const getExpensesFromUserAction = createServerAction().handler(
  async () => {
    const user = await currentUser()
    if (!user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Not authorized')
    }
    const expensesFromDb = await db.query.expenses.findMany({
      where: eq(expenses.userId, user.id),
    })

    return expensesFromDb
  },
)

export const createNewExpenseAction = createServerAction()
  .input(expenseSchema.omit({ id: true }))
  .handler(async ({ input }) => {
    const user = await currentUser()
    if (!user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Not authorized')
    }
    const expenseFromDb = await db
      .insert(expenses)
      .values({
        ...input,
        id: crypto.randomUUID(),
        userId: user.id,
      })
      .returning()

    return expenseFromDb
  })

export const updateExpenseAction = createServerAction()
  .input(expenseSchema)
  .handler(async ({ input }) => {
    const user = await currentUser()
    if (!user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Not authorized')
    }
    const updatedExpense = await db
      .update(expenses)
      .set(input)
      .where(and(eq(expenses.id, input.id), eq(expenses.userId, user.id)))
      .returning()

    return updatedExpense
  })

export const deleteExpenseAction = createServerAction()
  .input(expenseSchema.pick({ id: true }))
  .handler(async ({ input }) => {
    const user = await currentUser()
    if (!user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Not authorized')
    }
    await db
      .delete(expenses)
      .where(and(eq(expenses.id, input.id), eq(expenses.userId, user.id)))

    return { success: true }
  })
