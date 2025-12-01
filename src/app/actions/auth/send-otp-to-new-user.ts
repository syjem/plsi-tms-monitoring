'use server';

import { createClient } from '@/lib/supabase/server';

export async function sendOtpToNewUser(email: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return { success: true, message: 'Verification code sent to your email' };
}
