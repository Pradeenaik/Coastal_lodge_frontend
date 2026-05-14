import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Dot,
} from "recharts";
import { WeeklyRevenue } from "../../types/analytics";
// import { WeeklyRevenue } from "../../types/analytics";

interface WeeklyChartProps {
  data: WeeklyRevenue[];
  loading: boolean;
}

const CustomTooltip: React.FC<{ active?: boolean; payload?: { value: number }[]; label?: string }> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px" }}>
      <p style={{ margin: "0 0 4px", fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600 }}>{label}</p>
      <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#6ee7b7" }}>
        ₹{payload[0].value.toLocaleString("en-IN")}
      </p>
    </div>
  );
};

const CustomDot: React.FC<{ cx?: number; cy?: number; value?: number }> = ({ cx, cy }) => (
  <circle cx={cx} cy={cy} r={4} fill="#10b981" stroke="#064e3b" strokeWidth={2} />
);

const WeeklyChart: React.FC<WeeklyChartProps> = ({ data, loading }) => {
  const cardStyle: React.CSSProperties = {
    borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(255,255,255,0.02)", padding: "1.5rem",
  };

  return (
    <div style={cardStyle}>
      <div style={{ marginBottom: "1.25rem" }}>
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, fontFamily: "Syne, sans-serif", color: "#e2e8f0" }}>
          Weekly Revenue
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#475569" }}>
          Revenue growth across weeks
        </p>
      </div>

      {loading ? <ChartSkeleton /> : data.length === 0 ? (
        <EmptyChart message="No weekly data yet" />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} width={48} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="total"
              stroke="url(#lineGrad)"
              strokeWidth={2.5}
              dot={<CustomDot />}
              activeDot={{ r: 6, fill: "#10b981", stroke: "#064e3b", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

const ChartSkeleton: React.FC = () => (
  <div style={{ height: 280, borderRadius: 10, background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse 1.5s ease-in-out infinite" }}>
    <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    <p style={{ color: "#475569", fontSize: "0.8rem" }}>Loading chart…</p>
  </div>
);

const EmptyChart: React.FC<{ message: string }> = ({ message }) => (
  <div style={{ height: 280, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
    <p style={{ margin: 0, fontSize: "0.8rem", color: "#475569", fontWeight: 600 }}>{message}</p>
  </div>
);

export default WeeklyChart;