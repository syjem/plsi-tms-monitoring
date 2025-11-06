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

  const userName = user.user_metadata.full_name as string;
  const userEmail = (user.email) as string;
  const avatarUrl = (user.user_metadata.avatar_url ?? undefined) as
    | string
    | undefined;

  return { userName, userEmail, avatarUrl };
};
