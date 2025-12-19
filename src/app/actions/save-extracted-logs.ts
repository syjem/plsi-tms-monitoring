'use server';

import { createClient } from '@/lib/supabase/server';
import { AttendanceData } from '@/types';
import { redirect } from 'next/navigation';

export async function saveExtractedLogs(period: string, logs: AttendanceData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { success: false, error: 'User not authenticated' };
  }

  const { data, error } = await supabase
    .from('work_logs')
    .insert({ user_id: user.id, logs, period })
    .select()
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  redirect(`/monitoring/${data.id}`);
}
