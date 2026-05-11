import React from "react";

interface SaveButtonProps {
  onSave: () => void;
  loading: boolean;
  success: boolean;
}

const SaveButton: React.FC<SaveButtonProps> = ({ onSave, loading, success }) => {
  const base: React.CSSProperties = {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    height: 48,
    padding: "0 2rem",
    borderRadius: 14,
    fontSize: "0.875rem",
    fontWeight: 700,
    letterSpacing: "0.04em",
    cursor: loading ? "not-allowed" : "pointer",
    border: "none",
    transition: "all 0.25s",
    overflow: "hidden",
    outline: "none",
    fontFamily: "DM Sans, sans-serif",
  };

  const styles: React.CSSProperties = success
    ? {
        ...base,
        background: "rgba(16,185,129,0.12)",
        border: "1px solid rgba(16,185,129,0.35)",
        color: "#6ee7b7",
        boxShadow: "0 4px 20px rgba(16,185,129,0.2)",
      }
    : {
        ...base,
        background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
        color: "#ffffff",
        boxShadow: "0 4px 24px rgba(124,58,237,0.4)",
      };

  return (
    <button
      onClick={onSave}
      disabled={loading}
      style={styles}
      onMouseEnter={e => {
        if (!success && !loading) {
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 32px rgba(124,58,237,0.55)";
        }
      }}
      onMouseLeave={e => {
        if (!success && !loading) {
          (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 24px rgba(124,58,237,0.4)";
        }
      }}
    >
      {loading ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
            style={{ animation: "spin 0.8s linear infinite" }}>
            <path d="M12 2a10 10 0 0 1 10 10"/>
          </svg>
          Saving…
        </>
      ) : success ? (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6ee7b7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          Saved!
        </>
      ) : (
        <>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
            <polyline points="17 21 17 13 7 13 7 21"/>
            <polyline points="7 3 7 8 15 8"/>
          </svg>
          Save Day
        </>
      )}

      {/* CSS keyframe for spinner */}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
};

export default SaveButton;