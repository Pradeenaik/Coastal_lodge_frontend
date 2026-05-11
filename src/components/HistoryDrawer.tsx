import React, { useEffect, useState } from "react";
import { DaySummary, ApiRoom } from "../types/room";

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  days: DaySummary[];
  onJumpToDate?: (date: string) => void;
}

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", {
      weekday: "short", day: "2-digit", month: "short", year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

const StatPill: React.FC<{ label: string; value: number; textColor: string; bg: string }> = ({
  label, value, textColor, bg,
}) => (
  <div style={{ borderRadius: 10, background: bg, padding: "8px 6px", textAlign: "center" }}>
    <p style={{ margin: 0, fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: textColor, marginBottom: 4 }}>
      {label}
    </p>
    <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 800, color: textColor }}>
      &#8377;{value.toLocaleString("en-IN")}
    </p>
  </div>
);

const RoomRow: React.FC<{ room: ApiRoom }> = ({ room }) => {
  const hasActivity = room.amount > 0 || room.commission > 0;
  const commissionLabel =
    room.commission === 200 ? "Driver" :
    room.commission > 0 ? "Custom" : "";

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "36px 1fr 1fr 60px",
      alignItems: "center", gap: 8, padding: "7px 10px", borderRadius: 8,
      background: hasActivity ? "rgba(124,58,237,0.06)" : "transparent",
      border: hasActivity ? "1px solid rgba(124,58,237,0.15)" : "1px solid transparent",
      opacity: hasActivity ? 1 : 0.35,
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 6,
        background: hasActivity ? "rgba(124,58,237,0.2)" : "rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.65rem", fontWeight: 800,
        color: hasActivity ? "#a78bfa" : "#475569",
      }}>
        {room.roomNumber}
      </div>
      <div>
        <p style={{ margin: 0, fontSize: "0.58rem", color: "#475569", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Amount</p>
        <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 700, color: hasActivity ? "#e2e8f0" : "#475569" }}>
          &#8377;{room.amount.toLocaleString("en-IN")}
        </p>
      </div>
      <div>
        <p style={{ margin: 0, fontSize: "0.58rem", color: "#475569", fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em" }}>Commission</p>
        <p style={{ margin: 0, fontSize: "0.8rem", fontWeight: 700, color: room.commission > 0 ? "#fda4af" : "#475569" }}>
          {room.commission > 0 ? ("&#8377;" + room.commission.toLocaleString("en-IN")) : "—"}
        </p>
      </div>
      <div style={{ textAlign: "right" }}>
        {commissionLabel && (
          <span style={{
            fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.08em",
            textTransform: "uppercase" as const, padding: "2px 6px", borderRadius: 6,
            background: room.commission === 200 ? "rgba(99,102,241,0.15)" : "rgba(245,158,11,0.15)",
            color: room.commission === 200 ? "#818cf8" : "#fbbf24",
            border: room.commission === 200 ? "1px solid rgba(99,102,241,0.25)" : "1px solid rgba(245,158,11,0.25)",
          }}>
            {commissionLabel}
          </span>
        )}
      </div>
    </div>
  );
};

