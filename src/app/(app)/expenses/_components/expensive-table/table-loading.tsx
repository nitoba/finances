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
              <TableHead className="text-center" key={index}>
                <Skeleton className="mx-auto h-6 w-24" />
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 5 }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: 5 }).map((_, cellIndex) => (
                <TableCell className="text-center" key={cellIndex}>
                  <Skeleton className="mx-auto h-6 w-24" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
