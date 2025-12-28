'use server';

import { getUser } from '@/app/actions/get-user';
import { ERRORS } from '@/constants/errors';
import { WorkLogsController } from '@/lib/controller/logs.controller';
import { db } from '@/lib/supabase';

export async function getWorkLogs() {
  const user = await getUser();
  if (!user) throw new Error(ERRORS.UNAUTHORIZED);

  const controller = new WorkLogsController(db);
  const work_logs = await controller.getLogsById(user.id);

  return work_logs;
}
