import { Card, CardContent, CardHeader } from './ui/card'
import { Skeleton } from './ui/skeleton'

export function LoadingDashboard() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24 rounded-md" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Skeleton className="h-8 w-24 rounded-md" />
                  <Skeleton className="h-4 w-16 ml-2 rounded-md" />
                </div>
                <Skeleton className="h-2 w-full rounded-full" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 rounded-md" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 rounded-md" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48 rounded-md" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-40 rounded-md" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
