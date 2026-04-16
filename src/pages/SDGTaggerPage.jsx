import { useState, useEffect } from "react";
import Aurora from "../components/Aurora";
import { COLORS, FONT } from "../styles/theme";

const {
  crimson: CRIMSON,
  border: BORDER,
  text: TEXT,
  textMuted: TEXT_MUTED,
  cardBg: CARD_BG,
} = COLORS;

const SDGTaggerPage = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState([]);

  // Adds Aurora styling to the root
  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("aurora-root");
    return () => root.classList.remove("aurora-root");
  }, []);

  const sdgGoals = [
    "No Poverty",
    "Zero Hunger",
    "Good Health and Well-being",
    "Quality Education",
    "Gender Equality",
    "Clean Water and Sanitation",
    "Affordable and Clean Energy",
    "Decent Work and Economic Growth",
    "Industry, Innovation and Infrastructure",
    "Reduced Inequalities",
    "Sustainable Cities and Communities",
    "Responsible Consumption and Production",
    "Climate Action",
    "Life Below Water",
    "Life on Land",
    "Peace, Justice and Strong Institutions",
    "Partnerships for the Goals",
  ];

  const handleTag = () => {
    if (text.trim() === "") return;
    // Mock AI tagging
    setResult(sdgGoals.slice(0, 3));
  };

  return (
    <div className="sdg-container">
      {/* Aurora Background */}
      <Aurora
        colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
        amplitude={1}
        blend={0.5}
      />

      {/* Page Content */}
      <div className="sdg-content">
        <h1
          style={{
            color: CRIMSON,
            fontFamily: FONT?.serif,
            fontSize: "clamp(28px, 4vw, 40px)",
          }}
        >
          SDG Tagger
        </h1>

        <p style={{ color: TEXT_MUTED }}>
          Analyze research text and map it to relevant UN Sustainable Development Goals.
        </p>

        <div
          style={{
            background: CARD_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            padding: 20,
          }}
        >
          <textarea
            rows="6"
            placeholder="Paste your abstract or research summary..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: `1px solid ${BORDER}`,
              marginBottom: 12,
              color: TEXT,
            }}
          />

          <button
            onClick={handleTag}
            style={{
              background: CRIMSON,
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: 8,
              cursor: "pointer",
            }}
          >
            Tag SDGs
          </button>

          {result.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h3>Suggested SDGs:</h3>
              {result.map((sdg, index) => (
                <span
                  key={index}
                  style={{
                    display: "inline-block",
                    margin: "5px",
                    padding: "6px 12px",
                    borderRadius: 6,
                    background: CRIMSON,
                    color: "#fff",
                    fontSize: 12,
                  }}
                >
                  {sdg}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scoped Styles */}
      <style>{`
        .sdg-container {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
        }

        .sdg-content {
          position: relative;
          z-index: 1;
          max-width: 900px;
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
          .sdg-content {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default SDGTaggerPage;