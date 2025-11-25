# PostgreSQL & Drizzle ORM Setup

This guide documents the integration of PostgreSQL with Drizzle ORM in Next.js and Supabase project.

## Overview

Drizzle ORM provides a type-safe way to interact with your PostgreSQL database. This setup uses:

- **Database**: PostgreSQL (via Supabase)
- **ORM**: Drizzle ORM
- **Migration Tool**: Drizzle Kit
- **Framework**: Next.js

## Configuration

### Drizzle Config (`drizzle-config.ts`)

The `drizzle-config.ts` file defines the configuration for Drizzle Kit and migrations:

```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle', // Output directory for migrations
  schema: './src/lib/supabase/schema', // Schema definition location
  dialect: 'postgresql', // Database dialect
  dbCredentials: {
    url: process.env.DATABASE_URL!, // Database connection string from env
  },
});
```

**Key Settings:**

- `out`: Where generated migration files will be stored
- `schema`: Path to your table schema definitions
- `dialect`: Set to `postgresql` for Supabase
- `dbCredentials`: Uses `DATABASE_URL` environment variable from Supabase

### Database Client (`lib/supabase/index.ts`)

The database client initializes the Drizzle ORM connection:

```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Disable prefetch as it is not supported for "Transaction" pool mode
const client = postgres(process.env.DATABASE_URL!, { prepare: false });
export const db = drizzle({ client });
```

**Important Notes:**

- `prepare: false` is required for Supabase's transaction pool mode
- The `db` instance is exported for use throughout your application
- Import and use `db` in your server actions or API routes to query the database

## Schema Definition

### Creating Tables (`lib/supabase/schema/index.ts`)

Define your database tables in the schema file:

```typescript
import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const todo = pgTable('todo', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  todo: text().notNull(),
  created_at: timestamp().defaultNow(),
  updated_at: timestamp().defaultNow(),
});

export type Todo = typeof todo.$inferSelect;
```

**Best Practices:**

- Define one table per export
- Use `$inferSelect` to generate TypeScript types automatically
- Place all schema definitions in `lib/supabase/schema/index.ts`

## Available Commands

### Schema Management

```bash
npm run schema:generate   # Generate migration files from schema changes
npm run schema:push       # Push schema changes directly to database
npm run schema:migrate    # Run pending migrations
```

## Workflow

### 1. Define or Update Schema

Edit `lib/supabase/schema/index.ts` to add or modify tables.

### 2. Generate Migrations

```bash
npm run schema:generate
```

This creates migration files in the `./drizzle` directory.

### 3. Apply to Database

**Option A: Push directly (development only)**

```bash
npm run schema:push
```

**Option B: Run migrations (recommended for production)**

```bash
npm run schema:migrate
```

### 4. Use in Your Application

Import and use the database client in server actions or API routes:

```typescript
import { db } from '@/lib/supabase';
import { todo } from '@/lib/supabase/schema';

// Insert
await db.insert(todo).values({
  todo: 'My first task',
});

// Select
const todos = await db.select().from(todo);

// Update
await db.update(todo).set({ todo: 'Updated' }).where(eq(todo.id, 1));

// Delete
await db.delete(todo).where(eq(todo.id, 1));
```

## Environment Variables

Ensure your `.env.local` file contains:

```env
DATABASE_URL=postgresql://user:password@host:port/database
```

Get your connection string from Supabase:

1. Go to your Supabase project settings
2. Select the "Database" tab
3. Copy the connection string under "Connection string"
4. Use the "Transaction mode" connection string for better performance

## Common Issues

**Issue: "prepare: false" deprecation warning**
The `prepare: false` setting is required for Supabase's transaction pool mode and is not deprecated for this use case.

**Issue: Migrations not applying**
Ensure `DATABASE_URL` is correctly set and the database is accessible. Check that all schema changes are defined before running `schema:generate`.

**Issue: Type inference not working**
Make sure to use `$inferSelect` when creating TypeScript types from your table schemas.

## Project Structure

```
project-root/
├── drizzle/                          # Generated migrations
├── src/
│   └── lib/
│       └── supabase/
│           ├── index.ts              # Database client
│           └── schema/
│               └── index.ts          # Table definitions
├── drizzle-config.ts                 # Drizzle configuration
└── package.json
```

## Resources

- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [Drizzle Kit Documentation](https://orm.drizzle.team/kit-docs/overview)
- [Supabase Database Setup](https://supabase.com/docs/guides/database)
- [PostgreSQL Documentation](https://www.postgresql.org/docs)
