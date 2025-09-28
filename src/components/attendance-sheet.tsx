"use client";

import { useState } from "react";
import { Plus, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import type {
  AttendanceData,
  AttendanceRow,
  AttendanceSheetProps,
} from "@/types";
import { cn, isRowEmpty, processApiData, toTitleCase } from "@/lib/utils";
import { toast } from "sonner";

export default function AttendanceSheet({
  initialData,
  employee,
}: AttendanceSheetProps) {
  const [isEditable, setIsEditable] = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null);

  const [attendanceData, setAttendanceData] = useState<AttendanceData>(() => {
    if (initialData && initialData.length > 0) {
      return processApiData(initialData);
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
    console.log(attendanceData);
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
      <div className="text-center mb-2 print:mb-8">
        <h1 className="text-3xl font-bold">Phillogix Systems Inc.</h1>
        <h2 className="text-xl font-semibold">
          Employee Monitoring Attendance Sheet
        </h2>
      </div>

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
          <thead className="text-sm">
            <tr className="bg-gray-100">
              <th className="font-semibold border border-black p-2 print:p-1 w-16">
                Date
              </th>
              <th className="font-semibold border border-black p-2 print:p-1 w-8">
                Day
              </th>
              <th className="font-semibold border border-black p-2 print:p-1 w-4">
                Sched
              </th>
              <th className="font-semibold border border-black p-2 print:p-1 w-24">
                Time-in
              </th>
              <th className="font-semibold border border-black p-2 print:p-1 w-24">
                Time-out
              </th>
              <th className="font-semibold border border-black p-2 print:p-1 w-44">
                Destination
              </th>
              <th className="font-semibold border border-black p-2 print:p-1 w-32">
                Remarks
              </th>
              <th className="font-semibold border border-black p-2 print:p-1 w-16">
                Signature
              </th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.map((group, groupIndex) =>
              group.map((row, rowIndex) => {
                const isHighlighted = hoveredGroup === groupIndex;
                const isFirstRowInGroup = rowIndex === 0;
                const isRowNotEmpty = !isRowEmpty(row);

                return (
                  <tr
                    key={groupIndex - rowIndex}
                    className={cn(
                      "h-8 print:h-4.5 transition-colors duration-150",
                      isEditable && isHighlighted && "bg-blue-100"
                    )}
                    onMouseEnter={() => setHoveredGroup(groupIndex)}
                    onMouseLeave={() => setHoveredGroup(null)}
                  >
                    <td className="relative border border-black px-1">
                      {isEditable &&
                        isHighlighted &&
                        isFirstRowInGroup &&
                        isRowNotEmpty &&
                        (row.sched !== "X" || row.remarks !== "DAY OFF") && (
                          <Button
                            size="icon"
                            className="absolute -left-[37px] -top-1"
                            onClick={() => addRowToGroup(groupIndex)}
                          >
                            <Plus />
                          </Button>
                        )}
                      <input
                        type="text"
                        value={row.date}
                        onChange={(e) =>
                          updateCell(
                            groupIndex,
                            rowIndex,
                            "date",
                            e.target.value
                          )
                        }
                        className={cn(
                          "w-full h-full border-none outline-none bg-transparent text-xs print:text-[10px] uppercase",
                          isEditable
                            ? "cursor-text"
                            : "cursor-default text-center"
                        )}
                        readOnly={!isEditable}
                      />
                    </td>
                    <td className="border border-black px-1">
                      <input
                        type="text"
                        value={row.day}
                        onChange={(e) =>
                          updateCell(
                            groupIndex,
                            rowIndex,
                            "day",
                            e.target.value
                          )
                        }
                        className={cn(
                          "w-full h-full border-none outline-none bg-transparent text-xs print:text-[10px] uppercase",
                          isEditable
                            ? "cursor-text"
                            : "cursor-default text-center",
                          (row.sched === "X" || row.remarks === "DAY OFF") &&
                            "text-red-500"
                        )}
                        readOnly={!isEditable}
                      />
                    </td>
                    <td className="border border-black px-1">
                      <input
                        type="text"
                        value={row.sched}
                        onChange={(e) =>
                          updateCell(
                            groupIndex,
                            rowIndex,
                            "sched",
                            e.target.value
                          )
                        }
                        className={cn(
                          "w-full h-full border-none outline-none bg-transparent text-xs uppercase",
                          isEditable
                            ? "cursor-text"
                            : "cursor-default text-center",
                          row.sched === "X" && "text-red-500"
                        )}
                        readOnly={!isEditable}
                      />
                    </td>
                    <td className="border border-black px-1">
                      <input
                        type="text"
                        value={row.timeIn}
                        onChange={(e) =>
                          updateCell(
                            groupIndex,
                            rowIndex,
                            "timeIn",
                            e.target.value
                          )
                        }
                        className={cn(
                          "w-full h-full border-none outline-none bg-transparent text-xs uppercase",
                          isEditable
                            ? "cursor-text"
                            : "cursor-default text-center"
                        )}
                        readOnly={!isEditable}
                      />
                    </td>
                    <td className="border border-black px-1">
                      <input
                        type="text"
                        value={row.timeOut}
                        onChange={(e) =>
                          updateCell(
                            groupIndex,
                            rowIndex,
                            "timeOut",
                            e.target.value
                          )
                        }
                        className={cn(
                          "w-full h-full border-none outline-none bg-transparent text-xs uppercase",
                          isEditable
                            ? "cursor-text"
                            : "cursor-default text-center"
                        )}
                        readOnly={!isEditable}
                      />
                    </td>
                    <td className="border border-black px-1">
                      <input
                        type="text"
                        value={row.destination}
                        onChange={(e) =>
                          updateCell(
                            groupIndex,
                            rowIndex,
                            "destination",
                            e.target.value
                          )
                        }
                        className={cn(
                          "w-full h-full border-none outline-none bg-transparent text-xs uppercase",
                          isEditable
                            ? "cursor-text"
                            : "cursor-default text-center"
                        )}
                        readOnly={!isEditable}
                      />
                    </td>
                    <td className="border border-black px-1">
                      <input
                        type="text"
                        value={row.remarks}
                        onChange={(e) =>
                          updateCell(
                            groupIndex,
                            rowIndex,
                            "remarks",
                            e.target.value
                          )
                        }
                        className={cn(
                          "w-full h-full border-none outline-none bg-transparent text-xs uppercase",
                          isEditable
                            ? "cursor-text"
                            : "cursor-default text-center",
                          row.remarks === "DAY OFF" && "text-red-500"
                        )}
                        readOnly={!isEditable}
                      />
                    </td>
                    <td className="border border-black px-1">
                      <input
                        type="text"
                        value={row.signature}
                        onChange={(e) =>
                          updateCell(
                            groupIndex,
                            rowIndex,
                            "signature",
                            e.target.value
                          )
                        }
                        className={cn(
                          "w-full h-full border-none outline-none bg-transparent text-xs uppercase",
                          isEditable
                            ? "cursor-text"
                            : "cursor-default text-center"
                        )}
                        readOnly={!isEditable}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-end mx-auto max-w-4xl print:max-w-[700px]">
        <div className="text-center px-4">
          <p className="text-2xl font-semibold print:text-xl">
            Ryan H. Batistil
          </p>
          <p className="text-sm text-gray-700">Systems Engineer</p>
        </div>
        <div className="text-center px-4">
          <p className="text-2xl capitalize font-semibold print:text-xl">
            {toTitleCase(employee)}
          </p>
          <p className="text-sm text-gray-700">Systems Engineer</p>
        </div>
      </div>
    </div>
  );
}
