import { integer, pgTable, timestamp } from 'drizzle-orm/pg-core';

/**
 * TODO: Add work_logs schema
 */
export const workLogs = pgTable('work_logs', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
});

export type WorkLog = typeof workLogs.$inferSelect;
