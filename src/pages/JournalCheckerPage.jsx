import { useState, useEffect } from "react";
import Aurora from "../components/Aurora";
import { COLORS, FONT } from "../styles/theme";

const {
  crimson: CRIMSON,
  teal: TEAL,
  border: BORDER,
  textMuted: TEXT_MUTED,
  cardBg: CARD_BG,
} = COLORS;

const JournalCheckerPage = () => {
  const [journal, setJournal] = useState("");
  const [result, setResult] = useState(null);

  // Adds Aurora styling to the root
  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("aurora-root");
    return () => root.classList.remove("aurora-root");
  }, []);

  const handleCheck = () => {
    if (!journal.trim()) return;

    // Mock response
    setResult({
      indexed: "Scopus",
      quartile: "Q1",
      impactFactor: 4.2,
      status: "Verified",
    });
  };

  return (
    <div className="journal-container">
      {/* Aurora Background */}
      <Aurora
        colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
        amplitude={1}
        blend={0.5}
      />

      {/* Page Content */}
      <div className="journal-content">
        <h1
          style={{
            color: CRIMSON,
            fontFamily: FONT?.serif,
            fontSize: "clamp(28px, 4vw, 40px)",
          }}
        >
          Journal Checker
        </h1>

        <p style={{ color: TEXT_MUTED }}>
          Verify journal indexing, quartile ranking, and impact factor.
        </p>

        <div
          style={{
            background: CARD_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            padding: 20,
          }}
        >
          <input
            type="text"
            placeholder="Enter journal name..."
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: `1px solid ${BORDER}`,
              marginBottom: 12,
            }}
          />

          <button
            onClick={handleCheck}
            style={{
              background: CRIMSON,
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Check Journal
          </button>

          {result && (
            <div style={{ marginTop: 16 }}>
              <p><strong>Indexed In:</strong> {result.indexed}</p>
              <p><strong>Quartile:</strong> {result.quartile}</p>
              <p><strong>Impact Factor:</strong> {result.impactFactor}</p>
              <p style={{ color: TEAL }}>
                <strong>Status:</strong> {result.status}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Scoped Styles */}
      <style>{`
        .journal-container {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
        }

        .journal-content {
          position: relative;
          z-index: 1;
          max-width: 800px;
          margin: 0 auto;
          padding: clamp(16px, 3vw, 28px);
          color: #ffffff;
        }

        /* Ensure Aurora stays in the background */
        .aurora-container {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .aurora-layer {
          position: absolute;
          width: 100%;
          height: 100%;
          animation: auroraMove 18s infinite alternate ease-in-out;
        }

        .aurora-layer-1 { animation-delay: 0s; }
        .aurora-layer-2 { animation-delay: 4s; }
        .aurora-layer-3 { animation-delay: 8s; }

        @keyframes auroraMove {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.1); }
          100% { transform: translate(-30px, 40px) scale(1.05); }
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .journal-content {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default JournalCheckerPage;