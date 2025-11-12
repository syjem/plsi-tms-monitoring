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
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("work_logs")
    .update({ logs: logs, updated_at: new Date().toISOString() })
    .eq("user_id", user.id)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error updating logs:", error.message);
    return null;
  }

  return data;
}
