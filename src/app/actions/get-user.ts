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
 * @returns {Promise<User>} The authenticated user object
 * @redirect to /auth/login page If there's an error retrieving claims or user data
 *
 * @example
 * const user = await getUser();
 * console.log(user.email);
 *
 */
export async function getUser() {
  const supabase = await createClient();
  const { error } = await supabase.auth.getClaims();

  if (error) redirect('/auth/login');

  const { data } = await supabase.auth.getUser();

  if (!data.user) redirect('/auth/login');

  return data.user;
}
