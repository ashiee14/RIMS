import { useEffect } from "react";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";

const {
  crimson: CRIMSON,
  textMuted: TEXT_MUTED,
} = COLORS;

const iprs = [
  {
    title: "AI-Based Disease Prediction System",
    type: "Patent",
    status: "Published",
    year: "2025",
  },
  {
    title: "Smart Attendance System",
    type: "Copyright",
    status: "Granted",
    year: "2023",
  },
];

const IPRPage = () => {
  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("aurora-root");
    return () => root.classList.remove("aurora-root");
  }, []);

  return (
    <div className="aurora-page">
      <Aurora colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]} amplitude={1} blend={0.5} />
      <div className="aurora-content">
        <h1 style={{ color: CRIMSON }}>Intellectual Property Rights (IPR)</h1>
        <p style={{ color: TEXT_MUTED }}>Patents, copyrights, and trademarks.</p>

        {iprs.map((ipr, index) => (
          <div key={index} className="aurora-card">
            <h3>{ipr.title}</h3>
            <p><strong>Type:</strong> {ipr.type}</p>
            <p><strong>Status:</strong> {ipr.status}</p>
            <p><strong>Year:</strong> {ipr.year}</p>
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

export default IPRPage;