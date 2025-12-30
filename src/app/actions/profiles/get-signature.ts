'use server';

import { getUser } from '@/app/actions/get-user';
import { ERRORS } from '@/constants/errors';
import { ProfilesController } from '@/lib/controller/profiles.controller';
import { db } from '@/lib/supabase';
import { withErrorHandler } from '@/utils/with-error-handler';

export async function getEngineerSignature() {
  const result = await withErrorHandler(async () => {
    const user = await getUser();
    if (!user) throw new Error(ERRORS.UNAUTHORIZED);

    const controller = new ProfilesController(db);
    const profile = await controller.getEngineerByUserId(user.id);

    return profile?.signature;
  });

  return result;
}
