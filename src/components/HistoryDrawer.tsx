import React, { useEffect, useState } from "react";
import { DaySummary, ApiRoom } from "../types/room";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  days: DaySummary[];
  onJumpToDate?: (date: string) => void;
  onClearHistory?: () => void;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
  } catch { return dateStr; }
}

// ── StatPill ─────────────────────────────────────────────────────────────────
const StatPill: React.FC<{ label: string; value: number; textColor: string; bg: string }> = ({ label, value, textColor, bg }) => (
  <div style={{ borderRadius: 10, background: bg, padding: "8px 6px", textAlign: "center" }}>
    <p style={{ margin: 0, fontSize: "clamp(0.55rem, 2vw, 0.6rem)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: textColor, marginBottom: 4 }}>{label}</p>
    <p style={{ margin: 0, fontSize: "clamp(0.7rem, 3vw, 0.8rem)", fontWeight: 800, color: textColor }}>&#8377;{value.toLocaleString("en-IN")}</p>
  </div>
);

// ── RoomRow ───────────────────────────────────────────────────────────────────
const RoomRow: React.FC<{ room: ApiRoom }> = ({ room }) => {
  // console.log("room details", room)
  const hasActivity = room.amount > 0 || room.commission > 0;
  const commissionLabel = room.commissionType || "";
  const isDriver = room.commissionType === "Driver";
  
  return (
    <div style={{
      display: "grid", 
      gridTemplateColumns: "minmax(36px, auto) minmax(80px, 1fr) minmax(80px, 1fr) minmax(60px, auto)",
      alignItems: "center",
      gap: "clamp(4px, 2vw, 8px)", 
      padding: "clamp(5px, 2vw, 7px) clamp(8px, 2vw, 10px)", 
      borderRadius: 8,
      background: hasActivity ? "rgba(124,58,237,0.06)" : "transparent",
      border: hasActivity ? "1px solid rgba(124,58,237,0.15)" : "1px solid transparent",
      opacity: hasActivity ? 1 : 0.35,
    }}>
      <div style={{ 
        width: "clamp(24px, 5vw, 28px)", 
        height: "clamp(24px, 5vw, 28px)", 
        borderRadius: 6, 
        background: hasActivity ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        fontSize: "clamp(0.6rem, 2.5vw, 0.65rem)", 
        fontWeight: 800, 
        color: hasActivity ? "#a78bfa" : "#475569" 
      }}>
        {room.roomNumber}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: "clamp(0.5rem, 2vw, 0.58rem)", color: "#475569", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Amount</p>
        <p style={{ margin: 0, fontSize: "clamp(0.7rem, 3vw, 0.8rem)", fontWeight: 700, color: hasActivity ? "#e2e8f0" : "#475569" }}>&#8377;{room.amount.toLocaleString("en-IN")}</p>
      </div>
      <div>
        <p style={{ margin: 0, fontSize: "clamp(0.5rem, 2vw, 0.58rem)", color: "#475569", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Commission</p>
        <p style={{ margin: 0, fontSize: "clamp(0.7rem, 3vw, 0.8rem)", fontWeight: 700, color: room.commission > 0 ? "#fda4af" : "#475569" }}>
          {room.commission > 0 ? `₹${room.commission.toLocaleString("en-IN")}` : "—"}
        </p>
      </div>
      <div style={{ textAlign: "right" }}>
        {commissionLabel && (
          <span style={{ 
            fontSize: "clamp(0.5rem, 2vw, 0.55rem)", 
            fontWeight: 700, 
            letterSpacing: "0.08em", 
            textTransform: "uppercase" as const, 
            padding: "2px clamp(4px, 2vw, 6px)", 
            borderRadius: 6, 
            background: isDriver ? "rgba(99,102,241,0.15)" : "rgba(245,158,11,0.15)", 
            color: isDriver ? "#818cf8" : "#fbbf24", 
            border: isDriver ? "1px solid rgba(99,102,241,0.25)" : "1px solid rgba(245,158,11,0.25)",
            whiteSpace: "nowrap"
          }}>
            {commissionLabel}
          </span>
        )}
      </div>
    </div>
  );
};

// ── HistoryCard ───────────────────────────────────────────────────────────────
const HistoryCard: React.FC<{ day: DaySummary; onJumpToDate?: (date: string) => void }> = ({ day, onJumpToDate }) => {
  const [expanded, setExpanded] = useState(false);
  const occupiedRooms = (day.rooms || []).filter(r => r.amount > 0 || r.commission > 0);
  
  return (
    <div style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", overflow: "hidden", transition: "border-color 0.2s" }}>
      <div style={{ padding: "clamp(12px, 3vw, 14px) clamp(12px, 3vw, 14px) clamp(10px, 2.5vw, 12px)" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "clamp(8px, 2vw, 12px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "clamp(6px, 2vw, 8px)" }}>
              <svg width="clamp(11px, 3vw, 13px)" height="clamp(11px, 3vw, 13px)" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span style={{ fontSize: "clamp(0.7rem, 3vw, 0.8rem)", fontWeight: 700, color: "#e2e8f0" }}>{formatDate(day.date)}</span>
            </div>
            <div style={{ display: "flex", gap: "clamp(4px, 2vw, 6px)" }}>
              {onJumpToDate && (
                <button onClick={() => onJumpToDate(day.date)} style={{ 
                  height: "clamp(24px, 4vw, 26px)", 
                  borderRadius: 6, 
                  padding: "0 clamp(8px, 2vw, 10px)", 
                  fontSize: "clamp(0.6rem, 2.5vw, 0.65rem)", 
                  fontWeight: 700, 
                  cursor: "pointer", 
                  border: "1px solid rgba(124,58,237,0.3)", 
                  background: "rgba(124,58,237,0.1)", 
                  color: "#a78bfa",
                  whiteSpace: "nowrap"
                }}>
                  &#8599; Load
                </button>
              )}
              {day.rooms && day.rooms.length > 0 && (
                <button onClick={() => setExpanded(p => !p)} style={{ 
                  height: "clamp(24px, 4vw, 26px)", 
                  borderRadius: 6, 
                  padding: "0 clamp(8px, 2vw, 10px)", 
                  fontSize: "clamp(0.6rem, 2.5vw, 0.65rem)", 
                  fontWeight: 700, 
                  cursor: "pointer", 
                  border: "1px solid rgba(255,255,255,0.08)", 
                  background: "rgba(255,255,255,0.04)", 
                  color: "#94a3b8", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "4px",
                  whiteSpace: "nowrap"
                }}>
                  <span style={{ display: "inline-block", transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", lineHeight: 1 }}>&#9660;</span>
                  {occupiedRooms.length} room{occupiedRooms.length !== 1 ? "s" : ""}
                </button>
              )}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 120px), 1fr))", gap: "clamp(6px, 2vw, 8px)" }}>
            <StatPill label="Amount" value={day.totalAmount} textColor="#93c5fd" bg="rgba(59,130,246,0.1)" />
            <StatPill label="Commission" value={day.totalCommission} textColor="#fda4af" bg="rgba(244,63,94,0.1)" />
            <StatPill label="Net" value={day.netTotal} textColor="#6ee7b7" bg="rgba(16,185,129,0.1)" />
          </div>
        </div>
      </div>
      {expanded && day.rooms && day.rooms.length > 0 && (
        <div style={{ 
          borderTop: "1px solid rgba(255,255,255,0.06)", 
          padding: "clamp(8px, 2vw, 10px)", 
          background: "rgba(0,0,0,0.25)", 
          maxHeight: "clamp(280px, 40vh, 320px)", 
          overflowY: "auto", 
          display: "flex", 
          flexDirection: "column", 
          gap: "4px" 
        }}>
          <p style={{ margin: "0 0 6px 2px", fontSize: "clamp(0.55rem, 2vw, 0.6rem)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#475569" }}>
            Room Breakdown — {occupiedRooms.length} active
          </p>
          {day.rooms.map(room => <RoomRow key={room.roomNumber} room={room} />)}
        </div>
      )}
    </div>
  );
};

// ── HistoryDrawer ─────────────────────────────────────────────────────────────
const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose, days, onJumpToDate, onClearHistory }) => {
  const [search, setSearch] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => { if (!isOpen) setConfirmClear(false); }, [isOpen]);

  const filtered = days
    .filter(d => d.date.includes(search) || formatDate(d.date).toLowerCase().includes(search.toLowerCase()))
    .slice().reverse();

  const allAmount = days.reduce((s, d) => s + d.totalAmount, 0);
  const allComm = days.reduce((s, d) => s + d.totalCommission, 0);
  const allNet = days.reduce((s, d) => s + d.netTotal, 0);

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        style={{ 
          position: "fixed", 
          inset: 0, 
          zIndex: 40, 
          background: "rgba(0,0,0,0.65)", 
          backdropFilter: "blur(4px)", 
          WebkitBackdropFilter: "blur(4px)", 
          opacity: isOpen ? 1 : 0, 
          pointerEvents: isOpen ? "auto" : "none", 
          transition: "opacity 0.3s" 
        }} 
      />

      {/* Drawer */}
<aside style={{ 
  position: "fixed", 
  right: 0, 
  top: 0, 
  zIndex: 50, 
  width: "100%", 
  maxWidth: "min(440px, 95vw)", 
  height: "100vh", /* Changed from "100%" to "100vh" for explicit height */
  display: "flex", 
  flexDirection: "column", 
  borderLeft: "1px solid rgba(255,255,255,0.07)", 
  background: "#0c0c14", 
  transform: isOpen ? "translateX(0)" : "translateX(100%)", 
  transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)" 
}}>

        {/* Header */}
        <div style={{ 
          borderBottom: "1px solid rgba(255,255,255,0.07)", 
          padding: "clamp(0.75rem, 3vw, 1rem) clamp(1rem, 3vw, 1.25rem)", 
          flexShrink: 0 
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 2.5vw, 10px)" }}>
              <div style={{ 
                width: "clamp(28px, 6vw, 32px)", 
                height: "clamp(28px, 6vw, 32px)", 
                borderRadius: 8, 
                background: "rgba(124,58,237,0.15)", 
                border: "1px solid rgba(124,58,237,0.3)", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center" 
              }}>
                <svg width="clamp(13px, 3vw, 15px)" height="clamp(13px, 3vw, 15px)" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: "clamp(0.85rem, 3.5vw, 0.95rem)", fontWeight: 800, fontFamily: "Syne, sans-serif", color: "#fff" }}>Collection History</h2>
                <p style={{ margin: 0, fontSize: "clamp(0.65rem, 2.5vw, 0.7rem)", color: "#64748b" }}>{days.length} saved day{days.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "clamp(4px, 2vw, 8px)" }}>
              {onClearHistory && days.length > 0 && (
                <button
                disabled={true}
                  onClick={() => setConfirmClear(true)}
                  title="Clear all history"
                  style={{ 
                    height: "clamp(28px, 5vw, 32px)", 
                    borderRadius: 8, 
                    padding: "0 clamp(8px, 2vw, 12px)", 
                    fontSize: "clamp(0.65rem, 2.5vw, 0.7rem)", 
                    fontWeight: 700, 
                    cursor: "pointer", 
                    border: "1px solid rgba(244,63,94,0.25)", 
                    background: "rgba(244,63,94,0.08)", 
                    color: "#fda4af", 
                    display: "flex", 
                    alignItems: "center", 
                    gap: "6px" 
                  }}
                >
                  <svg width="clamp(10px, 2.5vw, 12px)" height="clamp(10px, 2.5vw, 12px)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
                  </svg>
                  Clear
                </button>
              )}
              <button onClick={onClose} style={{ 
                width: "clamp(28px, 5vw, 32px)", 
                height: "clamp(28px, 5vw, 32px)", 
                borderRadius: 8, 
                border: "1px solid rgba(255,255,255,0.08)", 
                background: "rgba(255,255,255,0.04)", 
                color: "#94a3b8", 
                cursor: "pointer", 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "center" 
              }}>
                <svg width="clamp(12px, 3vw, 14px)" height="clamp(12px, 3vw, 14px)" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          </div>

          {/* Aggregate stats */}
          {days.length > 0 && (
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 110px), 1fr))", 
              gap: "clamp(6px, 2vw, 8px)", 
              marginBottom: 12 
            }}>
              <StatPill label="Total Amount" value={allAmount} textColor="#93c5fd" bg="rgba(59,130,246,0.08)" />
              <StatPill label="Total Comm." value={allComm} textColor="#fda4af" bg="rgba(244,63,94,0.08)" />
              <StatPill label="Total Net" value={allNet} textColor="#6ee7b7" bg="rgba(16,185,129,0.08)" />
            </div>
          )}

          {/* Search */}
          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="clamp(11px, 3vw, 13px)" height="clamp(11px, 3vw, 13px)" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search by date…" 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              style={{ 
                width: "100%", 
                boxSizing: "border-box" as const, 
                height: "clamp(32px, 5vw, 34px)", 
                borderRadius: 8, 
                border: "1px solid rgba(255,255,255,0.08)", 
                background: "rgba(255,255,255,0.04)", 
                paddingLeft: "clamp(28px, 6vw, 32px)", 
                paddingRight: "clamp(10px, 3vw, 12px)", 
                fontSize: "clamp(0.75rem, 2.5vw, 0.8rem)", 
                color: "#e2e8f0", 
                outline: "none" 
              }} 
            />
          </div>
        </div>

        {/* Cards list */}
{/* Cards list - Scrollable with Tailwind */}
<div className="flex-1 min-h-0 overflow-y-auto p-4"
style={{overflow: "auto"}}
>
  <div className="overflow-y-auto flex flex-col gap-2.5">
    {filtered.length === 0 ? (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
          <svg className="w-5 h-5 md:w-6 md:h-6" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </div>
        <p className="text-sm md:text-base font-semibold text-slate-500">{search ? "No results found" : "No collections found"}</p>
        <p className="text-xs md:text-sm text-slate-700 mt-1">{search ? "Try a different date" : "Save your first day to see it here"}</p>
      </div>
    ) : (
      filtered.map((day) => (
        <HistoryCard
          key={day._id || day.date}
          day={day}
          onJumpToDate={onJumpToDate ? (date) => { onJumpToDate(date); onClose(); } : undefined}
        />
      ))
    )}
  </div>
