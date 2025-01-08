import { authClient } from '@/lib/auth-client'
import { User } from 'better-auth'

type CurrentUser = User & {
  monthlySalary: number | null
}

export function useUser() {
  const { data, ...rest } = authClient.useSession()

  return {
    user: data?.user as CurrentUser | null | undefined,
    ...rest,
  }
}
