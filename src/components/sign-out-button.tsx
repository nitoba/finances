'use client'

import { handleSignOut } from '@/lib/auth/actions.client'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'

type Props = {
  children: React.ReactNode
  className?: string
}

export function SignOutButton({ children, className }: Props) {
  const router = useRouter()

  const onHandleSignOut = async () => {
    const { error } = await handleSignOut()

    if (!error) {
      router.push('/auth?type=signin')
    }
  }

  return (
    <div className={cn(className)} onClick={onHandleSignOut}>
      {children}
    </div>
  )
}
