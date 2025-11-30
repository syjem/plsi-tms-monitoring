import { engineers } from '@/lib/supabase/schema';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class EnginerController {
  db: PostgresJsDatabase<Record<string, never>>;
  constructor(db: PostgresJsDatabase<Record<string, never>>) {
    this.db = db;
  }

  async addSignature(user_id: string, data: string) {
    try {
      // update engineer signature if present otherwise add new entry
      const result = this.db.transaction(async (txs) => {
        const engineer = await txs
          .select()
          .from(engineers)
          .where(eq(engineers.userId, user_id));

        // check if user is existed
        if (engineer) {
          // apply update
          const update_result = await txs
            .update(engineers)
            .set({ signature: data })
            .where(eq(engineers.userId, user_id))
            .returning({ updated_at: engineers.updated_at, id: engineers.id });

          return update_result;
        }

        // add new entry to the database
        const create_result = await this.db
          .insert(engineers)
          .values({ userId: user_id, signature: data })
          .returning({
            created_at: engineers.created_at,
            id: engineers.id,
          });

        return create_result;
      });

      return result;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(
          `[${EnginerController.name}:${this.addSignature.name}] Error: ` +
            e?.message,
        );
      }
    }
  }
}
