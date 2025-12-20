import { getWorkLogById } from '@/app/actions/logs/get-work-log-by-id';
import AttendanceSheet from '@/app/monitoring/components/attendance-sheet';

export async function AttendanceSheetServer({ id }: { id: string }) {
  const workLogs = await getWorkLogById(id);
  const data = null;

  return <AttendanceSheet workLogs={data} />;
}
