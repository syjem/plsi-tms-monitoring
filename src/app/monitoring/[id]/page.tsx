import { AttendanceSheetServer } from '@/app/monitoring/components/attendance-sheet-server';
import { AttendanceSheetSkeleton } from '@/app/monitoring/components/attendance-sheet-skeleton';
import { Suspense } from 'react';

async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <Suspense fallback={<AttendanceSheetSkeleton />}>
      <AttendanceSheetServer id={id} />
    </Suspense>
  );
}

export default Page;
