import { users } from '@/lib/supabase/auth-reference';
import { relations, sql } from 'drizzle-orm';
import {
  bigint,
  check,
  pgPolicy,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { authenticatedRole } from 'drizzle-orm/supabase';

export const engineers = pgTable(
  'engineers',
  {
    id: bigint({ mode: 'bigint' }).primaryKey().generatedAlwaysAsIdentity(),
    created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
    name: text(),
    title: text(),
    signature: text(), // Store base64 string
    phone: varchar({ length: 50 }),
    email: text(),
    user_id: uuid()
      .references(() => users.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    field_number: smallint(),
  },
  (table) => [
    check('field_number_check', sql`${table.field_number} > 0`),

    // Policies
    pgPolicy('Engineers can insert their own record', {
      as: 'permissive',
      for: 'insert',
      to: authenticatedRole,
      withCheck: sql`(SELECT auth.uid()) = user_id`,
    }),
    pgPolicy('Engineers can update their own record', {
      as: 'permissive',
      for: 'update',
      to: authenticatedRole,
      withCheck: sql`(SELECT auth.uid()) = user_id`,
    }),
    pgPolicy('Engineers can view their own record', {
      as: 'permissive',
      for: 'select',
      to: authenticatedRole,
      using: sql`(SELECT auth.uid()) = user_id`,
    }),
  ],
);

// Type inference
export type Engineer = typeof engineers.$inferSelect;
export type NewEngineer = typeof engineers.$inferInsert;

// Relations
export const engineersRelations = relations(engineers, ({ one }) => ({
  user: one(users, {
    fields: [engineers.user_id],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  engineers: many(engineers),
}));
