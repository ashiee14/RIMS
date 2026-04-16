import { useEffect } from "react";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";

const {
  crimson: CRIMSON,
  border: BORDER,
  textMuted: TEXT_MUTED,
  cardBg: CARD_BG,
} = COLORS;

const conferences = [
  {
    title: "International Conference on Artificial Intelligence",
    organizer: "IEEE",
    date: "12 Mar 2025",
    location: "New Delhi, India",
  },
  {
    title: "Global Summit on Data Science",
    organizer: "Springer",
    date: "20 Aug 2025",
    location: "London, UK",
  },
];

const ConferencePage = () => {
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
        <h1 style={{ color: CRIMSON }}>Conferences</h1>
        <p style={{ color: TEXT_MUTED }}>
          List of academic conferences attended or organized.
        </p>

        {conferences.map((conf, index) => (
          <div key={index} className="aurora-card">
            <h3>{conf.title}</h3>
            <p><strong>Organizer:</strong> {conf.organizer}</p>
            <p><strong>Date:</strong> {conf.date}</p>
            <p><strong>Location:</strong> {conf.location}</p>
          </div>
        ))}
      </div>

      <style>{`
        .aurora-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
        }
        .aurora-content {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: 28px;
          color: #fff;
        }
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

export default ConferencePage;