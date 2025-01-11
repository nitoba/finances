import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function TableLoading() {
  return (
    <div className="rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            {Array.from({ length: 5 }).map((_, index) => (
              <TableHead key={index} className="text-center">
                <Skeleton className="h-6 w-24 mx-auto" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: 5 }).map((_, cellIndex) => (
                <TableCell key={cellIndex} className="text-center">
                  <Skeleton className="h-6 w-24 mx-auto" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
