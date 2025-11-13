"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { WorkLogs } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { formatISODate } from "@/utils/format-date";
import { Ellipsis, FolderKanban, FolderX } from "lucide-react";
import { EmptyFileManager } from "@/components/file-manager-empty";

function FileManager({ logs }: { logs: WorkLogs[] }) {
  const router = useRouter();

  return (
    <section className="rounded-lg border bg-white transition-all duration-500 border-gray-300 hover:border-gray-400 hover:shadow-md">
      {logs && logs.length === 0 ? (
        <EmptyFileManager />
      ) : (
        <div className="p-6">
          <h2 className="pb-5 font-medium">Recent Logs</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Date</TableHead>
                <TableHead>Last modified</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="font-medium">{log.date}</TableCell>
                  <TableCell>{formatISODate(log.updated_at)}</TableCell>

                  <TableCell className="flex items-center justify-center rounded-full p-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <Ellipsis className="size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(`/monitoring?date=${log.date}`)
                          }
                        >
                          <FolderKanban />
                          View log
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FolderX />
                          Delete log
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}

export default FileManager;
