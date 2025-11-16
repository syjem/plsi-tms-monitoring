"use server";

import { AttendanceData } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function updateWorkLogs(id: string, logs: AttendanceData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "User not authenticated" };
  }

  const { error } = await supabase
    .from("work_logs")
    .update({ logs: logs, updated_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .eq("id", id)
    .single();

  if (error) {
    return {
      success: false,
      error: "Failed to update the log, please try again.",
    };
  }

  return {
    success: true,
  };
}
