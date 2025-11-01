"use client";

import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import type { AttendanceRow } from "@/types";
import React, { SetStateAction } from "react";
import { Button } from "@/components/ui/button";

type TableRowProps = {
  groupIndex: number;
  row: AttendanceRow;
  rowIndex: number;
  isEditable: boolean;
  isHighlighted: boolean;
  isFirstRowInGroup: boolean;
  isRowNotEmpty: boolean;
  setHoveredGroup: (value: SetStateAction<number | null>) => void;
  addRowToGroup: (groupIndex: number) => void;
  updateCell: (
    groupIndex: number,
    rowIndex: number,
    field: keyof AttendanceRow,
    value: string
  ) => void;
};

function TableRow({
  groupIndex,
  row,
  rowIndex,
  isEditable,
  isHighlighted,
  isFirstRowInGroup,
  isRowNotEmpty,
  setHoveredGroup,
  addRowToGroup,
  updateCell,
}: TableRowProps) {
  return (
    <tr
      className={cn(
        "h-8 print:h-4.5 transition-colors duration-150",
        isEditable && isHighlighted && "bg-blue-100"
      )}
      onMouseEnter={() => setHoveredGroup(groupIndex)}
      onMouseLeave={() => setHoveredGroup(null)}
    >
      <td className="relative border border-black px-1">
        {isEditable && isHighlighted && isFirstRowInGroup && isRowNotEmpty && (
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
            updateCell(groupIndex, rowIndex, "date", e.target.value)
          }
          className={cn(
            "w-full h-full border-none outline-none bg-transparent text-xs print:text-[10px] uppercase",
            isEditable ? "cursor-text" : "cursor-default text-center"
          )}
          readOnly={!isEditable}
        />
      </td>
      <td className="border border-black px-1">
        <input
          type="text"
          value={row.day}
          onChange={(e) =>
            updateCell(groupIndex, rowIndex, "day", e.target.value)
          }
          className={cn(
            "w-full h-full border-none outline-none bg-transparent text-xs print:text-[10px] uppercase",
            isEditable ? "cursor-text" : "cursor-default text-center"
          )}
          readOnly={!isEditable}
        />
      </td>
      <td className="border border-black px-1">
        <input
          type="text"
          value={row.sched}
          onChange={(e) =>
            updateCell(groupIndex, rowIndex, "sched", e.target.value)
          }
          className={cn(
            "w-full h-full border-none outline-none bg-transparent text-xs uppercase",
            isEditable ? "cursor-text" : "cursor-default text-center"
          )}
          readOnly={!isEditable}
        />
      </td>
      <td className="border border-black px-1">
        <input
          type="text"
          value={row.timeIn}
          onChange={(e) =>
            updateCell(groupIndex, rowIndex, "timeIn", e.target.value)
          }
          className={cn(
            "w-full h-full border-none outline-none bg-transparent text-xs uppercase",
            isEditable ? "cursor-text" : "cursor-default text-center"
          )}
          readOnly={!isEditable}
        />
      </td>
      <td className="border border-black px-1">
        <input
          type="text"
          value={row.timeOut}
          onChange={(e) =>
            updateCell(groupIndex, rowIndex, "timeOut", e.target.value)
          }
          className={cn(
            "w-full h-full border-none outline-none bg-transparent text-xs uppercase",
            isEditable ? "cursor-text" : "cursor-default text-center"
          )}
          readOnly={!isEditable}
        />
      </td>
      <td className="border border-black px-1">
        <input
          type="text"
          value={row.destination}
          onChange={(e) =>
            updateCell(groupIndex, rowIndex, "destination", e.target.value)
          }
          className={cn(
            "w-full h-full border-none outline-none bg-transparent text-xs uppercase",
            isEditable ? "cursor-text" : "cursor-default text-center"
          )}
          readOnly={!isEditable}
        />
      </td>
      <td className="border border-black px-1">
        <input
          type="text"
          value={row.remarks}
          onChange={(e) =>
            updateCell(groupIndex, rowIndex, "remarks", e.target.value)
          }
          className={cn(
            "w-full h-full border-none outline-none bg-transparent text-xs uppercase",
            isEditable ? "cursor-text" : "cursor-default text-center"
          )}
          readOnly={!isEditable}
        />
      </td>
      <td className="border border-black px-1">
        <input
          type="text"
          value={row.signature}
          onChange={(e) =>
            updateCell(groupIndex, rowIndex, "signature", e.target.value)
          }
          className={cn(
            "w-full h-full border-none outline-none bg-transparent text-xs uppercase",
            isEditable ? "cursor-text" : "cursor-default text-center"
          )}
          readOnly={!isEditable}
        />
      </td>
    </tr>
  );
}

export default TableRow;
