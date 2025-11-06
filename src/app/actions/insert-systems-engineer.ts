"use server";

import { createClient } from "@/lib/supabase/server";

export async function insertSystemsEngineer(
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

  const { data, error } = await supabase
    .from("engineers")
    .insert({
      user_id: user.id,
      name: name,
      title: title,
      field_number: field_number,
    })
    .select()
    .single();

  if (error) {
    console.error("Error fetching data: ", error);
    return null;
  }

  return data;
}
