"use client";

import { toast } from "sonner";
import { Footer } from "@/components/footer";
import { useEffect, useState } from "react";
import TableRow from "@/components/table-row";
import TableHead from "@/components/table-head";
import { isRowEmpty } from "@/utils/is-row-empty";
import { processData } from "@/utils/process-data";
import { SheetControls } from "@/components/sheet-controls";
import type { AttendanceData, AttendanceRow, Employee } from "@/types";

export default function AttendanceSheet() {
  const [isEditable, setIsEditable] = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null);

  const [employee, setEmployee] = useState<Employee>({
    id: "",
    name: "",
  });
  const [attendanceData, setAttendanceData] = useState<AttendanceData>(() => {
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

  useEffect(() => {
    const savedAttendanceData = localStorage.getItem("attendanceData");
    if (savedAttendanceData) {
      const parsed = JSON.parse(savedAttendanceData);
      const logs = parsed?.logs ?? [];
      const parsedEmployee = parsed?.employee ?? {};
      setEmployee(parsedEmployee);
      setAttendanceData(processData(logs));
    }
  }, []);

  const saveSheet = () => {
    setIsEditable(false);
    toast.info("Saved");
  };

  const enableEditing = () => {
    setIsEditable(true);
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
      <header className="text-center mb-10 print:mb-8">
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

      <Footer isEditable={isEditable} employee={employee} />
    </div>
  );
}
