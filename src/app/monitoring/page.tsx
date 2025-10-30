import React from "react";
import AttendanceSheet from "@/components/attendance-sheet";
import { getFooterData } from "../data/get-footer-data";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ key: string }>;
}) {
  const params = await searchParams;
  const footerData = await getFooterData();

  return <AttendanceSheet searchParams={params} footerData={footerData} />;
}
