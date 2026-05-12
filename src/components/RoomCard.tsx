import React from "react";
import { Room, CommissionType } from "../types/room";

interface RoomCardProps {
  room: Room;
  onChange: (updated: Room) => void;
  readOnly?: boolean;
}

const COMMISSION_OPTIONS: { value: CommissionType; label: string }[] = [
  { value: "", label: "Select Type" },
  { value: "Driver", label: "Driver " },
  { value: "Custom", label: "Custom" },
];

const RoomCard: React.FC<RoomCardProps> = ({ room, onChange, readOnly = false }) => {
  const isOccupied = room.amount > 0 || room.commissionType !== "";

  const isMobile =
    typeof window !== "undefined" ? window.innerWidth <= 480 : false;

  const inputStyle: React.CSSProperties = {
    width: "100%",
    borderRadius: isMobile ? 8 : 10,
    border: readOnly
      ? "1px solid rgba(255,255,255,0.05)"
      : "1px solid rgba(255,255,255,0.08)",
    background: readOnly
      ? "rgba(255,255,255,0.03)"
      : "rgba(255,255,255,0.05)",
    padding: isMobile ? "7px 9px" : "8px 10px",
    fontSize: isMobile ? "0.8rem" : "0.875rem",
    fontWeight: 600,
    color: readOnly ? "#94a3b8" : "#ffffff",
    outline: "none",
    boxSizing: "border-box" as const,
    cursor: readOnly ? "default" : "text",
    minHeight: isMobile ? 40 : 44,
  };

  const disabledInputStyle: React.CSSProperties = {
    ...inputStyle,
    background: "rgba(255,255,255,0.02)",
    color: "#64748b",
    cursor: "not-allowed",
    border: "1px solid rgba(255,255,255,0.04)",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: isMobile ? "0.58rem" : "0.65rem",
    fontWeight: 700,
    letterSpacing: "0.15em",
    textTransform: "uppercase" as const,
    color: "#64748b",
    marginBottom: 6,
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const amount = parseFloat(e.target.value) || 0;
    onChange({ ...room, amount });
  };

const handleCommissionTypeChange = (
  e: React.ChangeEvent<HTMLSelectElement>
) => {
  if (readOnly) return;

  const commissionType = e.target.value as CommissionType;

  onChange({
    ...room,
    commissionType,
    commission: commissionType === "" ? 0 : room.commission,
  });
};

  const handleCommissionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (readOnly) return;
    const commission = parseFloat(e.target.value) || 0;
    onChange({ ...room, commission });
  };

  return (
    <div
      style={{
        width: "100%",
        minWidth: 0,
        borderRadius: isMobile ? 14 : 16,
        border: isOccupied
          ? "1px solid rgba(124,58,237,0.35)"
          : "1px solid rgba(255,255,255,0.07)",
        background: isOccupied
          ? "rgba(124,58,237,0.06)"
          : "rgba(255,255,255,0.02)",
        boxShadow: isOccupied
          ? "0 4px 24px -4px rgba(124,58,237,0.15)"
          : "none",
        opacity: readOnly && !isOccupied ? 0.5 : 1,
        transition: "all 0.2s",
        overflow: "hidden",
      }}
    >
      {/* Card header */}
      <div
        style={{
          display: "flex",
          alignItems: isMobile ? "flex-start" : "center",
          justifyContent: "space-between",
          gap: 10,
          padding: isMobile ? "10px 12px" : "12px 14px 10px",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          flexWrap: "wrap",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: isMobile ? 26 : 28,
              height: isMobile ? 26 : 28,
              flexShrink: 0,
              borderRadius: 8,
              background: isOccupied
                ? "rgba(124,58,237,0.2)"
                : "rgba(255,255,255,0.05)",
              border: isOccupied
                ? "1px solid rgba(124,58,237,0.4)"
                : "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isMobile ? "0.65rem" : "0.7rem",
              fontWeight: 800,
              color: isOccupied ? "#a78bfa" : "#64748b",
            }}
          >
            {room.roomNumber}
          </div>

          <span
            style={{
              fontSize: isMobile ? "0.58rem" : "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#64748b",
              whiteSpace: "nowrap",
            }}
          >
            Room
          </span>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            flexWrap: "wrap",
            justifyContent: isMobile ? "flex-start" : "flex-end",
          }}
        >
          {readOnly && isOccupied && (
            <span
              style={{
                fontSize: isMobile ? "0.55rem" : "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#64748b",
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                padding: "2px 7px",
              }}
            >
              View
            </span>
          )}

          {isOccupied && (
            <span
              style={{
                fontSize: isMobile ? "0.55rem" : "0.6rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: "#a78bfa",
                background: "rgba(124,58,237,0.15)",
                border: "1px solid rgba(124,58,237,0.25)",
                borderRadius: 20,
                padding: "2px 8px",
              }}
            >
              Active
            </span>
          )}
        </div>
      </div>

      {/* Inputs */}
      <div
        style={{
          padding: isMobile ? "10px 12px" : "12px 14px",
          display: "flex",
          flexDirection: "column",
          gap: isMobile ? 8 : 10,
        }}
      >
        <div>
          <label style={labelStyle}>Amount (₹)</label>

          <input
            type="number"
            min={0}
            placeholder="0"
            value={room.amount || ""}
            onChange={handleAmountChange}
            readOnly={readOnly}
            style={inputStyle}
          />
        </div>

        <div>
          <label style={labelStyle}>Commission</label>

          <select
            value={room.commissionType}
            onChange={handleCommissionTypeChange}
            disabled={readOnly}
            style={{
              ...inputStyle,
              background: readOnly
                ? "rgba(255,255,255,0.03)"
                : "#0f0f18",
              cursor: readOnly ? "default" : "pointer",
            }}
          >
            {COMMISSION_OPTIONS.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                style={{ background: "#0f0f18" }}
              >
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {room.commissionType !== "" && (
          <div>
            <label style={labelStyle}>Commission Amount (₹)</label>

            <input
              type="number"
              min={0}
              placeholder="0"
              value={room.commission || ""}
              onChange={handleCommissionChange}
              disabled={readOnly}
              style={readOnly ? disabledInputStyle : inputStyle}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomCard;