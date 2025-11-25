import { users } from '@/lib/supabase/schema/auth';
import { relations } from 'drizzle-orm';
import { jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const workLogs = pgTable('work_logs', {
  id: uuid().primaryKey().defaultRandom(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  date: text().notNull(),
  logs: jsonb().notNull(),
  user_id: uuid('id')
    .primaryKey()
    .references(() => users.id, {
      onDelete: 'no action', // keep record even the user is deleted
    })
    .notNull(),
});

// Type inference
export type WorkLog = typeof workLogs.$inferSelect;
export type NewWorkLog = typeof workLogs.$inferInsert;

export const workLogsRelations = relations(workLogs, ({ one }) => ({
  user: one(users, {
    fields: [workLogs.user_id],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  workLogs: many(workLogs),
}));
