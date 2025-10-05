"use client";

import { toast } from "sonner";
import { useState } from "react";
import { Printer } from "lucide-react";
import TableRow from "@/components/table-row";
import { Button } from "@/components/ui/button";
import TableHead from "@/components/table-head";
import type {
  AttendanceData,
  AttendanceRow,
  AttendanceSheetProps,
} from "@/types";
import { isRowEmpty, processInitialData, toTitleCase } from "@/lib/utils";

export default function AttendanceSheet({
  initialData,
  employee,
}: AttendanceSheetProps) {
  const [isEditable, setIsEditable] = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null);

  const [attendanceData, setAttendanceData] = useState<AttendanceData>(() => {
    if (initialData && initialData.length > 0) {
      return processInitialData(initialData);
    }

    // Default empty groups if no initial data - 40 single-row groups
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

  const saveSheet = () => {
    setIsEditable(false);
    toast.success("Monitoring sheet saved successfully!");
  };

  const enableEditing = () => {
    setIsEditable(true);
  };

  const handlePrint = () => {
    window.print();
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
  };

  return (
    <div className="bg-white px-8 py-16 shadow-lg print:shadow-none print:px-4 print:py-12">
      {/* Header */}
      <header className="text-center mb-2 print:mb-8">
        <h1 className="text-3xl font-bold">Phillogix Systems Inc.</h1>
        <h2 className="text-xl font-semibold">
          Employee Monitoring Attendance Sheet
        </h2>
      </header>

      <div className="mt-4 mb-2 text-right print:hidden mx-auto max-w-4xl">
        {isEditable ? (
          <Button onClick={saveSheet} className="w-[90px]">
            Save
          </Button>
        ) : (
          <div className="flex items-center justify-end space-x-4">
            <Button onClick={enableEditing} variant="link" className="">
              Edit
            </Button>
            <Button
              onClick={handlePrint}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600"
            >
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="mb-8 mx-auto max-w-4xl print:max-w-[700px]">
        <table className="w-full border-collapse border border-black text-xs">
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

      {/* Footer */}
      <footer className="flex justify-between items-end mx-auto max-w-4xl print:max-w-[700px]">
        <div className="text-center px-4">
          <p className="text-2xl font-semibold print:text-xl">
            Ryan H. Batistil
          </p>
          <p className="text-sm text-gray-700">Systems Engineer</p>
        </div>
        <div className="text-center px-4">
          <p className="text-2xl capitalize font-semibold print:text-xl">
            {toTitleCase(employee.name)}
          </p>
          <p className="text-sm text-gray-700">Systems Engineer</p>
        </div>
      </footer>
    </div>
  );
}
