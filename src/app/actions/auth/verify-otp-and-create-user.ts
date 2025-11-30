'use server';

import { createClient } from '@/lib/supabase/server';

export async function verifyOtpAndCreateUser({
  email,
  otp,
  firstName,
  lastName,
  avatarUrl,
}: {
  email: string;
  otp: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}) {
  const supabase = await createClient();

  // Step 1: Verify OTP
  const { error: verifyError } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: 'email',
  });

  if (verifyError) {
    return { success: false, message: verifyError.message };
  }

  // Step 2: Update user metadata
  const { data, error: updateError } = await supabase.auth.updateUser({
    data: {
      first_name: firstName,
      last_name: lastName,
      full_name: `${firstName} ${lastName}`,
      avatar_url: avatarUrl || null,
    },
  });

  if (updateError) {
    return { success: false, message: updateError.message };
  }

  return { success: true, user: data.user };
}
