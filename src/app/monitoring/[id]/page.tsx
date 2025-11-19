import React from "react";

import { notFound } from "next/navigation";
import { getWorkLogById } from "@/app/actions/logs/get-work-log-by-id";
import AttendanceSheet from "@/app/monitoring/components/attendance-sheet";
import { getSystemsEngineers } from "@/app/actions/engineers/get-engineers";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [engineers, { data, error }] = await Promise.all([
    getSystemsEngineers(),
    getWorkLogById(id),
  ]);

  if (error) {
    notFound();
  }

  return <AttendanceSheet engineers={engineers.data} workLogs={data} />;
}

export default Page;
