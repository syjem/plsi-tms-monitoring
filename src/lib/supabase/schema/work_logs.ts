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
    period: text().notNull(),
    logs: jsonb().notNull(),
    user_id: uuid()
      .references(() => users.id, {
        onDelete: 'cascade',
      })
      .notNull(),
  },
  () => [
    pgPolicy('Work Logs RLS for ALL', {
      as: 'permissive',
      for: 'all',
      to: authenticatedRole,
      withCheck: sql`(( SELECT auth.uid() AS uid) = user_id)`,
      using: sql`(( SELECT auth.uid() AS uid) = user_id)`,
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
