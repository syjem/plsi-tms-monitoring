import React from "react";

import { notFound } from "next/navigation";
import { getWorkLogById } from "@/app/actions/get-work-log-by-id";
import { getSystemsEngineers } from "@/app/actions/get-systems-engineer";
import AttendanceSheet from "@/app/monitoring/components/attendance-sheet";

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [engineers, { data, error }] = await Promise.all([
    getSystemsEngineers(),
    getWorkLogById(id),
  ]);

  if (error) {
    notFound();
  }

  return <AttendanceSheet engineers={engineers} workLogs={data} />;
}

export default Page;
