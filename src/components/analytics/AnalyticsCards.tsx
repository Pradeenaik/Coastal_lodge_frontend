import React from "react";
import { AnalyticsStats } from "../../types/analytics";
// import { AnalyticsStats } from "../../types/analytics";

interface AnalyticsCardsProps {
  stats: AnalyticsStats;
  loading: boolean;
}

interface CardDef {
  label: string;
  value: string;
  sub: string;
  glow: string;
  bg: string;
  textColor: string;
  iconBg: string;
  icon: React.ReactNode;
}

const Skeleton: React.FC = () => (
  <div style={{
    borderRadius: 16, border: "1px solid rgba(255,255,255,0.06)",
    background: "rgba(255,255,255,0.03)", padding: "1.25rem",
    animation: "pulse 1.5s ease-in-out infinite",
  }}>
    <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }`}</style>
    <div style={{ height: 10, width: 80, borderRadius: 6, background: "rgba(255,255,255,0.08)", marginBottom: 14 }} />
    <div style={{ height: 28, width: 120, borderRadius: 8, background: "rgba(255,255,255,0.1)", marginBottom: 8 }} />
    <div style={{ height: 8, width: 60, borderRadius: 6, background: "rgba(255,255,255,0.06)" }} />
  </div>
);

const fmt = (n: number) => `₹${n.toLocaleString("en-IN")}`;

const AnalyticsCards: React.FC<AnalyticsCardsProps> = ({ stats, loading }) => {
  if (loading) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "0.75rem" }}>
        {[1,2,3,4].map(i => <Skeleton key={i} />)}
      </div>
    );
  }

  const cards: CardDef[] = [
    {
      label: "Total Revenue",
      value: fmt(stats.totalRevenue),
      sub: `${stats.totalDays} days recorded`,
      glow: "rgba(59,130,246,0.3)",
      bg: "rgba(59,130,246,0.08)",
      textColor: "#bfdbfe",
      iconBg: "rgba(59,130,246,0.18)",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
        </svg>
      ),
    },
    {
      label: "Total Commission",
      value: fmt(stats.totalCommission),
      sub: `${stats.totalRevenue > 0 ? ((stats.totalCommission/stats.totalRevenue)*100).toFixed(1) : 0}% of revenue`,
      glow: "rgba(244,63,94,0.3)",
      bg: "rgba(244,63,94,0.08)",
      textColor: "#fecdd3",
      iconBg: "rgba(244,63,94,0.18)",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fda4af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
          <polyline points="17 18 23 18 23 12"/>
        </svg>
      ),
    },
    {
      label: "Net Profit",
      value: fmt(stats.totalNetProfit),
      sub: `${stats.totalRevenue > 0 ? ((stats.totalNetProfit/stats.totalRevenue)*100).toFixed(1) : 0}% margin`,
      glow: "rgba(16,185,129,0.3)",
      bg: "rgba(16,185,129,0.08)",
      textColor: "#a7f3d0",
      iconBg: "rgba(16,185,129,0.18)",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
          <polyline points="17 6 23 6 23 12"/>
        </svg>
      ),
    },
    {
      label: "Avg Daily Revenue",
      value: fmt(stats.averageDailyRevenue),
      sub: "per recorded day",
      glow: "rgba(139,92,246,0.35)",
      bg: "rgba(139,92,246,0.08)",
      textColor: "#ddd6fe",
      iconBg: "rgba(139,92,246,0.22)",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/>
          <line x1="16" y1="2" x2="16" y2="6"/>
          <line x1="8" y1="2" x2="8" y2="6"/>
          <line x1="3" y1="10" x2="21" y2="10"/>
        </svg>
      ),
    },
  ];

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "0.75rem" }}>
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            position: "relative", borderRadius: 16, overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.08)",
            background: card.bg, padding: "1.25rem",
            boxShadow: `0 0 40px -12px ${card.glow}`,
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "default",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 40px -8px ${card.glow}`;
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 40px -12px ${card.glow}`;
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <p style={{ margin: 0, fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase" as const, color: "rgba(148,163,184,0.7)" }}>
                {card.label}
              </p>
              <p style={{ margin: "10px 0 4px", fontSize: "1.6rem", fontWeight: 800, fontFamily: "Syne, sans-serif", color: card.textColor, lineHeight: 1 }}>
                {card.value}
              </p>
              <p style={{ margin: 0, fontSize: "0.7rem", color: "rgba(148,163,184,0.55)", fontWeight: 500 }}>
                {card.sub}
              </p>
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: card.iconBg,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 4px 16px -2px ${card.glow}`,
            }}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnalyticsCards;