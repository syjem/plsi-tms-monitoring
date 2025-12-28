'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Retrieves the currently authenticated user from Supabase.
 *
 * This function validates the user's authentication claims and returns their user details.
 * It must be called from a server context only (marked with 'use server').
 *
 * @async
 * @returns {Promise<User | null>} The authenticated user object, or null if no user is authenticated
 * @throws {Error} If there's an error retrieving claims or user data
 *
 * @example
 * const user = await getUser();
 * if (user) {
 *   console.log(user.email);
 * }
 */
export async function getUser() {
  const supabase = await createClient();
  const { error } = await supabase.auth.getClaims();

  if (error) redirect('/auth/login');

  const { data } = await supabase.auth.getUser();

  return data.user;
}
