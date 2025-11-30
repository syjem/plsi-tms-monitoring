import { users } from '@/lib/supabase/auth-reference';
import { relations, sql } from 'drizzle-orm';
import {
  bigint,
  check,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';

export const engineers = pgTable(
  'engineers',
  {
    id: bigint({ mode: 'number' }).primaryKey().generatedByDefaultAsIdentity(),
    created_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
    updated_at: timestamp({ withTimezone: true }).notNull().defaultNow(),
    name: text(),
    title: text(),
    signature: text(), // Store base64 string
    phone: varchar({ length: 50 }),
    email: text(),
    userId: uuid('id')
      .primaryKey()
      .references(() => users.id, {
        onDelete: 'cascade',
      })
      .notNull(),
    fieldNumber: smallint(),
  },
  (table) => [check('field_number_check', sql`${table.fieldNumber} > 0`)],
);

// Type inference
export type Engineer = typeof engineers.$inferSelect;
export type NewEngineer = typeof engineers.$inferInsert;

// Relations
export const engineersRelations = relations(engineers, ({ one }) => ({
  user: one(users, {
    fields: [engineers.userId],
    references: [users.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  engineers: many(engineers),
}));
