import { getWorkLogById } from '@/app/actions/logs/get-work-log-by-id';
import { getEngineerSignature } from '@/app/actions/profiles/get-signature';
import AttendanceSheet from '@/app/monitoring/components/attendance-sheet';

export async function AttendanceSheetServer({ id }: { id: string }) {
  const [workLog, signature] = await Promise.all([
    getWorkLogById(id),
    getEngineerSignature(),
  ]);

  return <AttendanceSheet workLog={workLog} signature={signature} />;
}
