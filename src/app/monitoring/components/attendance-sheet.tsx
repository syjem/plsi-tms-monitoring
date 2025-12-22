'use client';

import { updateWorkLog } from '@/app/actions/logs/update-work-log';
import { AttendanceSheetHeader } from '@/app/monitoring/components/attendance-sheet-header';
import AttendanceSheetTable from '@/app/monitoring/components/attendance-sheet-table';
import { SheetControls } from '@/app/monitoring/components/sheet-controls';
import { Signatories } from '@/app/monitoring/components/signatories';
import type { AttendanceData, AttendanceRow, Logs } from '@/types';
import { isRowEmpty } from '@/utils/is-row-empty';
import { OperationResult } from '@/utils/with-error-handler';
import { CheckCheck, Edit } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function AttendanceSheet({
  workLogs,
  signature,
}: {
  workLogs: Logs | null;
  signature: OperationResult<
    string | null | undefined,
    Record<string, unknown>
  >;
}) {
  const [isEditable, setIsEditable] = useState(false);
  const [hoveredGroup, setHoveredGroup] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [attendanceData, setAttendanceData] = useState<AttendanceData>(() => {
    if (workLogs?.logs && workLogs.logs.length > 0) {
      return workLogs.logs;
    }
    // Default empty groups if no initial data - 40 single-row
    return Array.from({ length: 40 }, () => [
      {
        date: '',
        day: '',
        sched: '',
        timeIn: '',
        timeOut: '',
        destination: '',
        remarks: '',
        signature: '',
      },
    ]);
  });

  const updateCell = (
    groupIndex: number,
    rowIndex: number,
    field: keyof AttendanceRow,
    value: string,
  ) => {
    if (!isEditable) return;

    setAttendanceData((prev) =>
      prev.map((group, gIndex) =>
        gIndex === groupIndex
          ? group.map((row, rIndex) =>
              rIndex === rowIndex ? { ...row, [field]: value } : row,
            )
          : group,
      ),
    );
  };

  const saveSheet = async () => {
    setIsSaving(true);
    const toastId = toast.loading('Saving attendance sheet...');

    try {
      if (workLogs) {
        const { success, error } = await updateWorkLog(
          workLogs.id,
          attendanceData,
        );

        if (!success) {
          toast.error(error);
          return;
        }

        toast.success('Attendance sheet saved!', {
          id: toastId,
          icon: <CheckCheck className="h-4 w-4" />,
        });
      }
      setIsEditable(false);
    } catch (error) {
      console.error(error);
      toast.error('Failed to save attendance sheet.', { id: toastId });
    } finally {
      setTimeout(() => toast.dismiss(toastId), 1500);
      setIsSaving(false);
    }
  };

  const enableEditing = () => {
    setIsEditable(true);
    toast.warning('Edit mode enabled', {
      icon: <Edit className="h-4 w-4" />,
    });
  };

  const addRowToGroup = (groupIndex: number) => {
    if (!isEditable) return;

    // Count non-empty rows across all groups
    const nonEmptyRowsCount = attendanceData.reduce((total, group) => {
      return total + group.filter((row) => !isRowEmpty(row)).length;
    }, 0);

    // Check if we're at capacity (all 40 rows filled with data)
    if (nonEmptyRowsCount >= 40) {
      toast.error('Cannot add row - all 40 rows are filled with data');
      return;
    }

    // Find empty groups at the end to remove
    let emptyGroupsFromEnd = 0;
    for (let i = attendanceData.length - 1; i >= 0; i--) {
      const group = attendanceData[i];
      if (group.length === 1 && isRowEmpty(group[0])) {
        emptyGroupsFromEnd++;
      } else {
        break;
      }
    }

    if (emptyGroupsFromEnd === 0) {
      toast.error('Cannot add row - no empty rows available to remove');
      return;
    }

    // copy of previous data for undo
    const prevData = structuredClone(attendanceData);

    // update the state
    setAttendanceData((prev) => {
      const newData = [...prev];

      // Add completely empty row to the specified group
      newData[groupIndex] = [
        ...newData[groupIndex],
        {
          date: '',
          day: '',
          sched: '',
          timeIn: '',
          timeOut: '',
          destination: '',
          remarks: '',
          signature: '',
        },
      ];

      // Remove one empty group from the end to maintain 40 total rows
      newData.pop();

      return newData;
    });
    toast.warning('You added a row..', {
      action: {
        label: 'Undo',
        onClick: () => {
          setAttendanceData(prevData);
          toast.success('You removed the added row');
        },
      },
    });
  };

  return (
    <main className="min-h-screen bg-white dark:print:bg-white dark:print:text-black dark:bg-slate-900 dark:text-gray-200 px-8 py-8 md:py-16 shadow-lg print:shadow-none print:px-4 print:py-12">
      <AttendanceSheetHeader />

      <SheetControls
        isSaving={isSaving}
        isEditable={isEditable}
        saveSheet={saveSheet}
        enableEditing={enableEditing}
      />

      <div className="mb-4 mx-auto max-w-4xl print:max-w-[700px]">
        <AttendanceSheetTable
          attendanceData={attendanceData}
          hoveredGroup={hoveredGroup}
          isEditable={isEditable}
          setHoveredGroup={setHoveredGroup}
          updateCell={updateCell}
          addRowToGroup={addRowToGroup}
          signature={signature}
        />
      </div>

      <Signatories isEditable={isEditable} signature={signature} />
    </main>
  );
}
