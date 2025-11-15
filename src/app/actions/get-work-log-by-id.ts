"use server";

import { WorkLogById } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function getWorkLogById(id: string): Promise<WorkLogById> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: null, error: "User not authenticated" };
  }

  const { data, error } = await supabase
    .from("work_logs")
    .select("id, date, logs, created_at, updated_at")
    .eq("user_id", user.id)
    .eq("id", id)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data };
}
