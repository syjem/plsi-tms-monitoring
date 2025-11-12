import React from "react";
import { getWorkLog } from "@/app/actions/get-work-log";
import { getSystemsEngineers } from "@/app/actions/get-systems-engineer";
import AttendanceSheet from "@/app/monitoring/components/attendance-sheet";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ date: string }>;
}) {
  const params = await searchParams;

  const [engineers, workLogs] = await Promise.all([
    getSystemsEngineers(),
    getWorkLog(params.date),
  ]);

  return <AttendanceSheet engineers={engineers} workLogs={workLogs} />;
}
