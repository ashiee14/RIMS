import { useEffect } from "react";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";

const {
  crimson: CRIMSON,
  border: BORDER,
  textMuted: TEXT_MUTED,
  cardBg: CARD_BG,
} = COLORS;

const features = [
  "Plagiarism Checker",
  "Citation Generator",
  "Grant Finder",
  "Collaboration Hub",
  "Research Repository",
  "AI Abstract Generator",
  "Patent Tracker",
  "Conference Finder",
];

const MoreFeaturesPage = () => {
  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("aurora-root");
    return () => root.classList.remove("aurora-root");
  }, []);

  return (
    <div className="aurora-page">
      <Aurora
        colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
        amplitude={1}
        blend={0.5}
      />

      <div className="aurora-content">
        <h1 style={{ color: CRIMSON }}>More Features</h1>
        <p style={{ color: TEXT_MUTED }}>
          Explore upcoming tools designed to enhance research productivity.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginTop: 20,
          }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              style={{
                background: CARD_BG,
                border: `1px solid ${BORDER}`,
                borderRadius: 12,
                padding: 18,
                textAlign: "center",
                fontWeight: 500,
              }}
            >
              {feature}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .aurora-page {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
        }
        .aurora-content {
          position: relative;
          z-index: 1;
          max-width: 1000px;
          margin: 0 auto;
          padding: 28px;
          color: #ffffff;
        }
      `}</style>
    </div>
  );
};

export default MoreFeaturesPage;