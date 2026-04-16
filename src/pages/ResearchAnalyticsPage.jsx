import { useEffect } from "react";
import Aurora from "../components/Aurora";
import { COLORS, FONT } from "../styles/theme";

const {
  crimson: CRIMSON,
  border: BORDER,
  textMuted: TEXT_MUTED,
  cardBg: CARD_BG,
} = COLORS;

const AnalyticsCard = ({ title, value }) => (
  <div
    style={{
      background: CARD_BG,
      border: `1px solid ${BORDER}`,
      borderRadius: 12,
      padding: 20,
      textAlign: "center",
    }}
  >
    <div style={{ fontSize: 12, color: TEXT_MUTED }}>{title}</div>
    <div style={{ fontSize: 28, fontWeight: "bold", color: CRIMSON }}>
      {value}
    </div>
  </div>
);

const ResearchAnalyticsPage = () => {
  // Adds Aurora styling to the root
  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("aurora-root");
    return () => root.classList.remove("aurora-root");
  }, []);

  return (
    <div className="analytics-container">
      {/* Aurora Background */}
      <Aurora
        colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
        amplitude={1}
        blend={0.5}
      />

      {/* Page Content */}
      <div className="analytics-content">
        <h1
          style={{
            color: CRIMSON,
            fontFamily: FONT?.serif,
            fontSize: "clamp(28px, 4vw, 40px)",
          }}
        >
          Research Analytics
        </h1>

        <p style={{ color: TEXT_MUTED }}>
          Overview of institutional research performance.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 16,
            marginTop: 20,
          }}
        >
          <AnalyticsCard title="Total Publications" value="1,732" />
          <AnalyticsCard title="Scopus Indexed" value="1,280" />
          <AnalyticsCard title="H-Index" value="92" />
          <AnalyticsCard title="Citations" value="12,540" />
          <AnalyticsCard title="Funded Projects" value="215" />
          <AnalyticsCard title="Patents Filed" value="48" />
        </div>
      </div>

      {/* Scoped Styles */}
      <style>{`
        .analytics-container {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
        }

        .analytics-content {
          position: relative;
          z-index: 1;
          max-width: 1100px;
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
          .analytics-content {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default ResearchAnalyticsPage;