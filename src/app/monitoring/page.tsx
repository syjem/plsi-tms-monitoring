import React from "react";
import { getSystemsEngineers } from "@/app/actions/get-systems-engineer";
import AttendanceSheet from "@/app/monitoring/components/attendance-sheet";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ key: string }>;
}) {
  const params = await searchParams;
  const engineers = await getSystemsEngineers();

  return <AttendanceSheet searchParams={params} engineers={engineers} />;
}
