'use server';

import { getClaims } from '@/app/actions/get-claims';
import { ERRORS } from '@/constants/errors';
import { ProfilesController } from '@/lib/controller/profiles.controller';
import { db } from '@/lib/supabase';
import { withErrorHandler } from '@/utils/with-error-handler';

export async function getEngineerById(id: string) {
  const result = await withErrorHandler(async () => {
    if (!id) throw new Error('id is required!');

    const { user } = await getClaims();

    // throw an error if the request is not authenticated
    if (!user) throw new Error(ERRORS.NOT_ALLOWED);

    // initialize controller
    const controller = new ProfilesController(db);

    return controller.getEngineerById(id);
  });

  return result;
}
