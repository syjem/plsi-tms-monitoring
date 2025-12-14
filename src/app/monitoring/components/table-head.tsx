import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

export function CustomTableHead() {
  return (
    <TableHeader className="text-sm">
      <TableRow className="bg-gray-100 dark:bg-slate-900/80 dark:print:bg-gray-100 hover:bg-bg-gray-100 hover:dark:bg-slate-900/80">
        <TableHead className="dark:print:text-gray-900 text-center font-semibold border border-black dark:border-gray-500 py-1 px-2 w-16">
          Date
        </TableHead>
        <TableHead className="dark:print:text-gray-900 text-center font-semibold border border-black dark:border-gray-500 py-1 px-2 w-8">
          Day
        </TableHead>
        <TableHead className="dark:print:text-gray-900 text-center font-semibold border border-black dark:border-gray-500 p-1 w-4">
          Sched
        </TableHead>
        <TableHead className="dark:print:text-gray-900 text-center font-semibold border border-black dark:border-gray-500 py-1 px-2 w-24">
          Time-in
        </TableHead>
        <TableHead className="dark:print:text-gray-900 text-center font-semibold border border-black dark:border-gray-500 py-1 px-2 w-24">
          Time-out
        </TableHead>
        <TableHead className="dark:print:text-gray-900 text-center font-semibold border border-black  dark:border-gray-500 py-1 px-2 w-44">
          Destination
        </TableHead>
        <TableHead className="dark:print:text-gray-900 text-center font-semibold border border-black dark:border-gray-500 py-1 px-2 w-40">
          Remarks
        </TableHead>
        <TableHead className="dark:print:text-gray-900 text-center font-semibold border border-black dark:border-gray-500 py-1 px-2 w-12">
          Signature
        </TableHead>
      </TableRow>
    </TableHeader>
  );
}
