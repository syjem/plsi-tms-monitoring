import { users } from '@/lib/supabase/schema/auth';
import { pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core';

// User Profiles Table (extends auth.users)
export const profiles = pgTable('profiles', {
  id: uuid('id')
    .primaryKey()
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull(), // Reference to auth.users
  full_name: varchar({ length: 255 }),
  phone: varchar({ length: 50 }),
  signature: text(), // Store base64 string
  create_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
