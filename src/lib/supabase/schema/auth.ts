import { pgSchema, uuid } from 'drizzle-orm/pg-core';
// AUTH RELATED SCHEMA
// SHOULD NOT BE MODIFIED SINCE SUPABASE HANDLES BY DEFAULT
// Define the public schema
export const authSchema = pgSchema('auth'); // Supabase auth (read-only reference)

export const users = authSchema.table('users', {
  id: uuid('id').primaryKey(),
});
