import { NextResponse } from "next/server";
import { data } from "@/lib/data";

const attendanceLogs = [data.logs];

export async function GET() {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    return NextResponse.json({
      success: true,
      logs: attendanceLogs,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch attendance logs" },
      { status: 500 }
    );
  }
}
