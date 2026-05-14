import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { DailyTrend } from "../../types/analytics";
// import { DailyTrend } from "../../types/analytics";

interface TrendChartProps {
  data: DailyTrend[];
  loading: boolean;
}

const CustomTooltip: React.FC<{ active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;
  const labelMap: Record<string, string> = { revenue: "Revenue", commission: "Commission", net: "Net Profit" };
  return (
    <div style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px", minWidth: 160 }}>
      <p style={{ margin: "0 0 8px", fontSize: "0.72rem", color: "#94a3b8", fontWeight: 600 }}>{label}</p>
      {payload.map((p) => (
        <div key={p.name} style={{ display: "flex", justifyContent: "space-between", gap: 24, marginBottom: 4 }}>
          <span style={{ fontSize: "0.75rem", color: p.color, fontWeight: 600 }}>{labelMap[p.name] || p.name}</span>
          <span style={{ fontSize: "0.75rem", color: "#e2e8f0", fontWeight: 700 }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

// Shorten date label: "2026-05-01" → "May 1"
function shortDate(d: string): string {
  try {
    const dt = new Date(d);
    return dt.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
  } catch { return d; }
}

const TrendChart: React.FC<TrendChartProps> = ({ data, loading }) => {
  const chartData = data.map(d => ({ ...d, date: shortDate(d.date) }));

  return (
    <div style={{ borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.02)", padding: "1.5rem" }}>
      <div style={{ marginBottom: "1.25rem" }}>
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, fontFamily: "Syne, sans-serif", color: "#e2e8f0" }}>
          Daily Revenue Trend
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#475569" }}>
          Revenue, commission and net profit over time
        </p>
      </div>

      {loading ? <ChartSkeleton /> : data.length === 0 ? (
        <EmptyChart />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradCommission" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradNet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="date" tick={{ fill: "#64748b", fontSize: 10, fontWeight: 600 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
            <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} width={48} />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => {
                const m: Record<string, string> = { revenue: "Revenue", commission: "Commission", net: "Net Profit" };
                return <span style={{ color: "#94a3b8", fontSize: "0.72rem", fontWeight: 600 }}>{m[value] || value}</span>;
              }}
              wrapperStyle={{ paddingTop: 12 }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} fill="url(#gradRevenue)" />
            <Area type="monotone" dataKey="commission" stroke="#f43f5e" strokeWidth={2} fill="url(#gradCommission)" />
            <Area type="monotone" dataKey="net" stroke="#10b981" strokeWidth={2} fill="url(#gradNet)" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

const ChartSkeleton: React.FC = () => (
  <div style={{ height: 300, borderRadius: 10, background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse 1.5s ease-in-out infinite" }}>
    <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    <p style={{ color: "#475569", fontSize: "0.8rem" }}>Loading chart…</p>
  </div>
);

const EmptyChart: React.FC = () => (
  <div style={{ height: 300, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18"/><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
    </svg>
    <p style={{ margin: 0, fontSize: "0.8rem", color: "#475569", fontWeight: 600 }}>No trend data yet</p>
  </div>
);

export default TrendChart;