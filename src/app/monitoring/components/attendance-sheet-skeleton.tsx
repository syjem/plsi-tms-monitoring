import TableHead from '@/app/monitoring//components/table-head';
import { AttendanceSheetHeader } from '@/app/monitoring/components/attendance-sheet-header';
import { Skeleton } from '@/components/ui/skeleton';

export function AttendanceSheetSkeleton() {
  return (
    <div className="min-h-screen bg-white dark:print:bg-white dark:print:text-black dark:bg-slate-900 dark:text-gray-200 px-8 py-8 md:py-16 shadow-lg print:shadow-none print:px-4 print:py-12">
      <AttendanceSheetHeader />
      <div className="mb-4 mx-auto max-w-4xl print:max-w-[700px]">
        <table className="w-full border-collapse text-xs overflow-auto">
          <TableHead />
          <tbody>
            {Array.from({ length: 40 }).map((_, index) => (
              <tr key={index} className="space-y-1">
                <td className="border border-black dark:border-gray-500">
                  <Skeleton className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded-none" />
                </td>
                <td className="border border-black dark:border-gray-500">
                  <Skeleton className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded-none" />
                </td>
                <td className="border border-black dark:border-gray-500">
                  <Skeleton className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded-none" />
                </td>
                <td className="border border-black dark:border-gray-500">
                  <Skeleton className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded-none" />
                </td>
                <td className="border border-black dark:border-gray-500">
                  <Skeleton className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded-none" />
                </td>
                <td className="border border-black dark:border-gray-500">
                  <Skeleton className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded-none" />
                </td>
                <td className="border border-black dark:border-gray-500">
                  <Skeleton className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded-none" />
                </td>
                <td className="border border-black dark:border-gray-500">
                  <Skeleton className="h-8 w-full bg-slate-200 dark:bg-slate-800 rounded-none" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
