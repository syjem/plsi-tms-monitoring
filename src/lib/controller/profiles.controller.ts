import { profiles } from '@/lib/supabase/schema';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class ProfilesController {
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
  async setSignature(user_id: string, data: string) {
    try {
      // update engineer signature if present otherwise add new entry
      const result = await this.db.transaction(async (txs) => {
        const profile = await txs
          .select()
          .from(profiles)
          .where(eq(profiles.user_id, user_id));

        // check if user is existed
        if (profile.length > 0) {
          // apply update
          const updated_signature = await txs
            .update(profiles)
            .set({ signature: data })
            .where(eq(profiles.user_id, user_id))
            .returning({ updated_at: profiles.updated_at, id: profiles.id });

          return updated_signature;
        }

        // add new entry to the database
        const create_result = await this.db
          .insert(profiles)
          .values({ user_id: user_id, signature: data })
          .returning({
            created_at: profiles.created_at,
            id: profiles.id,
          });

        return create_result;
      });

      return result[0];
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(
          `[${ProfilesController.name}:${this.setSignature.name}] Error: ` +
            e?.message,
        );
      }
    }
  }

  /**
   * Retrieve engineer record by the provided id
   * @param id - engineer unique id
   * @throws {Error} Throws an error with context if:
   *   - The id is missing or empty
   *   - A database operation fails
   */
  async getEngineerById(id: string) {
    try {
      if (!id) throw new Error('Missing parameter id!');

      const result = await this.db
        .select({
          id: profiles.id,
          signatories: profiles.signatories,
          created_at: profiles.created_at,
          updated_at: profiles.updated_at,
          signature: profiles.signature,
        })
        .from(profiles)
        .where(eq(profiles.user_id, id));

      return result.length > 0 ? result[0] : null;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(
          `[${ProfilesController.name}:${this.getEngineerById.name}] Error: ` +
            e?.message,
        );
      }
    }
  }

  /**
   * Updates the signatories array for a user's profile.
   *
   * Replaces the entire signatories JSONB field with the provided array.
   * Uses a transaction to ensure atomicity.
   *
   * @param {string} user_id - The unique identifier of the user
   * @param {Array<{id: number, name: string, title: string}>} signatories - The new signatories array
   * @returns {Promise<{id: string, signatories: any, updated_at: Date}>}
   *   Returns the updated profile data
   *
   * @throws {Error} Throws an error with context if the database operation fails
   */
  async setSignatories(
    user_id: string,
    signatories: { id: number; name: string; title: string }[],
  ) {
    try {
      const result = await this.db.transaction(async (txs) => {
        const profile = await txs
          .select()
          .from(profiles)
          .where(eq(profiles.user_id, user_id));

        // proceed to update if profile exists
        if (profile.length > 0) {
          const updated = await txs
            .update(profiles)
            .set({ signatories, updated_at: new Date() })
            .where(eq(profiles.user_id, user_id))
            .returning({
              id: profiles.id,
              signatories: profiles.signatories,
              updated_at: profiles.updated_at,
            });
          return updated[0];
        }

        // add new entry to the database
        const created = await this.db
          .insert(profiles)
          .values({ user_id: user_id, signatories: signatories })
          .returning({
            id: profiles.id,
            signatories: profiles.signatories,
            updated_at: profiles.updated_at,
          });

        return created[0];
      });

      return result;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(
          `[${ProfilesController.name}:${this.setSignatories.name}] Error: ` +
            e?.message,
        );
      }
    }
  }
}
