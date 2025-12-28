'use server';

import { getUser } from '@/app/actions/get-user';
import { ERRORS } from '@/constants/errors';
import { AttendanceData } from '@/types';

export async function updateWorkLog(id: string, logs: AttendanceData) {
  const user = await getUser();
  if (!user) throw new Error(ERRORS.UNAUTHORIZED);

  return { success: true };
}
