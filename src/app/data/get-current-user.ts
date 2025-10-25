"use server";

import { createClient } from "@/lib/supabase/server";

export const getCurrentUser = async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Error fetching user session:", error);
    return null;
  }

  if (!user) {
    return null;
  }

  const userName = (user.user_metadata.full_name ?? "User") as string;
  const userEmail = (user.email ?? null) as string | null;
  const avatarUrl = (user.user_metadata.avatar_url ?? null) as string | null;

  return { userName, userEmail, avatarUrl };
};
