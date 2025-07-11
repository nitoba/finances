import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

export function UserSettingsFormLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-7 w-48 rounded-md" />
        <Skeleton className="mt-1 h-5 w-96 rounded-md" />
      </div>
      <Separator />
      <div className="space-y-8 sm:flex sm:items-center sm:space-x-8 sm:space-y-0">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="h-9 w-36 rounded-md" />
        </div>
        <div className="flex-1 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-5 w-16 rounded-md" />
            <Skeleton className="h-10 w-full max-w-md rounded-md" />
            <Skeleton className="h-4 w-64 rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-5 w-28 rounded-md" />
            <Skeleton className="h-10 w-full max-w-md rounded-md" />
            <Skeleton className="h-4 w-80 rounded-md" />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
    </div>
  )
}
