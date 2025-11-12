"use server";

import { createClient } from "@/lib/supabase/server";

export async function getWorkLogs() {
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
    .select("*")
    .eq("user_id", user.id);

  if (error) {
    console.error(error.message);
    return [];
  }

  return data ?? [];
}
