'use server';

import { EngineerController } from '@/lib/controller/engineer.controller';
import { db } from '@/lib/supabase';
import { withErrorHandler } from '@/utils/with-error-handler';

export const addEngineerSignature = async (
  userId: string,
  signatureData: string,
) => {
  const result = await withErrorHandler(async () => {
    if (!userId) throw new Error('userId is required');

    // initialize controller
    const controller = new EngineerController(db);

    return controller.addSignature(userId, signatureData);
  });

  return result;
};
