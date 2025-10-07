import type { ApiLogData, AttendanceData, AttendanceRow } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatBytes = (
  bytes: number,
  decimals = 2,
  size?: "bytes" | "KB" | "MB" | "GB" | "TB" | "PB" | "EB" | "ZB" | "YB"
) => {
  const k = 1000;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  if (bytes === 0 || bytes === undefined)
    return size !== undefined ? `0 ${size}` : "0 bytes";
  const i =
    size !== undefined
      ? sizes.indexOf(size)
      : Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

export const processData = (logs: ApiLogData[]): AttendanceData => {
  const groupedData: AttendanceData = [];

  logs.forEach((log) => {
    const isDayOff = log.Shift === "X" || log.Remarks === "DAY OFF";
    const hasRecords = isRowHasRecords(log);

    // Check if it's a day off - create single row group
    if (isDayOff && !hasRecords) {
      groupedData.push([
        {
          date: formatDate(log.Date),
          day: log.Day,
          sched: log.Shift,
          timeIn: "",
          timeOut: "",
          destination: "",
          remarks: log.Remarks,
          signature: "",
        },
      ]);
    } else {
      // Regular work day - create two-row group
      // First row: Date, Day, Sched, TimeIn, BreakOut, Destination, Remarks, Signature
      // Second row: "", "", "", BreakIn, TimeOut, Destination, Remarks, Signature
      groupedData.push([
        {
          date: formatDate(log.Date),
          day: log.Day,
          sched: log.Shift,
          timeIn: formatTimeTo12Hour(log.TimeIn),
          timeOut: formatTimeTo12Hour(log.BreakOut),
          destination: "OFFICE",
          remarks: log.Remarks || "DUTY ON CALL",
          signature: "",
        },
        {
          date: "",
          day: "",
          sched: "",
          timeIn: formatTimeTo12Hour(log.BreakIn),
          timeOut: formatTimeTo12Hour(log.TimeOut),
          destination: "OFFICE",
          remarks: log.Remarks || "DUTY ON CALL",
          signature: "",
        },
      ]);
    }
  });

  // Fill remaining rows with empty data up to 40 rows
  const currentRowCount = groupedData.reduce(
    (total, group) => total + group.length,
    0
  );
  const remainingRows = 40 - currentRowCount;
  for (let i = 0; i < remainingRows; i++) {
    groupedData.push([
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
  }
  return groupedData;
};

export function toTitleCase(str: string) {
  return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatDate(date: string) {
  if (!date) return "";

  const [year, month, day] = date.split("-");
  return `${month}-${day}-${year}`;
}

// Helper function to check if a row is completely empty
export const isRowEmpty = (row: AttendanceRow): boolean => {
  return (
    row.date === "" &&
    row.day === "" &&
    row.sched === "" &&
    row.timeIn === "" &&
    row.timeOut === "" &&
    row.destination === "" &&
    row.remarks === "" &&
    row.signature === ""
  );
};

export const isRowHasRecords = (row: ApiLogData): boolean => {
  return [row.TimeIn, row.TimeOut, row.BreakOut, row.BreakIn].some(
    (val) => val && val.trim() !== ""
  );
};

export function formatTimeTo12Hour(time: string): string {
  if (!time) return "";

  const [hoursStr, minutes] = time.split(":");
  let hours = parseInt(hoursStr, 10);

  hours = hours % 12 || 12;

  return `${hours}:${minutes}`;
}
