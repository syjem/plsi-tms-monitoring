"use server";

export async function extractTextFromPDF(file: File) {
  if (!file) {
    return { success: false, error: "No file provided" };
  }

  const formData = new FormData();
  formData.append("file", file);

  const url = "https://plsi-tms-monitoring-server.vercel.app/api/extract";

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data?.error || "Extraction failed" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Extraction error:", error);
    return { success: false, error: "An error occurred during extraction" };
  }
}
