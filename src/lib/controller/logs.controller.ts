import { workLogs } from '@/lib/supabase/schema';
import { AttendanceData } from '@/types';
import { and, eq } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

type databaseType = PostgresJsDatabase<Record<string, never>>;

export class WorkLogsController {
  db: databaseType;
  constructor(db: databaseType) {
    this.db = db;
  }

  async createLog(user_id: string, period: string, logs: AttendanceData) {
    const new_log = await this.db
      .insert(workLogs)
      .values({ user_id, period, logs })
      .returning({ id: workLogs.id });
    return new_log[0];
  }

  //   Single log
  async getLogById(id: string, user_id: string) {
    const work_log = await this.db
      .select()
      .from(workLogs)
      .where(and(eq(workLogs.id, id), eq(workLogs.user_id, user_id)))
      .limit(1);
    return work_log[0];
  }

  //   Multiple logs
  async getLogsById(user_id: string) {
    const work_logs = await this.db
      .select()
      .from(workLogs)
      .where(eq(workLogs.user_id, user_id));
    return work_logs;
  }

  async updateLogById(id: string, user_id: string, logs: AttendanceData) {
    const updated_log = await this.db
      .update(workLogs)
      .set({ logs, updated_at: new Date() })
      .where(and(eq(workLogs.id, id), eq(workLogs.user_id, user_id)))
      .returning({ id: workLogs.id, updated_at: workLogs.updated_at });
    return updated_log[0];
  }

  async deleteLogById(id: string, user_id: string) {
    const deleted_log = await this.db
      .delete(workLogs)
      .where(and(eq(workLogs.id, id), eq(workLogs.user_id, user_id)))
      .returning({ id: workLogs.id });
    return deleted_log[0];
  }
}
