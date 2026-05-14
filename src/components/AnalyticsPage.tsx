import React from "react";
import { useAnalytics } from "../hooks/useAnalytics";
import AnalyticsCards from "./analytics/AnalyticsCards";
import MonthlyChart from "./analytics/MonthlyChart";
import WeeklyChart from "./analytics/WeeklyChart";
import TrendChart from "./analytics/TrendChart";
import PerformanceStats from "./analytics/PerformanceStats";
// import { useAnalytics } from "../hooks/useAnalytics";
// import AnalyticsCards from "./analytics/AnalyticsCards";
// import MonthlyChart from "./analytics/MonthlyChart";
// import WeeklyChart from "./analytics/WeeklyChart";
// import TrendChart from "./analytics/TrendChart";
// import PerformanceStats from "./analytics/PerformanceStats";

const AnalyticsPage: React.FC = () => {
  const { data, loading, error, refetch } = useAnalytics();

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1.5rem 5rem" }}>
      {/* Page header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, fontFamily: "Syne, sans-serif", color: "#ffffff" }}>
            Analytics
          </h1>
          <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: "#475569" }}>
            Revenue insights from all recorded days
          </p>
        </div>
        <button
          onClick={refetch}
          disabled={loading}
          style={{
            height: 36, borderRadius: 10, padding: "0 16px",
            fontSize: "0.8rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
            border: "1px solid rgba(124,58,237,0.3)",
            background: "rgba(124,58,237,0.1)", color: "#a78bfa",
            display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s",
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            style={{ animation: loading ? "spin 0.8s linear infinite" : "none" }}>
            <polyline points="23 4 23 10 17 10"/>
            <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
          </svg>
          {loading ? "Refreshing…" : "Refresh"}
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </button>
      </div>

      {/* Error state */}
      {error && (
        <div style={{
          borderRadius: 12, border: "1px solid rgba(244,63,94,0.3)",
          background: "rgba(244,63,94,0.08)", padding: "1rem 1.25rem",
          marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: 12,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fda4af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <span style={{ fontSize: "0.875rem", color: "#fda4af", fontWeight: 500 }}>{error}</span>
          <button onClick={refetch} style={{ marginLeft: "auto", fontSize: "0.75rem", fontWeight: 700, color: "#a78bfa", background: "none", border: "none", cursor: "pointer" }}>
            Retry
          </button>
        </div>
      )}

      {/* Empty state when no data at all */}
      {!loading && !error && data.stats.totalDays === 0 && (
        <div style={{
          borderRadius: 20, border: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
          padding: "4rem 2rem", textAlign: "center", marginBottom: "1.5rem",
        }}>
          <div style={{ width: 64, height: 64, borderRadius: 18, background: "rgba(124,58,237,0.1)", border: "1px solid rgba(124,58,237,0.2)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </div>
          <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#94a3b8", fontFamily: "Syne, sans-serif" }}>
            No analytics data yet
          </h2>
          <p style={{ margin: "8px 0 0", fontSize: "0.8rem", color: "#475569" }}>
            Save some days from the Dashboard to start seeing revenue insights.
          </p>
        </div>
      )}

      {/* Summary cards */}
      <section style={{ marginBottom: "1.5rem" }}>
        <AnalyticsCards stats={data.stats} loading={loading} />
      </section>

      {/* Charts row */}
      <section style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: "1rem", marginBottom: "1rem" }}>
        <MonthlyChart data={data.monthlyRevenue} loading={loading} />
        <WeeklyChart data={data.weeklyRevenue} loading={loading} />
      </section>

      {/* Full-width trend chart */}
      <section style={{ marginBottom: "1rem" }}>
        <TrendChart data={data.dailyTrend} loading={loading} />
      </section>

      {/* Performance highlights */}
      <section>
        <PerformanceStats stats={data.stats} loading={loading} />
      </section>
    </div>
  );
};

export default AnalyticsPage;