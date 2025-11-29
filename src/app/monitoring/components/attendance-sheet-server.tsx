import { getSystemsEngineers } from '@/app/actions/engineers/get-engineers';
import { getWorkLogById } from '@/app/actions/logs/get-work-log-by-id';
import AttendanceSheet from '@/app/monitoring/components/attendance-sheet';

export async function AttendanceSheetServer({ id }: { id: string }) {
  const [engineers, workLogs] = await Promise.all([
    getSystemsEngineers(),
    getWorkLogById(id),
  ]);

  return (
    <AttendanceSheet engineers={engineers.data} workLogs={workLogs.data} />
  );
}
