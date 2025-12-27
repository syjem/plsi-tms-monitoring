import z from 'zod';

export const signatorySchema = z.object({
  id: z.number(),
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
});

export const signatoriesSchema = z
  .array(signatorySchema)
  .max(2, 'You can only have up to 2 signatories');
