"use server";

import { createClient } from "@/lib/supabase/server";

export async function upsertSystemsEngineer(
  id: number | undefined,
  name: string,
  title: string,
  field_number: number
) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    throw new Error("User not authenticated");
  }

  const payload: Record<string, number | string> = {
    user_id: user.id,
    name: name,
    title: title,
    field_number: field_number,
  };

  if (id) {
    payload.id = id;
  }

  const { data, error } = await supabase
    .from("engineers")
    .upsert(payload)
    .select()
    .single();

  if (error) {
    console.error("Error upserting data:", error.message);
    return null;
  }

  return data;
}
