import { useEffect } from "react";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";

const {
  crimson: CRIMSON,
  border: BORDER,
  textMuted: TEXT_MUTED,
} = COLORS;

const fdps = [
  {
    title: "Faculty Development Programme on Machine Learning",
    organizer: "IIT Bombay",
    duration: "2 Weeks",
    year: "2025",
  },
  {
    title: "AI in Healthcare",
    organizer: "NPTEL",
    duration: "1 Week",
    year: "2024",
  },
];

const FDPPage = () => {
  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("aurora-root");
    return () => root.classList.remove("aurora-root");
  }, []);

  return (
    <div className="aurora-page">
      <Aurora colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]} amplitude={1} blend={0.5} />
      <div className="aurora-content">
        <h1 style={{ color: CRIMSON }}>Faculty Development Programmes</h1>
        <p style={{ color: TEXT_MUTED }}>
          Professional development activities undertaken by faculty.
        </p>

        {fdps.map((fdp, index) => (
          <div key={index} className="aurora-card">
            <h3>{fdp.title}</h3>
            <p><strong>Organizer:</strong> {fdp.organizer}</p>
            <p><strong>Duration:</strong> {fdp.duration}</p>
            <p><strong>Year:</strong> {fdp.year}</p>
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

export default FDPPage;