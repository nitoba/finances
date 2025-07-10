import { sql } from 'drizzle-orm'
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core'
import type { ExpenseCategory } from '@/schemas/category.schema'
import { users } from './auth-schema'

export const expenses = sqliteTable('expenses', {
  id: text('id').primaryKey(),
  date: text('date').notNull(),
  description: text('description').notNull(),
  amount: real('amount').notNull(),
  category: text('category').$type<ExpenseCategory>().notNull(),
  isRecurring: integer('is_recurring')
    .$type<boolean>()
    .notNull()
    .default(sql`0`),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .$type<Date>()
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .$type<Date>()
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
})

// export const categoryBudget = sqliteTable('category_budgets', {
//   category: text('category').$type<ExpenseCategory>().primaryKey(),
//   planned: real('planned').notNull(),
//   spent: real('spent').notNull(),
//   percentage: real('percentage').notNull(),
// })

// export const salaryDistribution = sqliteTable('salary_distributions', {
//   essentials: real('essentials').notNull(),
//   leisure: real('leisure').notNull(),
//   investments: real('investments').notNull(),
//   knowledge: real('knowledge').notNull(),
//   emergency: real('emergency').notNull(),
// })
