'use server';

import { getUser } from '@/app/actions/get-user';
import { ERRORS } from '@/constants/errors';
import { ProfilesController } from '@/lib/controller/profiles.controller';
import { db } from '@/lib/supabase';
import { withErrorHandler } from '@/utils/with-error-handler';

export const setEngineerSignature = async (
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
    const controller = new ProfilesController(db);

    return controller.setSignature(userId, signatureData);
  });

  return result;
};
