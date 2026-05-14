import React from "react";

interface HeaderProps {
  date: string;
  onDateChange: (date: string) => void;
  onHistoryOpen: () => void;
  activeTab: "dashboard" | "analytics";
  onTabChange: (tab: "dashboard" | "analytics") => void;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  date,
  onDateChange,
  onHistoryOpen,
  activeTab,
  onTabChange,
  onLogout,
}) => {
  const isActive = (tab: "dashboard" | "analytics") => activeTab === tab;

  const tabButtonStyle = (active: boolean): React.CSSProperties => ({
    height: 36,
    borderRadius: 10,
    padding: "0 12px",
    fontSize: "0.78rem",
    fontWeight: 700,
    cursor: "pointer",
    border: active
      ? "1px solid rgba(124,58,237,0.4)"
      : "1px solid transparent",
    background: active ? "rgba(124,58,237,0.15)" : "transparent",
    color: active ? "#a78bfa" : "#94a3b8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    transition: "all 0.2s ease",
    whiteSpace: "nowrap",
    flexShrink: 0,
  });

  const controlButtonStyle: React.CSSProperties = {
    height: 36,
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.05)",
    padding: "0 12px",
    fontSize: "0.8rem",
    fontWeight: 600,
    color: "#cbd5e1",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    transition: "all 0.2s ease",
    flexShrink: 0,
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        width: "100%",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: "rgba(10,10,15,0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0 1rem",
        }}
      >
        <div
          style={{
            minHeight: 72,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            flexWrap: "wrap",
            padding: "12px 0",
          }}
        >
          {/* LEFT SECTION */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              minWidth: 0,
              flex: "1 1 auto",
            }}
          >
            {/* Brand */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background:
                    "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 16px rgba(124,58,237,0.35)",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline
                    points="9 22 9 12 15 12 15 22"
                    stroke="white"
                    strokeWidth="1.5"
                    fill="none"
                  />
                </svg>
              </div>

              {/* Hide text on very small screens */}
              <div className="header-brand-text">
                <p
                  style={{
                    fontSize: "0.62rem",
                    fontWeight: 700,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(167,139,250,0.8)",
                    margin: 0,
                  }}
                >
                  Revenue Control
                </p>

                <h1
                  style={{
                    margin: 0,
                    fontSize: "1rem",
                    fontWeight: 800,
                    fontFamily: "Syne, sans-serif",
                    color: "#fff",
                    lineHeight: 1.2,
                    whiteSpace: "nowrap",
                  }}
                >
                  Hotel Dashboard
                </h1>
              </div>
            </div>

            {/* TABS */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                overflowX: "auto",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              }}
            >
              <button
                onClick={() => onTabChange("dashboard")}
                style={tabButtonStyle(isActive("dashboard"))}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>

                <span>Dashboard</span>
              </button>

              <button
                onClick={() => onTabChange("analytics")}
                style={tabButtonStyle(isActive("analytics"))}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="20" x2="18" y2="10" />
                  <line x1="12" y1="20" x2="12" y2="4" />
                  <line x1="6" y1="20" x2="6" y2="14" />
                </svg>

                <span>Analytics</span>
              </button>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 8,
              flexWrap: "wrap",
              width: "100%",
              flex: "1 1 100%",
            }}
            className="header-controls"
          >
            {/* Date */}
            {activeTab === "dashboard" && (
              <input
                type="date"
                value={date}
                onChange={(e) => onDateChange(e.target.value)}
                style={{
                  height: 36,
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.1)",
                  background: "rgba(255,255,255,0.05)",
                  padding: "0 12px",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  color: "#ffffff",
                  outline: "none",
                  cursor: "pointer",
                  colorScheme: "dark",
                  minWidth: 150,
                  width: "100%",
                  maxWidth: 180,
                }}
              />
            )}

            {/* History */}
            {activeTab === "dashboard" && (
              <button
                onClick={onHistoryOpen}
                style={controlButtonStyle}
              >
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#a78bfa"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>

                <span>History</span>
              </button>
            )}

            {/* Logout */}
            {onLogout && (
              <button
                onClick={onLogout}
                title="Logout"
                style={{
                  height: 36,
                  width: 36,
                  borderRadius: 10,
                  border: "1px solid rgba(244,63,94,0.2)",
                  background: "rgba(244,63,94,0.06)",
                  color: "#fda4af",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* RESPONSIVE CSS */}
      <style>
        {`
          .header-brand-text {
            display: none;
          }

          @media (min-width: 640px) {
            .header-brand-text {
              display: block;
            }

            .header-controls {
              width: auto !important;
              flex: 0 0 auto !important;
            }
          }

          @media (max-width: 639px) {
            .header-controls {
              justify-content: stretch !important;
            }

            .header-controls > * {
              flex: 1;
            }
          }
        `}
      </style>
    </header>
  );
};

export default Header;