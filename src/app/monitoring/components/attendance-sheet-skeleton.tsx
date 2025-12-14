import { CustomTableHead } from '@/app/monitoring//components/table-head';
import { AttendanceSheetHeader } from '@/app/monitoring/components/attendance-sheet-header';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

export function AttendanceSheetSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:print:bg-white dark:print:text-black dark:bg-slate-900 dark:text-gray-200 px-8 py-8 md:py-16 shadow-lg print:shadow-none print:px-4 print:py-12">
      <AttendanceSheetHeader />
      <div className="mb-4 mx-auto max-w-4xl print:max-w-[700px]">
        <Table>
          <CustomTableHead />
          <TableBody>
            {Array.from({ length: 40 }).map((_, index) => (
              <TableRow key={index} className="space-y-1">
                <TableCell className="border border-black dark:border-gray-500 p-0">
                  <Skeleton className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded-none" />
                </TableCell>
                <TableCell className="border border-black dark:border-gray-500 p-0">
                  <Skeleton className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded-none" />
                </TableCell>
                <TableCell className="border border-black dark:border-gray-500 p-0">
                  <Skeleton className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded-none" />
                </TableCell>
                <TableCell className="border border-black dark:border-gray-500 p-0">
                  <Skeleton className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded-none" />
                </TableCell>
                <TableCell className="border border-black dark:border-gray-500 p-0">
                  <Skeleton className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded-none" />
                </TableCell>
                <TableCell className="border border-black dark:border-gray-500 p-0">
                  <Skeleton className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded-none" />
                </TableCell>
                <TableCell className="border border-black dark:border-gray-500 p-0">
                  <Skeleton className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded-none" />
                </TableCell>
                <TableCell className="border border-black dark:border-gray-500 p-0">
                  <Skeleton className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded-none" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
