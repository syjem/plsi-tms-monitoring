import React from "react";
import AttendanceSheet from "@/components/attendance-sheet";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ key: string }>;
}) {
  const params = await searchParams;

  return <AttendanceSheet searchParams={params} />;
}
