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
      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
      gap: "clamp(0.5rem, 2vw, 0.75rem)",
      width: "100%",
      alignItems: "stretch",
      padding: "0 clamp(0.5rem, 2vw, 1rem)",
      boxSizing: "border-box",
    }}>
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            position: "relative",
            borderRadius: "clamp(12px, 3vw, 16px)",
            border: "1px solid rgba(255,255,255,0.08)",
            background: card.bg,
            padding: "clamp(0.75rem, 2vw, 1.25rem)",
            backdropFilter: "blur(8px)",
            boxShadow: `0 0 40px -12px ${card.glow}`,
            overflow: "hidden",
            transition: "transform 0.2s, box-shadow 0.2s",
            width: "100%",
            minWidth: 0,
            boxSizing: "border-box",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
          }}
        >
          <div style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "clamp(8px, 2vw, 12px)",
            width: "100%",
            minWidth: 0,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{
                margin: 0,
                fontSize: "clamp(0.55rem, 1.8vw, 0.65rem)",
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                color: "rgba(148,163,184,0.7)",
                lineHeight: 1.4,
                wordBreak: "break-word",
              }}>
                {card.label}
              </p>

              <p style={{
                margin: "clamp(4px, 1.5vw, 8px) 0 0",
                fontSize: "clamp(0.9rem, 3.5vw, 1.5rem)",
                fontWeight: 800,
                fontFamily: "Syne, sans-serif",
                color: card.textColor,
                lineHeight: 1.1,
                wordBreak: "break-word",
                overflowWrap: "break-word",
              }}>
                ₹{card.value.toLocaleString("en-IN")}
              </p>
            </div>

            <div style={{
              width: "clamp(28px, 7vw, 40px)",
              height: "clamp(28px, 7vw, 40px)",
              borderRadius: "clamp(8px, 2.5vw, 10px)",
              flexShrink: 0,
              background: card.iconBg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 4px 16px -2px ${card.glow}`
            }}>
              {/* Make SVG responsive */}
              {React.cloneElement(card.icon as React.ReactElement, {
                width: "clamp(14px, 4vw, 20px)",
                height: "clamp(14px, 4vw, 20px)",
              })}
            </div>
          </div>
        </div>
      ))}

      {/* Responsive media query for smaller screens */}
      <style>{`
        @media (max-width: 768px) {
          .summary-cards-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.75rem !important;
          }
        }
        @media (max-width: 480px) {
          .summary-cards-grid {
            grid-template-columns: 1fr !important;
            gap: 0.625rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default SummaryCards;