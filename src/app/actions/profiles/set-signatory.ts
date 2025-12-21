'use server';

import { getUser } from '@/app/actions/get-user';
import { ProfilesController } from '@/lib/controller/profiles.controller';
import { db } from '@/lib/supabase';
import { withErrorHandler } from '@/utils/with-error-handler';

export async function setSignatory(
  signatories: { id: number; name: string; title: string }[],
) {
  const result = await withErrorHandler(
    async () => {
      const user = await getUser();
      if (!user) throw new Error('Unauthorized');

      // Validation
      if (!Array.isArray(signatories) || signatories.length > 2) {
        throw new Error('Invalid signatories data');
      }

      const controller = new ProfilesController(db);
      return controller.setSignatories(user.id, signatories);
    },
    { errorCode: 'SIGNATORIES_UPDATE_FAILED' },
  );

  return result;
}
