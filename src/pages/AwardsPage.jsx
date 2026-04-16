import { useEffect } from "react";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";

const {
  crimson: CRIMSON,
  textMuted: TEXT_MUTED,
} = COLORS;

const awards = [
  { title: "Best Research Paper Award", agency: "IEEE", year: "2024" },
  { title: "Excellence in Teaching Award", agency: "University Grants Commission", year: "2023" },
];

const AwardsPage = () => {
  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("aurora-root");
    return () => root.classList.remove("aurora-root");
  }, []);

  return (
    <div className="aurora-page">
      <Aurora colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]} amplitude={1} blend={0.5} />
      <div className="aurora-content">
        <h1 style={{ color: CRIMSON }}>Awards</h1>
        <p style={{ color: TEXT_MUTED }}>Recognitions and achievements received.</p>

        {awards.map((award, index) => (
          <div key={index} className="aurora-card">
            <h3>{award.title}</h3>
            <p><strong>Awarding Agency:</strong> {award.agency}</p>
            <p><strong>Year:</strong> {award.year}</p>
          </div>
        ))}
      </div>

      <style>{`
        .aurora-page { position: relative; min-height: 100vh; overflow: hidden; }
        .aurora-content { position: relative; z-index: 1; max-width: 1000px; margin: 0 auto; padding: 28px; color: #fff; }
        .aurora-card {
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: 16px;
          margin-top: 12px;
        }
      `}</style>
    </div>
  );
};

export default AwardsPage;