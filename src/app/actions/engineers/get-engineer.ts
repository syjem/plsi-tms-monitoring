'use server';

import { getUser } from '@/app/actions/get-user';
import { ERRORS } from '@/constants/errors';
import { EngineerController } from '@/lib/controller/engineer.controller';
import { db } from '@/lib/supabase';
import { withErrorHandler } from '@/utils/with-error-handler';

export async function getEngineer() {
  const result = await withErrorHandler(async () => {
    const user = await getUser();

    // initialize controller
    const controller = new EngineerController(db);

    if (!user) throw new Error(ERRORS.USER_NOT_FOUND);

    return controller.getEngineerById(user.id);
  });

  return result;
}
