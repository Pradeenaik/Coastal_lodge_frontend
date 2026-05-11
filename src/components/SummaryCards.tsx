import React from "react";

interface SummaryCardsProps {
  totalAmount: number;
  totalCommission: number;
  netTotal: number;
  overallTotal: number;
}

interface CardDef {
  label: string;
  value: number;
  glow: string;
  bg: string;
  textColor: string;
  iconBg: string;
  icon: React.ReactNode;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({
  totalAmount, totalCommission, netTotal, overallTotal,
}) => {
  const cards: CardDef[] = [
    {
      label: "Total Amount",
      value: totalAmount,
      glow: "rgba(59,130,246,0.3)",
      bg: "rgba(59,130,246,0.08)",
      textColor: "#bfdbfe",
      iconBg: "rgba(59,130,246,0.2)",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
        </svg>
      ),
    },
    {
      label: "Total Commission",
      value: totalCommission,
      glow: "rgba(244,63,94,0.3)",
      bg: "rgba(244,63,94,0.08)",
      textColor: "#fecdd3",
      iconBg: "rgba(244,63,94,0.2)",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fda4af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/>
        </svg>
      ),
    },
    {
      label: "Net Total",
      value: netTotal,
      glow: "rgba(16,185,129,0.3)",
      bg: "rgba(16,185,129,0.08)",
      textColor: "#a7f3d0",
      iconBg: "rgba(16,185,129,0.2)",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
      ),
    },
    {
      label: "Overall Total",
      value: overallTotal,
      glow: "rgba(139,92,246,0.35)",
      bg: "rgba(139,92,246,0.1)",
      textColor: "#ddd6fe",
      iconBg: "rgba(139,92,246,0.25)",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c4b5fd" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
        </svg>
      ),
    },
  ];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "0.75rem"
    }}>
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            position: "relative",
            borderRadius: 16,
            border: "1px solid rgba(255,255,255,0.08)",
            background: card.bg,
            padding: "1.25rem",
            backdropFilter: "blur(8px)",
            boxShadow: `0 0 40px -12px ${card.glow}`,
            overflow: "hidden",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
          }}
        >
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div>
              <p style={{ margin: 0, fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(148,163,184,0.7)" }}>
                {card.label}
              </p>
              <p style={{ margin: "8px 0 0", fontSize: "1.5rem", fontWeight: 800, fontFamily: "Syne, sans-serif", color: card.textColor, lineHeight: 1 }}>
                ₹{card.value.toLocaleString("en-IN")}
              </p>
            </div>
            <div style={{
              width: 40, height: 40, borderRadius: 10, flexShrink: 0,
              background: card.iconBg,
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: `0 4px 16px -2px ${card.glow}`
            }}>
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;