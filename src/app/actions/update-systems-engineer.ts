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
    console.error("Error fetching data: ", error);
    return null;
  }

  return data;
}
