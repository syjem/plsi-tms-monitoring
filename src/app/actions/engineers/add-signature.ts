'use server';

import { EnginerController } from '@/lib/controller/engineer.controller';
import { db } from '@/lib/supabase';
import { withErrorHandler } from '@/utils/with-error-handler';

export const addEngineerSignature = async (
  id: string,
  signatureData: string,
) => {
  const result = await withErrorHandler(() => {
    // initialize controller
    const controller = new EnginerController(db);

    return controller.addSignature(id, signatureData);
  });

  if (result.success) {
    return result.data;
  } else {
    return result.error;
  }
};
