"use client";

import {
  CheckCheck,
  CircleAlert,
  Ellipsis,
  FolderKanban,
  FolderX,
  Loader,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Logs } from "@/types";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatISODate } from "@/utils/format-date";
import { deleteWorkLog } from "@/app/actions/delete-work-log";
import { EmptyFileManager } from "@/components/file-manager-empty";

function FileManager({ logs }: { logs: Logs[] }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const deleteLogHandler = async (id: string) => {
    const toastId = toast.warning("Deleting log...", {
      icon: <Loader className="h-4 w-4 animate-spin" />,
    });

    try {
      const response = await deleteWorkLog(id);

      if (!response.success) {
        toast.error(response.error, {
          id: toastId,
          icon: <CircleAlert className="h-4 w-4" />,
        });
        return;
      }

      toast.success(response.message, {
        id: toastId,
        icon: <CheckCheck className="h-4 w-4" />,
      });
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("An error has occurred, please try again!", {
        id: toastId,
        icon: <CircleAlert className="h-4 w-4" />,
      });
    }
  };

  return (
    <section className="rounded-lg border-2 border-dashed bg-white transition-all duration-500 border-gray-300 hover:border-gray-400 hover:shadow-md">
      {logs && logs.length === 0 ? (
        <EmptyFileManager visible={visible} />
      ) : (
        <div
          className={cn(
            "p-6 transition-all duration-500 ease-out",
            visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
        >
          <Table>
            <TableCaption>Your recent logs</TableCaption>
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
                          onClick={() => router.push(`/monitoring/${log.id}`)}
                        >
                          <FolderKanban />
                          View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => deleteLogHandler(log.id)}
                        >
                          <FolderX />
                          Delete
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
