"use server";

import { createClient } from "@/lib/supabase/server";

export async function getWorkLog(date: string) {
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
    .select("id, date, logs, created_at, updated_at")
    .eq("user_id", user.id)
    .eq("date", date)
    .single();

  if (error) {
    console.error(error.message);
    return null;
  }

  return data;
}
