"use client";

import { WorkLogs } from "@/types";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatISODate } from "@/utils/format-date";
import { useRouter } from "next/navigation";
import { Ellipsis } from "lucide-react";

function FileManager({ logs }: { logs: WorkLogs[] }) {
  const router = useRouter();

  return (
    <section className="relative rounded-lg border bg-white p-8 transition-all duration-500 border-gray-300 hover:border-gray-400 hover:shadow-md">
      <Table>
        <TableCaption>A list of your recent extracted daily logs.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Date</TableHead>
            <TableHead>Last modified</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow
              key={log.id}
              className="cursor-pointer py-5"
              onClick={() => router.push(`/monitoring?date=${log.date}`)}
            >
              <TableCell className="font-medium">{log.date}</TableCell>
              <TableCell>{formatISODate(log.updated_at)}</TableCell>
              <TableCell className="flex items-center justify-center rounded-full py-2 px-1">
                <Ellipsis className="size-4" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
}

export default FileManager;
