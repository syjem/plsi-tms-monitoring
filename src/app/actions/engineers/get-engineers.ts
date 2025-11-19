"use server";

import { SystemsEngineerDataType } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function getSystemsEngineers(): Promise<SystemsEngineerDataType> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { data: [], error: "User not authenticated" };
  }

  const { data, error } = await supabase
    .from("engineers")
    .select("id, field_number, name, title")
    .eq("user_id", user.id);

  if (error) {
    return { data: [], error: error.message };
  }

  return { data };
}
