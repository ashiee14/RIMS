import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { COLORS } from "../styles/theme";

const { crimson: CRIMSON, teal: TEAL, border: BORDER, cardBg: CARD_BG, textMuted: TEXT_MUTED } = COLORS;

const OrcidPromptModal = ({ onDismiss }) => {
  const { linkOrcid } = useAuth();
  const [step, setStep] = useState("ask"); // "ask" | "input" | "success" | "not_found"
  const [orcidInput, setOrcidInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLink = async () => {
    if (!orcidInput.trim()) {
      setErrorMsg("Please enter an ORCID ID");
      return;
    }
    try {
      setLoading(true);
      setErrorMsg("");
      const data = await linkOrcid(orcidInput.trim());
      if (data.status === "linked") {
        setStep("success");
        setTimeout(() => onDismiss(true), 1500);
      } else {
        setErrorMsg(data.detail || "Your ORCID is not registered. You remain a viewer.");
        setStep("not_found");
      }
    } catch (err) {
      const detail =
        err.response?.data?.detail ||
        "Your ORCID is not registered. You remain a viewer.";
      setErrorMsg(detail);
      setStep("not_found");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: CARD_BG,
          borderRadius: 16,
          padding: "28px 28px 24px",
          border: `1px solid ${BORDER}`,
          boxShadow: "0 12px 40px rgba(0,0,0,0.25)",
        }}
      >
        {step === "ask" && (
          <>
            <h2 style={{ color: CRIMSON, marginBottom: 10, fontSize: 18 }}>
              Link your ORCID
            </h2>
            <p style={{ color: TEXT_MUTED, marginBottom: 24, fontSize: 14, lineHeight: 1.6 }}>
              Do you have an ORCID ID? Linking it will give you full access to RIMS features.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setStep("input")}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: CRIMSON,
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Yes
              </button>
              <button
                onClick={() => onDismiss(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "transparent",
                  color: TEXT_MUTED,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 8,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                No, continue as viewer
              </button>
            </div>
          </>
        )}

        {step === "input" && (
          <>
            <h2 style={{ color: CRIMSON, marginBottom: 10, fontSize: 18 }}>
              Enter your ORCID ID
            </h2>
            <p style={{ color: TEXT_MUTED, marginBottom: 16, fontSize: 13 }}>
              Format: 0000-0000-0000-0000
            </p>
            <input
              type="text"
              placeholder="0000-0000-0000-0000"
              value={orcidInput}
              onChange={(e) => setOrcidInput(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: `1px solid ${BORDER}`,
                fontSize: 14,
                marginBottom: 12,
                boxSizing: "border-box",
              }}
            />
            {errorMsg && (
              <p style={{ color: "#dc2626", fontSize: 13, marginBottom: 12 }}>{errorMsg}</p>
            )}
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleLink}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: TEAL,
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? "Linking..." : "Link ORCID"}
              </button>
              <button
                onClick={() => onDismiss(false)}
                style={{
                  padding: "10px 16px",
                  background: "transparent",
                  color: TEXT_MUTED,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 8,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </>
        )}

        {step === "not_found" && (
          <>
            <h2 style={{ color: CRIMSON, marginBottom: 10, fontSize: 18 }}>
              ORCID Not Found
            </h2>
            <p style={{ color: TEXT_MUTED, marginBottom: 24, fontSize: 14, lineHeight: 1.6 }}>
              {errorMsg}
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => { setStep("input"); setErrorMsg(""); }}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: TEAL,
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Try again
              </button>
              <button
                onClick={() => onDismiss(false)}
                style={{
                  flex: 1,
                  padding: "10px",
                  background: "transparent",
                  color: TEXT_MUTED,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 8,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                Continue as viewer
              </button>
            </div>
          </>
        )}

        {step === "success" && (
          <>
            <h2 style={{ color: "#16a34a", marginBottom: 10, fontSize: 18 }}>
              ORCID Linked!
            </h2>
            <p style={{ color: TEXT_MUTED, fontSize: 14 }}>
              Your account has been upgraded. Redirecting...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default OrcidPromptModal;
