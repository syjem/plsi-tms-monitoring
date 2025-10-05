export interface Employee {
  id: string;
  name: string;
}

export interface Log {
  BreakIn: string;
  BreakOut: string;
  Date: string;
  Day: string;
  Remarks: string;
  Shift: string;
  TimeIn: string;
  TimeOut: string;
}

export interface Data {
  employee: Employee;
  logs: Log[];
}

// Define the structure for each row
export interface AttendanceRow {
  date: string;
  day: string;
  sched: string;
  timeIn: string;
  timeOut: string;
  destination: string;
  remarks: string;
  signature: string;
}

export type AttendanceGroup = AttendanceRow[];
export type AttendanceData = AttendanceGroup[];

export interface ApiLogData {
  BreakIn: string;
  BreakOut: string;
  Date: string;
  Day: string;
  Remarks: string;
  Shift: string;
  TimeIn: string;
  TimeOut: string;
}

export interface AttendanceSheetProps {
  initialData?: ApiLogData[];
  employee: {
    id: string;
    name: string;
  };
}
