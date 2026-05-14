import React, { useState } from "react";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./hooks/useAuth";
import { useDashboard } from "./hooks/useDashboard";
import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import RoomCard from "./components/RoomCard";
import HistoryDrawer from "./components/HistoryDrawer";
import SaveButton from "./components/SaveButton";
import LoginPage from "./components/LoginPage";
import AnalyticsPage from "./components/AnalyticsPage";

const NUM_ROOMS = 16;

const App: React.FC = () => {
  const { token, login, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"dashboard" | "analytics">("dashboard");
  const [historyOpen, setHistoryOpen] = useState(false);

  const {
    date, rooms, days, overallTotal,
    saving, loadingDay, isExistingDay, isEditMode,
    totalAmount, totalCommission, netTotal, occupiedCount, isReadOnly,
    handleDateChange, handleRoomChange, handleSave, handleClearHistory,
    handleCancelEdit, setIsEditMode, loadDayData, setDate,
  } = useDashboard();

  // ── Not logged in → show login screen ─────────────────────────────────────
  if (!token) {
    return (
      <>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: "#13131f", color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.08)", fontSize: "0.875rem" },
            success: { iconTheme: { primary: "#10b981", secondary: "#064e3b" } },
            error: { iconTheme: { primary: "#f43f5e", secondary: "#4c0519" } },
          }}
        />
        <LoginPage onLogin={login} loading={authLoading} />
      </>
    );
  }

  // ── Logged in → show dashboard ─────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#080810", color: "#ffffff", fontFamily: "DM Sans, sans-serif" }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#13131f", color: "#e2e8f0", border: "1px solid rgba(255,255,255,0.08)", fontSize: "0.875rem" },
          success: { iconTheme: { primary: "#10b981", secondary: "#064e3b" } },
          error: { iconTheme: { primary: "#f43f5e", secondary: "#4c0519" } },
        }}
      />

      {/* Ambient glows */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div style={{ position: "absolute", left: -160, top: -160, width: 384, height: 384, borderRadius: "50%", background: "rgba(124,58,237,0.08)", filter: "blur(100px)" }} />
        <div style={{ position: "absolute", right: -160, top: "33%", width: 320, height: 320, borderRadius: "50%", background: "rgba(99,102,241,0.06)", filter: "blur(100px)" }} />
        <div style={{ position: "absolute", bottom: 0, left: "50%", width: 256, height: 256, transform: "translateX(-50%)", borderRadius: "50%", background: "rgba(16,185,129,0.04)", filter: "blur(100px)" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <Header
          date={date}
          onDateChange={handleDateChange}
          onHistoryOpen={() => setHistoryOpen(true)}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onLogout={logout}
        />

        {/* ── ANALYTICS TAB ─────────────────────────────────────────────── */}
        {activeTab === "analytics" && <AnalyticsPage />}

        {/* ── DASHBOARD TAB ─────────────────────────────────────────────── */}
        {activeTab === "dashboard" && (
          <main style={{ maxWidth: 1280, margin: "0 auto", padding: "2rem 1.5rem 5rem" }}>

            {/* Summary Cards */}
            <section style={{ marginBottom: "2rem" }}>
              <SummaryCards
                totalAmount={totalAmount}
                totalCommission={totalCommission}
                netTotal={netTotal}
                overallTotal={overallTotal}
              />
            </section>

            {/* Rooms section header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: "1.25rem", flexWrap: "wrap" }}>
              <h2 style={{ fontSize: "1.125rem", fontWeight: 700, margin: 0, fontFamily: "Syne, sans-serif" }}>Rooms</h2>

              {loadingDay ? (
                <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(255,255,255,0.05)", color: "#64748b", border: "1px solid rgba(255,255,255,0.08)" }}>
                  Loading…
                </span>
              ) : isExistingDay ? (
                <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(16,185,129,0.1)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.25)" }}>
                  ✓ Saved Data Loaded
                </span>
              ) : (
                <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "3px 10px", borderRadius: 20, background: "rgba(255,255,255,0.04)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }}>
                  New Day
                </span>
              )}

              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)", minWidth: 20 }} />

              <span style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>
                {occupiedCount} / {NUM_ROOMS} occupied
              </span>

              {isExistingDay && !loadingDay && (
                <button
                  onClick={() => isEditMode ? handleCancelEdit() : setIsEditMode(true)}
                  style={{
                    height: 32, borderRadius: 8, padding: "0 14px",
                    fontSize: "0.75rem", fontWeight: 700, cursor: "pointer",
                    border: isEditMode ? "1px solid rgba(244,63,94,0.35)" : "1px solid rgba(124,58,237,0.35)",
                    background: isEditMode ? "rgba(244,63,94,0.1)" : "rgba(124,58,237,0.1)",
                    color: isEditMode ? "#fda4af" : "#a78bfa",
                    transition: "all 0.2s",
                  }}
                >
                  {isEditMode ? "✕ Cancel Edit" : "✎ Edit"}
                </button>
              )}
            </div>

            {/* Loading spinner */}
            {loadingDay ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 300, gap: 12, color: "#64748b" }}>
                <div style={{ width: 20, height: 20, border: "2px solid rgba(124,58,237,0.3)", borderTopColor: "#7c3aed", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                <span style={{ fontSize: "0.875rem", fontWeight: 600 }}>Loading room data…</span>
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
              </div>
            ) : (
              <>
                {/* Room Grid */}
                <section style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: "0.75rem", marginBottom: "2rem",
                }}>
                  {rooms.map((room) => (
                    <RoomCard key={room.roomNumber} room={room} onChange={handleRoomChange} readOnly={isReadOnly} />
                  ))}
                </section>

                {/* Save area */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                  {(!isExistingDay || isEditMode) && (
                    <SaveButton onSave={handleSave} loading={saving} success={false} />
                  )}
                </div>
              </>
            )}
          </main>
        )}
      </div>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        days={days}
        onJumpToDate={(d) => { setDate(d); loadDayData(d); }}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
};

export default App;