</div>
      </aside>

      {/* Confirm Clear Modal */}
      {confirmClear && (
        <div style={{ 
          position: "fixed", 
          inset: 0, 
          zIndex: 60, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          background: "rgba(0,0,0,0.7)", 
          backdropFilter: "blur(6px)", 
          padding: "1rem" 
        }}>
          <div style={{ 
            width: "100%", 
            maxWidth: "min(380px, 90vw)", 
            borderRadius: 20, 
            border: "1px solid rgba(244,63,94,0.25)", 
            background: "#0f0f1a", 
            padding: "clamp(1.5rem, 4vw, 2rem)", 
            textAlign: "center" 
          }}>
            <div style={{ 
              width: "clamp(40px, 8vw, 48px)", 
              height: "clamp(40px, 8vw, 48px)", 
              borderRadius: 14, 
              background: "rgba(244,63,94,0.1)", 
              border: "1px solid rgba(244,63,94,0.25)", 
              display: "inline-flex", 
              alignItems: "center", 
              justifyContent: "center", 
              marginBottom: 16 
            }}>
              <svg width="clamp(18px, 4vw, 22px)" height="clamp(18px, 4vw, 22px)" viewBox="0 0 24 24" fill="none" stroke="#fda4af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/>
              </svg>
            </div>
            <h3 style={{ margin: 0, fontSize: "clamp(1rem, 4vw, 1.1rem)", fontWeight: 800, color: "#e2e8f0", fontFamily: "Syne, sans-serif" }}>Clear All History?</h3>
            <p style={{ margin: "10px 0 24px", fontSize: "clamp(0.8rem, 3vw, 0.85rem)", color: "#64748b", lineHeight: 1.6 }}>
              This will permanently delete all {days.length} saved day{days.length !== 1 ? "s" : ""} and cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "clamp(8px, 2vw, 10px)" }}>
              <button
                onClick={() => setConfirmClear(false)}
                style={{ 
                  flex: 1, 
                  height: "clamp(38px, 6vw, 42px)", 
                  borderRadius: 10, 
                  border: "1px solid rgba(255,255,255,0.1)", 
                  background: "rgba(255,255,255,0.05)", 
                  color: "#94a3b8", 
                  fontSize: "clamp(0.8rem, 3vw, 0.875rem)", 
                  fontWeight: 700, 
                  cursor: "pointer" 
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => { setConfirmClear(false); onClearHistory?.(); onClose(); }}
                style={{ 
                  flex: 1, 
                  height: "clamp(38px, 6vw, 42px)", 
                  borderRadius: 10, 
                  border: "1px solid rgba(244,63,94,0.3)", 
                  background: "rgba(244,63,94,0.12)", 
                  color: "#fda4af", 
                  fontSize: "clamp(0.8rem, 3vw, 0.875rem)", 
                  fontWeight: 700, 
                  cursor: "pointer" 
                }}
              >
                Delete All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HistoryDrawer;