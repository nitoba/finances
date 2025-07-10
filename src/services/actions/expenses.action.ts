/* eslint-disable @typescript-eslint/no-unused-vars */
'use server'

import { currentUser } from '@/lib/auth/current-session.server'
import { db } from '@/lib/db/db'
import { expenses } from '@/lib/db/schemas/expenses-schema'
import { expenseSchema } from '@/schemas/expense.schema'
import dayjs from 'dayjs'
import { and, eq, gt, lt } from 'drizzle-orm'
import { z } from 'zod'

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

    return expensesFromDb.map((exp) => ({
      ...exp,
      isRecurring: Boolean(exp.isRecurring),
      createdAt: dayjs(exp.createdAt).toDate(),
      updatedAt: dayjs(exp.updatedAt).toDate(),
    }))
  }
)

export const createNewExpenseAction = createServerAction()
  .input(expenseSchema.omit({ id: true }))
  .handler(async ({ input: { ...input } }) => {
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

    return expenseFromDb[0]
  })

export const updateExpenseAction = createServerAction()
  .input(expenseSchema)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  .handler(async ({ input: { ...input } }) => {
    const user = await currentUser()
    if (!user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Not authorized')
    }
    const updatedExpense = await db
      .update(expenses)
      .set({ ...input })
      .where(and(eq(expenses.id, input.id), eq(expenses.userId, user.id)))
      .returning()

    return updatedExpense[0]
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

export const getExpensesByMonthAction = createServerAction()
  .input(
    z.object({
      month: z.string(),
    })
  )
  .handler(async ({ input }) => {
    const user = await currentUser()
    if (!user) {
      throw new ZSAError('NOT_AUTHORIZED', 'Not authorized')
    }

    // Calcula as datas
    const startDate = dayjs(input.month).startOf('month').toDate()
    const endDate = dayjs(input.month).endOf('month').toDate()

    try {
      // Consulta ao banco
      const expensesFromDb = await db
        .select()
        .from(expenses)
        .where(
          and(
            eq(expenses.userId, user.id),
            gt(expenses.createdAt, startDate),
            lt(expenses.createdAt, endDate)
          )
        )

      return expensesFromDb
    } catch (error) {
      // Lida com erros do banco ou outros
      console.error('Error fetching expenses:', error)
      throw new ZSAError('INTERNAL_SERVER_ERROR', 'Failed to fetch expenses')
    }
  })
