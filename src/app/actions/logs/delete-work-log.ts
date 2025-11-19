"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function deleteWorkLog(id: string) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: "User not authenticated" };
  }

  const { error } = await supabase
    .from("work_logs")
    .delete()
    .eq("user_id", user.id)
    .eq("id", id);

  if (error) {
    return {
      success: false,
      error: "Failed to delete the log, please try again.",
    };
  }

  revalidatePath("/");

  return {
    success: true,
    message: "Log deleted successfully",
  };
}
