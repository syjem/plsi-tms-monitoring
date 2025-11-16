"use server";

import { redirect } from "next/navigation";
import { processData } from "@/utils/process-data";
import { saveWorkLogs } from "@/app/actions/save-work-logs";
import { extractTextFromPDF } from "@/app/actions/extract-pdf";

export async function extractAndSave(file: File) {
  const result = await extractTextFromPDF(file);

  if (!result.success) {
    return { success: false, error: result.error };
  }

  const date = `${result.data.from}-${result.data.to}`;
  const processedData = processData(result.data.logs);

  const { success, data, error } = await saveWorkLogs(date, processedData);

  if (!success) {
    return { success: false, error: error || "Failed to save work logs" };
  }

  redirect(`/monitoring/${data.id}`);
}
