export type CommissionType = "" | "Driver" | "Custom";

export interface Room {
  roomNumber: number;
  amount: number;
  commission: number;
  commissionType: CommissionType;
}

export interface ApiRoom {
  roomNumber: number;
  amount: number;
  commission: number;
  _id?: string;
}

export interface DayPayload {
  date: string;
  rooms: Room[];
}

export interface DaySummary {
  _id?: string;
  date: string;
  totalAmount: number;
  totalCommission: number;
  netTotal: number;
  rooms: ApiRoom[];
}

export interface SummaryResponse {
  days: DaySummary[];
  overallTotal: number;
}