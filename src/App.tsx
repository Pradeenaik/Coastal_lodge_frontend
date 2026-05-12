import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import api from "./lib/api";
import { useAuth } from "./hooks/useAuth";
import LoginPage from "./components/LoginPage";
import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import RoomCard from "./components/RoomCard";
import HistoryDrawer from "./components/HistoryDrawer";
import SaveButton from "./components/SaveButton";
import { Room, DaySummary, ApiRoom } from "./types/room";

const NUM_ROOMS = 16;

function createDefaultRooms(): Room[] {
  return Array.from({ length: NUM_ROOMS }, (_, i) => ({
    roomNumber: i + 1,
    amount: 0,
    commission: 0,
    commissionType: "" as const,
  }));
}

function getToday(): string {
  return new Date().toISOString().split("T")[0];
}

const App: React.FC = () => {
  const { token, login, loading: authLoading } = useAuth();
  const [date, setDate] = useState<string>(getToday());
  const [rooms, setRooms] = useState<Room[]>(createDefaultRooms());
  const [historyOpen, setHistoryOpen] = useState(false);
  const [days, setDays] = useState<DaySummary[]>([]);
  const [overallTotal, setOverallTotal] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isExistingDay, setIsExistingDay] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [loadingDay, setLoadingDay] = useState(false);

  const totalAmount = useMemo(
    () => rooms.reduce((sum, r) => sum + (r.amount || 0), 0),
    [rooms]
  );

  const totalCommission = useMemo(
    () => rooms.reduce((sum, r) => sum + (r.commission || 0), 0),
    [rooms]
  );

  const netTotal = useMemo(
    () => totalAmount - totalCommission,
    [totalAmount, totalCommission]
  );

  const fetchSummary = useCallback(async () => {
    try {
      const { data } = await api.get<{ days: DaySummary[]; overallTotal: number }>(
        "/summary"
      );

      setDays(data.days || []);
      setOverallTotal(data.overallTotal || 0);

      return data.days || [];
    } catch (err) {
      console.error("Failed to fetch summary:", err);
      return [];
    }
  }, []);

  const loadDayData = useCallback(async (selectedDate: string, allDays: DaySummary[]) => {
    setLoadingDay(true);
    setErrorMsg(null);
    setIsEditMode(false);

    try {
      const { data } = await api.get<{ days: DaySummary[]; overallTotal: number }>(
        "/summary"
      );

      const matched = data.days.find((d) => d.date === selectedDate);

      if (matched && matched.rooms && matched.rooms.length > 0) {
        const merged = createDefaultRooms().map((defaultRoom) => {
          const backendRoom = matched.rooms.find(
            (r: ApiRoom) => r.roomNumber === defaultRoom.roomNumber
          );

          if (backendRoom) {
            const commissionType =
              backendRoom.commission === 200
                ? "Driver"
                : backendRoom.commission > 0
                ? "Custom"
                : "";

            return {
              roomNumber: backendRoom.roomNumber,
              amount: backendRoom.amount,
              commission: backendRoom.commission,
              commissionType: commissionType as Room["commissionType"],
            };
          }

          return defaultRoom;
        });

        setRooms(merged);
        setIsExistingDay(true);
      } else {
        setRooms(createDefaultRooms());
        setIsExistingDay(false);
      }

      setDays(data.days || []);
      setOverallTotal(data.overallTotal || 0);
    } catch (err) {
      console.error("Failed to load day data:", err);
      setRooms(createDefaultRooms());
      setIsExistingDay(false);
    } finally {
      setLoadingDay(false);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    loadDayData(getToday(), []);
  }, [loadDayData, token]);

  const handleDateChange = useCallback((newDate: string) => {
    setDate(newDate);
    loadDayData(newDate, days);
  }, [days, loadDayData]);

  const handleRoomChange = useCallback((updated: Room) => {
    setRooms((prev) =>
      prev.map((r) => (r.roomNumber === updated.roomNumber ? updated : r))
    );
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setErrorMsg(null);

    try {
      await api.post("/day", { date, rooms });

      setSaveSuccess(true);
      setIsExistingDay(true);
      setIsEditMode(false);

      await fetchSummary();

      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err: unknown) {
      const msg =
        axios.isAxiosError(err) && err.response?.data?.message
          ? err.response.data.message
          : "Failed to save. Please try again.";

      setErrorMsg(msg);
    } finally {
      setSaving(false);
    }
  };

  const occupiedCount = rooms.filter((r) => r.amount > 0).length;
  const isReadOnly = isExistingDay && !isEditMode;

  if (!token) {
    return <LoginPage onLogin={login} loading={authLoading} />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#080810",
        color: "#ffffff",
        fontFamily: "DM Sans, sans-serif",
        overflowX: "hidden",
      }}
    >
      {/* Ambient glows */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "-12vw",
            top: "-12vw",
            width: "clamp(220px, 32vw, 384px)",
            height: "clamp(220px, 32vw, 384px)",
            borderRadius: "50%",
            background: "rgba(124,58,237,0.08)",
            filter: "blur(100px)",
          }}
        />

        <div
          style={{
            position: "absolute",
            right: "-10vw",
            top: "33%",
            width: "clamp(180px, 28vw, 320px)",
            height: "clamp(180px, 28vw, 320px)",
            borderRadius: "50%",
            background: "rgba(99,102,241,0.06)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <div style={{ position: "relative", zIndex: 1, width: "100%" }}>
        <Header
          date={date}
          onDateChange={handleDateChange}
          onHistoryOpen={() => setHistoryOpen(true)}
        />

        <main
          style={{
            width: "100%",
            maxWidth: 1280,
            margin: "0 auto",
            padding: "clamp(1rem, 3vw, 2rem) clamp(0.9rem, 3vw, 1.5rem) 5rem",
            boxSizing: "border-box",
          }}
        >
          {/* Summary Cards */}
          <section style={{ marginBottom: "clamp(1.25rem, 3vw, 2rem)" }}>
            <SummaryCards
              totalAmount={totalAmount}
              totalCommission={totalCommission}
              netTotal={netTotal}
              overallTotal={overallTotal}
            />
          </section>

          {/* Rooms header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: "1.25rem",
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1rem, 2vw, 1.125rem)",
                fontWeight: 700,
                margin: 0,
                fontFamily: "Syne, sans-serif",
                lineHeight: 1.2,
              }}
            >
              Rooms
            </h2>

            {/* Status badge */}
            {loadingDay ? (
              <span
                style={{
                  fontSize: "clamp(0.65rem, 1.5vw, 0.7rem)",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.05)",
                  color: "#64748b",
                  border: "1px solid rgba(255,255,255,0.08)",
                  whiteSpace: "nowrap",
                }}
              >
                Loading…
              </span>
            ) : isExistingDay ? (
              <span
                style={{
                  fontSize: "clamp(0.65rem, 1.5vw, 0.7rem)",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: "rgba(16,185,129,0.1)",
                  color: "#6ee7b7",
                  border: "1px solid rgba(16,185,129,0.25)",
                  whiteSpace: "nowrap",
                }}
              >
                ✓ Saved Data Loaded
              </span>
            ) : (
              <span
                style={{
                  fontSize: "clamp(0.65rem, 1.5vw, 0.7rem)",
                  fontWeight: 700,
                  padding: "3px 10px",
                  borderRadius: 20,
                  background: "rgba(255,255,255,0.04)",
                  color: "#94a3b8",
                  border: "1px solid rgba(255,255,255,0.08)",
                  whiteSpace: "nowrap",
                }}
              >
                New Day
              </span>
            )}

            <div
              style={{
                flex: 1,
                height: 1,
                background: "rgba(255,255,255,0.06)",
                minWidth: 20,
              }}
            />

            <span
              style={{
                fontSize: "clamp(0.7rem, 1.5vw, 0.75rem)",
                color: "#64748b",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {occupiedCount} / {NUM_ROOMS} occupied
            </span>

            {/* Edit / Cancel button */}
            {isExistingDay && !loadingDay && (
              <button
                onClick={() => {
                  if (isEditMode) {
                    loadDayData(date, days);
                  } else {
                    setIsEditMode(true);
                  }
                }}
                style={{
                  height: 32,
                  borderRadius: 8,
                  padding: "0 14px",
                  fontSize: "clamp(0.7rem, 1.5vw, 0.75rem)",
                  fontWeight: 700,
                  cursor: "pointer",
                  border: isEditMode
                    ? "1px solid rgba(244,63,94,0.35)"
                    : "1px solid rgba(124,58,237,0.35)",
                  background: isEditMode
                    ? "rgba(244,63,94,0.1)"
                    : "rgba(124,58,237,0.1)",
                  color: isEditMode ? "#fda4af" : "#a78bfa",
                  transition: "all 0.2s",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                }}
              >
                {isEditMode ? "✕ Cancel Edit" : "✎ Edit"}
              </button>
            )}
          </div>

          {/* Loading overlay */}
          {loadingDay ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 300,
                gap: 12,
                color: "#64748b",
                flexWrap: "wrap",
                textAlign: "center",
                padding: "1rem",
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  border: "2px solid rgba(124,58,237,0.3)",
                  borderTopColor: "#7c3aed",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  flexShrink: 0,
                }}
              />

              <span
                style={{
                  fontSize: "0.875rem",
                  fontWeight: 600,
                }}
              >
                Loading room data…
              </span>

              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <>
              {/* Room Grid */}
              <section
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
                  gap: "0.75rem",
                  marginBottom: "2rem",
                  width: "100%",
                  alignItems: "stretch",
                }}
              >
                {rooms.map((room) => (
                  <RoomCard
                    key={room.roomNumber}
                    room={room}
                    onChange={handleRoomChange}
                    readOnly={isReadOnly}
                  />
                ))}
              </section>

              {/* Save / Edit actions */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 12,
                  width: "100%",
                }}
              >
                {errorMsg && (
                  <div
                    style={{
                      border: "1px solid rgba(244,63,94,0.3)",
                      background: "rgba(244,63,94,0.1)",
                      borderRadius: 12,
                      padding: "10px 16px",
                      fontSize: "0.875rem",
                      color: "#fda4af",
                      width: "100%",
                      maxWidth: 520,
                      textAlign: "center",
                      boxSizing: "border-box",
                      wordBreak: "break-word",
                    }}
                  >
                    {errorMsg}
                  </div>
                )}

                {(!isExistingDay || isEditMode) && (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <SaveButton
                      onSave={handleSave}
                      loading={saving}
                      success={saveSuccess}
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>

      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        days={days}
        onJumpToDate={(date) => {
          setDate(date);
          loadDayData(date, days);
        }}
      />
    </div>
  );
};

export default App;