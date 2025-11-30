'use server';

import { getClaims } from '@/app/actions/get-claims';
import { EngineerController } from '@/lib/controller/engineer.controller';
import { db } from '@/lib/supabase';
import { withErrorHandler } from '@/utils/with-error-handler';

export async function getEngineerById(id: string) {
  const result = await withErrorHandler(async () => {
    const { user } = await getClaims();

    // throw an error if the request is not authenticated
    if (!user) throw new Error('Unauthorized access of resources!');

    // initialize controller
    const controller = new EngineerController(db);

    return controller.getEngineerById(id);
  });

  return result;
}
