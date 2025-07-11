import { useQuery, useQueryClient } from '@tanstack/react-query'
import type { User } from 'better-auth'
import { authClient } from '@/lib/auth-client'

export type CurrentUser = User & {
  monthlySalary: number | null
}

export function useUser() {
  const queryClient = useQueryClient()

  const {
    data: user,
    isLoading: isPending,
    ...rest
  } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const session = await authClient.getSession()

      if (!session) {
        return null
      }

      return session.data?.user as CurrentUser
    },
  })

  async function updateInfoInfo() {
    queryClient.invalidateQueries({ queryKey: ['user-profile'] })
  }

  return {
    ...rest,
    user,
    updateInfoInfo,
    isPending,
  }
}
