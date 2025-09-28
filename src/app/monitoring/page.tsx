import React from "react";
import { data } from "@/lib/data";
import AttendanceSheet from "@/components/attendance-sheet";

export default function Page() {
  return (
    <AttendanceSheet initialData={data.logs} employee={data.employee.name} />
  );
}
