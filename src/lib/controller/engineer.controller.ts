import { engineers } from '@/lib/supabase/schema';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class EnginerController {
  db: PostgresJsDatabase<Record<string, never>>;
  constructor(db: PostgresJsDatabase<Record<string, never>>) {
    this.db = db;
  }

  /**
   * Inserts or updates an engineer document with a signature.
   *
   * Creates a new engineer record if one doesn't exist for the given user_id,
   * otherwise updates the existing engineer's signature. Uses a database transaction
   * to ensure atomicity.
   *
   * @param {string} user_id - The unique identifier of the engineer user
   * @param {string} data - The signature data to store (typically base64 encoded)
   * @returns {Promise<Array<{updated_at: Date, id: string}> | Array<{created_at: Date, id: string}>>}
   *   Returns the updated or created engineer record with timestamp and id
   *
   * @throws {Error} Throws an error with context if the database operation fails
   *
   * @note This method does not validate signature data size or format.
   *   Implement validation at the service/controller layer before calling this method.
   *
   * @example
   * // Update existing engineer's signature
   * const result = await controller.addSignature('user123', 'data:image/png;base64,...');
   *
   * // Insert new engineer record with signature
   * const result = await controller.addSignature('newUser456', 'data:image/png;base64,...');
   */
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
