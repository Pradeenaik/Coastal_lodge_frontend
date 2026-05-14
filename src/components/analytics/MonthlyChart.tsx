import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell,
} from "recharts";
import { MonthlyRevenue } from "../../types/analytics";
// import { MonthlyRevenue } from "../../types/analytics";

interface MonthlyChartProps {
  data: MonthlyRevenue[];
  loading: boolean;
}

const ChartSkeleton: React.FC = () => (
  <div style={{ height: 280, borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", justifyContent: "center", animation: "pulse 1.5s ease-in-out infinite" }}>
    <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    <p style={{ color: "#475569", fontSize: "0.8rem" }}>Loading chart…</p>
  </div>
);

const CustomTooltip: React.FC<{ active?: boolean; payload?: { value: number }[]; label?: string }> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#13131f", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 14px" }}>
      <p style={{ margin: "0 0 4px", fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600 }}>{label}</p>
      <p style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#a78bfa" }}>
        ₹{payload[0].value.toLocaleString("en-IN")}
      </p>
    </div>
  );
};

const COLORS = ["#7c3aed","#6d28d9","#5b21b6","#8b5cf6","#a78bfa","#7c3aed","#6d28d9","#5b21b6","#8b5cf6","#a78bfa","#7c3aed","#6d28d9"];

const MonthlyChart: React.FC<MonthlyChartProps> = ({ data, loading }) => {
  const cardStyle: React.CSSProperties = {
    borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(255,255,255,0.02)", padding: "1.5rem",
  };

  return (
    <div style={cardStyle}>
      <div style={{ marginBottom: "1.25rem" }}>
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, fontFamily: "Syne, sans-serif", color: "#e2e8f0" }}>
          Monthly Revenue
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#475569" }}>
          Total revenue collected per month
        </p>
      </div>

      {loading ? <ChartSkeleton /> : data.length === 0 ? (
        <EmptyChart message="No monthly data yet" />
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }} barSize={32}>
            <defs>
              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity={1} />
                <stop offset="100%" stopColor="#6d28d9" stopOpacity={0.8} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} width={48} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(139,92,246,0.06)", radius: 6 }} />
            <Bar dataKey="total" fill="url(#barGrad)" radius={[6,6,0,0]}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} fillOpacity={0.85} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

const EmptyChart: React.FC<{ message: string }> = ({ message }) => (
  <div style={{ height: 280, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
    </svg>
    <p style={{ margin: 0, fontSize: "0.8rem", color: "#475569", fontWeight: 600 }}>{message}</p>
  </div>
);

export default MonthlyChart;