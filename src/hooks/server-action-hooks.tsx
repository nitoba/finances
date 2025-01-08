import { useInfiniteQuery, useMutation, useQuery } from '@tanstack/react-query'
import {
  createServerActionsKeyFactory,
  setupServerActionHooks,
} from 'zsa-react-query'

export const QueryKeyFactory = createServerActionsKeyFactory({
  expenses: () => ['expenses'],
  salary: () => ['salary'],
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
