import { engineers, NewEngineer } from '@/lib/supabase/schema';
import { eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

export class EngineerController {
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
        if (engineer.length > 0) {
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
          `[${EngineerController.name}:${this.addSignature.name}] Error: ` +
            e?.message,
        );
      }
    }
  }

  /**
   * Creates a new engineer record with the provided data.
   *
   * Validates required fields, checks for duplicate emails, and inserts a new engineer
   * record into the database within a transaction. Returns the created engineer's id
   * and creation timestamp.
   *
   * @param {NewEngineer} data - The engineer data to create
   * @param {string} data.email - The engineer's email address (required, must be unique)
   * @param {string} [data.name] - The engineer's full name
   * @param {string} [data.phone] - The engineer's phone number
   * @param {string} [data.signature] - The engineer's signature (optional, can be added later)
   *
   * @returns {Promise<{id: string, created_at: Date}>}
   *   The newly created engineer record containing the id and creation timestamp
   *
   * @throws {Error} Throws an error with context if:
   *   - The email field is missing or empty
   *   - An engineer with the same email already exists
   *   - A database operation fails
   *
   * @example
   * // Create a new engineer
   * try {
   *   const newEngineer = await engineerController.create({
   *     email: 'john.doe@example.com',
   *     name: 'John Doe',
   *     phone: '555-0123'
   *   });
   *   console.log('Engineer created:', newEngineer.id);
   * } catch (error) {
   *   console.error('Failed to create engineer:', error.message);
   * }
   *
   * @example
   * // Using with withErrorHandler for structured error responses
   * const result = await withErrorHandler(
   *   () => engineerController.create({ email: 'jane@example.com' }),
   *   { errorCode: 'ENGINEER_CREATE_FAILED' }
   * );
   *
   * if (result.success) {
   *   console.log('Created engineer:', result.data.id);
   * } else {
   *   console.error(result.error.message);
   * }
   */
  async create(data: NewEngineer) {
    try {
      if (!data.email) throw new Error('Missing engineer email!');

      const result = await this.db.transaction(async (txs) => {
        const existingUser = await txs
          .select({ id: engineers.id })
          .from(engineers)
          .where(eq(engineers.email, data.email!));

        if (existingUser) throw new Error('User already exists!');

        const newUser = await txs
          .insert(engineers)
          .values(data)
          .returning({ id: engineers.id, created_at: engineers.created_at });

        return newUser[0];
      });

      return result;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(
          `[${EngineerController.name}:${this.create.name}] Error: ` +
            e?.message,
        );
      }
    }
  }
}
