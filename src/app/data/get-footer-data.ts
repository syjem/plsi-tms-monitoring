"use server";

import { createClient } from "@/lib/supabase/server";

export async function getFooterData() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("engineers")
    .select("id, position, name, title");

  if (error) {
    console.error("Error fetching data: ", error);
    return [];
  }

  return data ?? [];
}
