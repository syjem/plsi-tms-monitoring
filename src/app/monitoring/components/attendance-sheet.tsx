"use client";

import type { AttendanceData, AttendanceRow, Logs } from "@/types";
import { toast } from "sonner";
import { useState } from "react";
import { CheckCheck, Edit } from "lucide-react";
import { isRowEmpty } from "@/utils/is-row-empty";
import TableRow from "@/app/monitoring//components/table-row";
import TableHead from "@/app/monitoring//components/table-head";
import { updateWorkLog } from "@/app/actions/logs/update-work-log";
import { SheetFooter } from "@/app/monitoring/components/sheet-footer";
import { SheetControls } from "@/app/monitoring/components/sheet-controls";

export default function AttendanceSheet({
  engineers,
  workLogs,
}: {
  engineers: {
    id: number;
    field_number: number;
    name: string;
    title: string;
  }[];
  workLogs: Logs | null;
}) {
  const [isEditable, setIsEditable] = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null);

  const [attendanceData, setAttendanceData] = useState<AttendanceData>(() => {
    if (workLogs?.logs && workLogs.logs.length > 0) {
      return workLogs.logs;
    }
    // Default empty groups if no initial data - 40 single-row
    return Array.from({ length: 40 }, () => [
      {
        date: "",
        day: "",
        sched: "",
        timeIn: "",
        timeOut: "",
        destination: "",
        remarks: "",
        signature: "",
      },
    ]);
  });

  const updateCell = (
    groupIndex: number,
    rowIndex: number,
    field: keyof AttendanceRow,
    value: string
  ) => {
    if (!isEditable) return;

    setAttendanceData((prev) =>
      prev.map((group, gIndex) =>
        gIndex === groupIndex
          ? group.map((row, rIndex) =>
              rIndex === rowIndex ? { ...row, [field]: value } : row
            )
          : group
      )
    );
  };

  const saveSheet = async () => {
    const toastId = toast.loading("Saving attendance sheet...");

    try {
      if (workLogs) {
        const { success, error } = await updateWorkLog(
          workLogs.id,
          attendanceData
        );

        if (!success) {
          toast.error(error);
          return;
        }

        toast.success("Attendance sheet saved!", {
          id: toastId,
          icon: <CheckCheck className="h-4 w-4" />,
        });
      }
      setIsEditable(false);
    } catch (error) {
      console.error(error);
      toast.error("Failed to save attendance sheet.", { id: toastId });
    } finally {
      setTimeout(() => toast.dismiss(toastId), 1500);
    }
  };

  const enableEditing = () => {
    setIsEditable(true);
    toast.warning("Edit mode enabled", {
      icon: <Edit className="h-4 w-4" />,
    });
  };

  const addRowToGroup = (groupIndex: number) => {
    if (!isEditable) return;

    // Count non-empty rows across all groups
    const nonEmptyRowsCount = attendanceData.reduce((total, group) => {
      return total + group.filter((row) => !isRowEmpty(row)).length;
    }, 0);

    // Check if we're at capacity (all 40 rows filled with data)
    if (nonEmptyRowsCount >= 40) {
      toast.error("Cannot add row - all 40 rows are filled with data");
      return;
    }

    // Find empty groups at the end to remove
    let emptyGroupsFromEnd = 0;
    for (let i = attendanceData.length - 1; i >= 0; i--) {
      const group = attendanceData[i];
      if (group.length === 1 && isRowEmpty(group[0])) {
        emptyGroupsFromEnd++;
      } else {
        break;
      }
    }

    if (emptyGroupsFromEnd === 0) {
      toast.error("Cannot add row - no empty rows available to remove");
      return;
    }

    // copy of previous data for undo
    const prevData = structuredClone(attendanceData);

    // update the state
    setAttendanceData((prev) => {
      const newData = [...prev];

      // Add completely empty row to the specified group
      newData[groupIndex] = [
        ...newData[groupIndex],
        {
          date: "",
          day: "",
          sched: "",
          timeIn: "",
          timeOut: "",
          destination: "",
          remarks: "",
          signature: "",
        },
      ];

      // Remove one empty group from the end to maintain 40 total rows
      newData.pop();

      return newData;
    });
    toast.warning("You added a row..", {
      action: {
        label: "Undo",
        onClick: () => {
          setAttendanceData(prevData);
          toast.success("You removed the added row");
        },
      },
    });
  };

  return (
    <div className="min-h-screen bg-white dark:print:bg-white dark:print:text-black dark:bg-slate-900 dark:text-gray-200 px-8 py-8 md:py-16 shadow-lg print:shadow-none print:px-4 print:py-12">
      <header className="text-center mb-10 print:mb-8 space-y-2 dark:text-gray-50 dark:print:text-gray-950">
        <h1 className="text-3xl font-bold">Phillogix Systems Inc.</h1>
        <h2 className="text-xl font-semibold">
          Employee Monitoring Attendance Sheet
        </h2>
      </header>

      <SheetControls
        isEditable={isEditable}
        saveSheet={saveSheet}
        enableEditing={enableEditing}
      />

      <div className="mb-4 mx-auto max-w-4xl print:max-w-[700px]">
        <table className="w-full border-collapse text-xs overflow-auto">
          <TableHead />
          <tbody>
            {attendanceData.map((group, groupIndex) =>
              group.map((row, rowIndex) => {
                const isHighlighted = hoveredGroup === groupIndex;
                const isFirstRowInGroup = rowIndex === 0;
                const isRowNotEmpty = !isRowEmpty(row);

                return (
                  <TableRow
                    key={groupIndex - rowIndex}
                    groupIndex={groupIndex}
                    row={row}
                    rowIndex={rowIndex}
                    isEditable={isEditable}
                    isHighlighted={isHighlighted}
                    isFirstRowInGroup={isFirstRowInGroup}
                    isRowNotEmpty={isRowNotEmpty}
                    setHoveredGroup={setHoveredGroup}
                    addRowToGroup={addRowToGroup}
                    updateCell={updateCell}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <SheetFooter isEditable={isEditable} engineers={engineers} />
    </div>
  );
}
