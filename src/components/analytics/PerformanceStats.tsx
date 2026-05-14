import React from "react";
import { AnalyticsStats } from "../../types/analytics";
// import { AnalyticsStats } from "../../types/analytics";

interface PerformanceStatsProps {
  stats: AnalyticsStats;
  loading: boolean;
}

function fmtDate(d: string | null | undefined): string {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return d; }
}

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const StatCard: React.FC<{
  label: string;
  dateStr: string;
  amount: number;
  accent: string;
  bg: string;
  icon: React.ReactNode;
  formatter?: (value : number) => string;
}> = ({ label, dateStr, amount, accent, bg, icon, formatter = fmt }) => (
  <div style={{
    borderRadius: 14, border: "1px solid rgba(255,255,255,0.07)",
    background: bg, padding: "1.1rem 1.25rem",
    display: "flex", alignItems: "center", gap: 14,
    transition: "transform 0.2s",
  }}
    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)"}
    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"}
  >
    <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      {icon}
    </div>
    <div style={{ minWidth: 0 }}>
      <p style={{ margin: 0, fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: "#64748b" }}>{label}</p>
      <p style={{ margin: "4px 0 2px", fontSize: "1.1rem", fontWeight: 800, color: accent, fontFamily: "Syne, sans-serif" }}>{formatter(amount)}</p>
      <p style={{ margin: 0, fontSize: "0.7rem", color: "#475569", fontWeight: 500 }}>{dateStr}</p>
    </div>
  </div>
);

const SkeletonCard: React.FC = () => (
  <div style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", padding: "1.1rem 1.25rem", animation: "pulse 1.5s ease-in-out infinite" }}>
    <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    <div style={{ height: 8, width: 80, borderRadius: 4, background: "rgba(255,255,255,0.07)", marginBottom: 10 }} />
    <div style={{ height: 20, width: 100, borderRadius: 6, background: "rgba(255,255,255,0.1)", marginBottom: 6 }} />
    <div style={{ height: 8, width: 60, borderRadius: 4, background: "rgba(255,255,255,0.06)" }} />
  </div>
);

const PerformanceStats: React.FC<PerformanceStatsProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", padding: "1.5rem" }}>
        <div style={{ height: 14, width: 160, borderRadius: 6, background: "rgba(255,255,255,0.08)", marginBottom: 16 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "0.75rem" }}>
          {[1,2,3,4].map(i => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  const performances = [
    {
      label: "Best Revenue Day",
      dateStr: fmtDate(stats.bestRevenueDay?.date),
      amount: stats.bestRevenueDay?.amount ?? 0,
      accent: "#6ee7b7",
      bg: "rgba(16,185,129,0.05)",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
          <polyline points="17 6 23 6 23 12"/>
        </svg>
      ),
    },
    {
      label: "Lowest Revenue Day",
      dateStr: fmtDate(stats.lowestRevenueDay?.date),
      amount: stats.lowestRevenueDay?.amount ?? 0,
      accent: "#fda4af",
      bg: "rgba(244,63,94,0.05)",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fda4af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
          <polyline points="17 18 23 18 23 12"/>
        </svg>
      ),
    },
    {
      label: "Highest Commission Day",
      dateStr: fmtDate(stats.highestCommissionDay?.date),
      amount: stats.highestCommissionDay?.amount ?? 0,
      accent: "#fbbf24",
      bg: "rgba(245,158,11,0.05)",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      ),
    },
    {
      label: "Total Days Recorded",
      dateStr: "all time",
      formatter: (n: number) => n.toString(),
      amount: stats.totalDays,
      accent: "#c4b5fd",
      bg: "rgba(139,92,246,0.05)",
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
  ];

  return (
    <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", padding: "1.5rem" }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, fontFamily: "Syne, sans-serif", color: "#e2e8f0" }}>
          Performance Highlights
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#475569" }}>
          Key milestones from your recorded data
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "0.75rem" }}>
        {performances.map((p) => (
          <StatCard key={p.label} {...p} />
        ))}
      </div>
    </div>
  );
};

export default PerformanceStats;