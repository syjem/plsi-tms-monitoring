"use server";

import { processData } from "@/utils/process-data";
import { saveWorkLogs } from "@/app/actions/save-work-logs";
import { extractTextFromPDF } from "@/app/actions/extract-pdf";

export async function extractAndSave(file: File) {
  const result = await extractTextFromPDF(file);
  if (!result.success) {
    return { success: false, error: result.error };
  }

  const processedData = processData(result.data.logs);
  const date = `${result.data.from}-${result.data.to}`;

  const res = await saveWorkLogs(date, processedData);
  if (!res.success) {
    return { success: false, error: res.error || "Failed to save work logs" };
  }

  return { success: true, date };
}
