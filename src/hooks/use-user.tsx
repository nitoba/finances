import { authClient } from '@/lib/auth-client'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { User } from 'better-auth'

type CurrentUser = User & {
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

      console.log(session.data?.user)

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
