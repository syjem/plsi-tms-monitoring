"use server";

import { AttendanceData } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function saveWorkLogs(date: string, logs: AttendanceData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("work_logs")
    .insert({ user_id: user.id, logs, date });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
