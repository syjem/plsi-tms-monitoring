import type { ApiLogData } from '@/types';

export const isRowHasRecords = (row: ApiLogData): boolean => {
  return [row.TimeIn, row.TimeOut, row.BreakOut, row.BreakIn].some(
    (val) => val && val.trim() !== '',
  );
};
