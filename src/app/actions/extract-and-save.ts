// "use server";

// import { redirect } from "next/navigation";
// import { processLogs } from "@/utils/process-logs";
// import { extractTextFromPDF } from "@/app/actions/extract-pdf";
// import { saveExtractedLogs } from "@/app/actions/save-extracted-logs";

// export async function extractAndSave(file: File) {
//   const result = await extractTextFromPDF(file);

//   if (!result.success) {
//     return { success: false, error: result.error };
//   }

//   const date = `${result.data.from}-${result.data.to}`;
//   const processedLogs = processLogs(result.data.logs);

//   const { success, data, error } = await saveExtractedLogs(date, processedLogs);

//   if (!success) {
//     return { success: false, error: error || "Failed to save work logs" };
//   }

//   redirect(`/monitoring/${data.id}`);
// }
