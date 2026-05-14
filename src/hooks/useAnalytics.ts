import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import api from "../lib/api";
import { AnalyticsData } from "../types/analytics";

const EMPTY: AnalyticsData = {
  monthlyRevenue: [],
  weeklyRevenue: [],
  dailyTrend: [],
  stats: {
    totalRevenue: 0,
    totalCommission: 0,
    totalNetProfit: 0,
    averageDailyRevenue: 0,
    bestRevenueDay: null,
    lowestRevenueDay: null,
    highestCommissionDay: null,
    totalDays: 0,
  },
};

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: res } = await api.get<AnalyticsData>("/analytics");
      setData(res);
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to load analytics.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  return { data, loading, error, refetch: fetchAnalytics };
}