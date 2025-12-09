'use server';

import { getUser } from '@/app/actions/get-user';
import { ERRORS } from '@/constants/errors';
import { EngineerController } from '@/lib/controller/engineer.controller';
import { db } from '@/lib/supabase';
import { withErrorHandler } from '@/utils/with-error-handler';

export const addEngineerSignature = async (
  userId: string,
  signatureData: string,
) => {
  const result = await withErrorHandler(async () => {
    if (!userId) throw new Error('userId is required');

    // check for user session and authorization
    const user = await getUser();

    // retrict further access when no user token found (possible exploit access)
    if (!user) throw new Error(ERRORS.NOT_ALLOWED);

    // initialize controller
    const controller = new EngineerController(db);

    return controller.addSignature(userId, signatureData);
  });

  return result;
};
