'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * NOTE: Server-Only
 *
 * Gets the user defaults from the auth session
 * @returns
 */
export async function getUser() {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();
  return data.user;
}