const HistoryCard: React.FC<{ day: DaySummary; onJumpToDate?: (date: string) => void }> = ({ day, onJumpToDate }) => {
  const [expanded, setExpanded] = useState(false);
  const occupiedRooms = (day.rooms || []).filter(r => r.amount > 0 || r.commission > 0);

  return (
    <div style={{ borderRadius: 14, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", overflow: "hidden" }}>
      <div style={{ padding: "14px 14px 12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#e2e8f0" }}>{formatDate(day.date)}</span>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {onJumpToDate && (
              <button onClick={() => onJumpToDate(day.date)} style={{
                height: 26, borderRadius: 6, padding: "0 10px", fontSize: "0.65rem",
                fontWeight: 700, cursor: "pointer", border: "1px solid rgba(124,58,237,0.3)",
                background: "rgba(124,58,237,0.1)", color: "#a78bfa",
              }}>
                &#8599; Load
              </button>
            )}
            {day.rooms && day.rooms.length > 0 && (
              <button onClick={() => setExpanded(p => !p)} style={{
                height: 26, borderRadius: 6, padding: "0 10px", fontSize: "0.65rem",
                fontWeight: 700, cursor: "pointer", border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)", color: "#94a3b8",
                display: "flex", alignItems: "center", gap: 4,
              }}>
                <span style={{ display: "inline-block", transform: expanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s", lineHeight: 1 }}>&#9660;</span>
                {occupiedRooms.length} room{occupiedRooms.length !== 1 ? "s" : ""}
              </button>
            )}
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <StatPill label="Amount" value={day.totalAmount} textColor="#93c5fd" bg="rgba(59,130,246,0.1)" />
          <StatPill label="Commission" value={day.totalCommission} textColor="#fda4af" bg="rgba(244,63,94,0.1)" />
          <StatPill label="Net" value={day.netTotal} textColor="#6ee7b7" bg="rgba(16,185,129,0.1)" />
        </div>
      </div>
      {expanded && day.rooms && day.rooms.length > 0 && (
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.06)", padding: "10px",
          background: "rgba(0,0,0,0.25)", maxHeight: 320, overflowY: "auto",
          display: "flex", flexDirection: "column", gap: 4,
        }}>
          <p style={{ margin: "0 0 6px 2px", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" as const, color: "#475569" }}>
            Room Breakdown — {occupiedRooms.length} active
          </p>
          {day.rooms.map(room => <RoomRow key={room.roomNumber} room={room} />)}
        </div>
      )}
    </div>
  );
};

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({ isOpen, onClose, days, onJumpToDate }) => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const filtered = days
    .filter(d => d.date.includes(search) || formatDate(d.date).toLowerCase().includes(search.toLowerCase()))
    .slice().reverse();

  const allAmount = days.reduce((s, d) => s + d.totalAmount, 0);
  const allComm = days.reduce((s, d) => s + d.totalCommission, 0);
  const allNet = days.reduce((s, d) => s + d.netTotal, 0);

  return (
    <>
      <div onClick={onClose} style={{
        position: "fixed", inset: 0, zIndex: 40, background: "rgba(0,0,0,0.65)",
        backdropFilter: "blur(4px)", WebkitBackdropFilter: "blur(4px)",
        opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none", transition: "opacity 0.3s",
      }} />

      <aside style={{
        position: "fixed", right: 0, top: 0, zIndex: 50,
        width: "100%", maxWidth: 440, height: "100%",
        display: "flex", flexDirection: "column",
        borderLeft: "1px solid rgba(255,255,255,0.07)", background: "#0c0c14",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "1rem 1.25rem", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: "rgba(124,58,237,0.15)", border: "1px solid rgba(124,58,237,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, fontFamily: "Syne, sans-serif", color: "#fff" }}>Collection History</h2>
                <p style={{ margin: 0, fontSize: "0.7rem", color: "#64748b" }}>{days.length} saved day{days.length !== 1 ? "s" : ""}</p>
              </div>
            </div>
            <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#94a3b8", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {days.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 12 }}>
              <StatPill label="Total Amount" value={allAmount} textColor="#93c5fd" bg="rgba(59,130,246,0.08)" />
              <StatPill label="Total Comm." value={allComm} textColor="#fda4af" bg="rgba(244,63,94,0.08)" />
              <StatPill label="Total Net" value={allNet} textColor="#6ee7b7" bg="rgba(16,185,129,0.08)" />
            </div>
          )}

          <div style={{ position: "relative" }}>
            <svg style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input type="text" placeholder="Search by date…" value={search} onChange={e => setSearch(e.target.value)} style={{
              width: "100%", boxSizing: "border-box" as const, height: 34, borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)",
              paddingLeft: 32, paddingRight: 12, fontSize: "0.8rem", color: "#e2e8f0", outline: "none",
            }} />
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "1rem", display: "flex", flexDirection: "column", gap: 10 }}>
          {filtered.length === 0 ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 0", textAlign: "center" }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <p style={{ margin: 0, fontSize: "0.875rem", fontWeight: 600, color: "#64748b" }}>{search ? "No results found" : "No history yet"}</p>
              <p style={{ margin: "4px 0 0", fontSize: "0.75rem", color: "#334155" }}>{search ? "Try a different date" : "Save your first day to see it here"}</p>
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
      </aside>
    </>
  );
};

export default HistoryDrawer;