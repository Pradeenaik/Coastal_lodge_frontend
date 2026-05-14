export interface MonthlyRevenue {
  month: string;
  total: number;
}

export interface WeeklyRevenue {
  week: string;
  total: number;
}

export interface DailyTrend {
  date: string;
  revenue: number;
  commission: number;
  net: number;
}

export interface AnalyticsStats {
  totalRevenue: number;
  totalCommission: number;
  totalNetProfit: number;
  averageDailyRevenue: number;
  bestRevenueDay: { date: string; amount: number } | null;
  lowestRevenueDay: { date: string; amount: number } | null;
  highestCommissionDay: { date: string; amount: number } | null;
  totalDays: number;
}

export interface AnalyticsData {
  monthlyRevenue: MonthlyRevenue[];
  weeklyRevenue: WeeklyRevenue[];
  dailyTrend: DailyTrend[];
  stats: AnalyticsStats;
}