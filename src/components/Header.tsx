import React from "react";

interface HeaderProps {
  date: string;
  onDateChange: (date: string) => void;
  onHistoryOpen: () => void;
}

const Header: React.FC<HeaderProps> = ({ date, onDateChange, onHistoryOpen }) => {
  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 30, width: "100%",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      background: "rgba(10,10,15,0.85)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
    }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 1.5rem" }}>
        <div style={{ display: "flex", height: 64, alignItems: "center", justifyContent: "space-between", gap: 16 }}>

          {/* Brand */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10, flexShrink: 0,
              background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 20px rgba(124,58,237,0.4)"
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22" stroke="white" strokeWidth="1.5" fill="none"/>
              </svg>
            </div>
            <div>
              <p style={{ fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(167,139,250,0.8)", margin: 0 }}>
                Revenue Control
              </p>
              <h1 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, lineHeight: 1.2, fontFamily: "Syne, sans-serif", color: "#ffffff" }}>
                Coastal Dashboard
              </h1>
            </div>
          </div>

          {/* Controls */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* Date Picker */}
            <input
              type="date"
              value={date}
              onChange={(e) => onDateChange(e.target.value)}
              style={{
                height: 36, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)", padding: "0 12px",
                fontSize: "0.875rem", fontWeight: 500, color: "#ffffff",
                outline: "none", cursor: "pointer", colorScheme: "dark"
              }}
            />

            {/* History Button */}
            <button
              onClick={onHistoryOpen}
              style={{
                height: 36, borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)",
                background: "rgba(255,255,255,0.05)", padding: "0 16px",
                fontSize: "0.875rem", fontWeight: 600, color: "#cbd5e1",
                cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                transition: "all 0.2s"
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,58,237,0.15)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(124,58,237,0.4)";
                (e.currentTarget as HTMLButtonElement).style.color = "#ffffff";
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
                (e.currentTarget as HTMLButtonElement).style.color = "#cbd5e1";
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              History
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;