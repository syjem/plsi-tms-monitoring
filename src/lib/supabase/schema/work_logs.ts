import { users } from '@/lib/supabase/references/auth.user';
import { relations, sql } from 'drizzle-orm';
import {
  jsonb,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { authenticatedRole } from 'drizzle-orm/supabase';

export const workLogs = pgTable(
  'work_logs',
  {
    id: uuid().primaryKey().defaultRandom(),
    created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
    date: text().notNull(),
    logs: jsonb().notNull(),
    user_id: uuid()
      .references(() => users.id, {
        onDelete: 'cascade',
      })
      .notNull(),
  },
  (table) => [
    pgPolicy('Authenticated users can delete their own record', {
      as: 'permissive',
      for: 'delete',
      to: authenticatedRole,
      using: sql`(SELECT auth.uid() as uid) = user_id`,
    }),
    pgPolicy('Authenticated users can update their own record', {
      as: 'permissive',
      for: 'update',
      to: authenticatedRole,
      using: sql`(SELECT auth.uid() as uid) = user_id`,
      withCheck: sql`(SELECT auth.uid() as uid) = user_id`,
    }),
    pgPolicy('Enable insert based on user_id', {
      as: 'permissive',
      for: 'insert',
      to: authenticatedRole,
      withCheck: sql`auth.uid() = user_id`,
    }),
    pgPolicy('Enable select for users based on user_id', {
      as: 'permissive',
      for: 'select',
      to: authenticatedRole,
      using: sql`(SELECT auth.uid() as uid) = user_id`,
    }),
  ],
);

// Type inference
export type WorkLog = typeof workLogs.$inferSelect;
export type NewWorkLog = typeof workLogs.$inferInsert;

export const workLogsRelations = relations(workLogs, ({ one }) => ({
  user: one(users, {
    fields: [workLogs.user_id],
    references: [users.id],
  }),
}));

export const usersWorklogRelations = relations(users, ({ many }) => ({
  workLogs: many(workLogs),
}));
