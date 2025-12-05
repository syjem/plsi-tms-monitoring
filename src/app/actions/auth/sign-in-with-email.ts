'use server';

import { createClient } from '@/lib/supabase/server';

export async function signInWithEmail(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
    },
  });

  return { error };
}
