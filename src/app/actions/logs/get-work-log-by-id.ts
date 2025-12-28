'use server';

import { getUser } from '@/app/actions/get-user';
import { ERRORS } from '@/constants/errors';
import { WorkLogsController } from '@/lib/controller/logs.controller';
import { db } from '@/lib/supabase';
import { AttendanceData } from '@/types';

export async function getWorkLogById(id: string) {
  const user = await getUser();
  if (!user) throw new Error(ERRORS.UNAUTHORIZED);

  const controller = new WorkLogsController(db);
  const workLog = await controller.getLogById(id, user.id);

  if (!workLog) throw new Error(ERRORS.NOT_FOUND);

  return { logs: workLog.logs as AttendanceData, id: workLog.id };
}
