// 'use server';

// import { getUser } from '@/app/actions/get-user';
// import { ProfilesController } from '@/lib/controller/profiles.controller';
// import { db } from '@/lib/supabase';
// import { withErrorHandler } from '@/utils/with-error-handler';

// export async function addSignatory(signatory: {
//   id: number;
//   name: string;
//   title: string;
// }) {
//   const result = await withErrorHandler(async () => {
//     // check for user session and authorization
//     const user = await getUser();
//     if (!user) throw new Error('Not allowed');

//     // initialize controller
//     const controller = new ProfilesController(db);
//     return controller.upsertSignatories(signatory);
//   });

//   return result;
// }
