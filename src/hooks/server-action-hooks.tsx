import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import {
  createServerActionsKeyFactory,
  setupServerActionHooks,
} from 'zsa-react-query'

export const QueryKeyFactory = createServerActionsKeyFactory({
  expenses: () => ['expenses'],
  salary: () => ['salary'],
  previousExpenses: (previousMonth: string) => [
    'previous-expenses',
    previousMonth,
  ],
})

const {
  useServerActionQuery,
  useServerActionMutation,
  useServerActionInfiniteQuery,
} = setupServerActionHooks({
  hooks: {
    useQuery,
    useMutation,
    useInfiniteQuery,
  },
  queryKeyFactory: QueryKeyFactory,
})

export {
  useServerActionInfiniteQuery,
  useServerActionMutation,
  useServerActionQuery,
}
