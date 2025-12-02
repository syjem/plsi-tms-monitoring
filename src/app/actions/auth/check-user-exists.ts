'use server';

import { createServiceClient } from '@/lib/supabase/service';

export async function checkUserExists(email: string): Promise<boolean> {
  const supabaseAdmin = createServiceClient();

  const { data, error } = await supabaseAdmin.rpc('get_user_id_by_email', {
    user_email: email,
  });

  if (error) return false;

  return !!data;
}
