'use client'

import { handleSignOut } from '@/lib/auth/actions.client'
import { useRouter } from 'next/navigation'
import { PropsWithChildren } from 'react'

export function SignOutButton({ children }: PropsWithChildren) {
  const router = useRouter()

  const onHandleSignOut = async () => {
    const { error } = await handleSignOut()

    if (!error) {
      router.push('/auth?type=signin')
    }
  }

  return <div onClick={onHandleSignOut}>{children}</div>
}
