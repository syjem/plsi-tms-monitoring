'use server';

import { ERRORS } from '@/constants/errors';
import { createClient } from '@/lib/supabase/server';
import { emailSchema } from '@/lib/zod/schema';

export async function signInWithEmail(email: string) {
  const supabase = await createClient();

  const parsed = emailSchema.safeParse({ email });
  if (!parsed.success) {
    return { success: false, error: new Error(ERRORS.INVALID_EMAIL) };
  }

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
    },
  });

  return {
    success: !error,
    error: error?.message ? new Error(error.message) : null,
  };
}
