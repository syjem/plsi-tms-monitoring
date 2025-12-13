import { users } from '@/lib/supabase/references/auth.user';
import { relations } from 'drizzle-orm';
import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const profiles = pgTable('profiles', {
  id: uuid().primaryKey().defaultRandom(),
  created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
  signature: text(),
  signatory_names: jsonb().$type<
    {
      name: string;
      title: string;
    }[]
  >(),
  user_id: uuid()
    .references(() => users.id, {
      onDelete: 'cascade',
    })
    .notNull()
    .unique(),
});

export type Profiles = typeof profiles.$inferSelect;
export type NewProfiles = typeof profiles.$inferInsert;

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.user_id],
    references: [users.id],
  }),
}));

export const usersProfilesRelations = relations(users, ({ one }) => ({
  profile: one(profiles),
}));
