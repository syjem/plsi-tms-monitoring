'use server';

import { getUser } from '@/app/actions/get-user';
import { ERRORS } from '@/constants/errors';
import { ProfilesController } from '@/lib/controller/profiles.controller';
import { db } from '@/lib/supabase';
import { withErrorHandler } from '@/utils/with-error-handler';

export const setEngineerSignature = async (signatureData: string) => {
  const result = await withErrorHandler(async () => {
    const user = await getUser();
    if (!user) throw new Error(ERRORS.UNAUTHORIZED);

    const controller = new ProfilesController(db);

    return controller.setSignature(user.id, signatureData);
  });

  return result;
};
