import React, { useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from "recharts";
import { MonthlyRevenue } from "../../types/analytics";

interface MonthlyChartProps {
  data: MonthlyRevenue[];
  loading: boolean;
}

const ChartSkeleton: React.FC = () => (
  <div
    style={{
      height: 300,
      borderRadius: 16,
      border: "1px solid rgba(255,255,255,0.06)",
      background: "rgba(255,255,255,0.02)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      animation: "pulse 1.5s ease-in-out infinite",
    }}
  >
    <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}`}</style>
    <p style={{ color: "#475569", fontSize: "0.8rem" }}>Loading chart…</p>
  </div>
);

const CustomTooltip: React.FC<{
  active?: boolean;
  payload?: { dataKey: string; name: string; value: number; color: string }[];
  label?: string;
}> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const fmt = (n: number) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

  const meta: Record<string, { label: string; color: string }> = {
    revenue: { label: "Revenue", color: "#a78bfa" },
    commission: { label: "Commission", color: "#fb7185" },
    trueEarning: { label: "True Earning", color: "#34d399" },
    net: { label: "True Earning", color: "#34d399" },
  };

  return (
    <div
      style={{
        background: "#13131f",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 12,
        padding: "10px 14px",
        minWidth: 175,
        boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
      }}
    >
      <p style={{ margin: "0 0 8px", fontSize: "0.75rem", color: "#94a3b8", fontWeight: 700 }}>
        {label}
      </p>
      {payload.map((p) => {
        const key = (p.dataKey || p.name) as string;
        const info = meta[key] || { label: p.name || key, color: p.color || "#e2e8f0" };
        const isTrueEarning = key === "trueEarning" || key === "net";

        return (
          <div
            key={key}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 20,
              marginTop: isTrueEarning ? 6 : 4,
              paddingTop: isTrueEarning ? 6 : 0,
              borderTop: isTrueEarning ? "1px solid rgba(255,255,255,0.08)" : "none",
            }}
          >
            <span style={{ fontSize: "0.75rem", color: info.color, fontWeight: 600 }}>
              {info.label}
            </span>
            <span
              style={{
                fontSize: isTrueEarning ? "0.85rem" : "0.78rem",
                color: isTrueEarning ? "#34d399" : "#e2e8f0",
                fontWeight: isTrueEarning ? 800 : 700,
              }}
            >
              {fmt(p.value)}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const MonthlyChart: React.FC<MonthlyChartProps> = ({ data, loading }) => {
  const cardStyle: React.CSSProperties = {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.07)",
    background: "rgba(255,255,255,0.02)",
    padding: "1.5rem",
  };

  const chartData = useMemo(() => {
    return data.map((d) => {
      const revenue = d.revenue ?? d.total ?? 0;
      const commission = d.commission ?? 0;
      const net = d.net ?? d.trueEarning ?? (revenue - commission);
      return {
        month: d.month,
        revenue,
        commission,
        net,
        trueEarning: net,
      };
    });
  }, [data]);

  return (
    <div style={cardStyle}>
      <div style={{ marginBottom: "1.25rem" }}>
        <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, fontFamily: "Syne, sans-serif", color: "#e2e8f0" }}>
          Monthly Overview
        </h3>
        <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#475569" }}>
          Revenue, commission and true earnings per month
        </p>
      </div>

      {loading ? (
        <ChartSkeleton />
      ) : chartData.length === 0 ? (
        <EmptyChart message="No monthly data yet" />
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            barGap={3}
          >
            <defs>
              <linearGradient id="monthRevGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a78bfa" stopOpacity={1} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0.85} />
              </linearGradient>
              <linearGradient id="monthCommGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fb7185" stopOpacity={1} />
                <stop offset="100%" stopColor="#e11d48" stopOpacity={0.85} />
              </linearGradient>
              <linearGradient id="monthNetGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
                <stop offset="100%" stopColor="#059669" stopOpacity={0.85} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fill: "#64748b", fontSize: 11, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "#64748b", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              width={48}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)", radius: 6 }} />
            <Legend
              formatter={(value) => {
                const labelMap: Record<string, string> = {
                  revenue: "Revenue",
                  commission: "Commission",
                  trueEarning: "True Earning",
                  Revenue: "Revenue",
                  Commission: "Commission",
                  "True Earning": "True Earning",
                };
                return (
                  <span style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: 600 }}>
                    {labelMap[value] || value}
                  </span>
                );
              }}
              wrapperStyle={{ paddingTop: 14 }}
            />
            <Bar
              dataKey="revenue"
              name="Revenue"
              fill="url(#monthRevGrad)"
              radius={[4, 4, 0, 0]}
              maxBarSize={22}
            />
            <Bar
              dataKey="commission"
              name="Commission"
              fill="url(#monthCommGrad)"
              radius={[4, 4, 0, 0]}
              maxBarSize={22}
            />
            <Bar
              dataKey="trueEarning"
              name="True Earning"
              fill="url(#monthNetGrad)"
              radius={[4, 4, 0, 0]}
              maxBarSize={22}
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

const EmptyChart: React.FC<{ message: string }> = ({ message }) => (
  <div
    style={{
      height: 300,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    }}
  >
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
    <p style={{ margin: 0, fontSize: "0.8rem", color: "#475569", fontWeight: 600 }}>{message}</p>
  </div>
);

export default MonthlyChart;
