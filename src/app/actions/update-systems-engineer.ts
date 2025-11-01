"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateSystemsEngineer(
  id: number,
  name: string,
  title: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("engineers")
    .update({
      name: name,
      title: title,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  console.log("Updated engineer:", data);

  return data;
}
