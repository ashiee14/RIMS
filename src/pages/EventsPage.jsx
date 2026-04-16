import { useEffect } from "react";
import Aurora from "../components/Aurora";
import { COLORS, FONT } from "../styles/theme";

const {
  crimson: CRIMSON,
  border: BORDER,
  textMuted: TEXT_MUTED,
  cardBg: CARD_BG,
} = COLORS;

const events = [
  {
    title: "National Research Symposium",
    date: "10 Oct 2025",
    location: "Pune, India",
  },
  {
    title: "AI Innovation Workshop",
    date: "15 Dec 2025",
    location: "Mumbai, India",
  },
];

const EventsPage = () => {
  // Optional: Adds a global class for styling consistency
  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("aurora-root");
    return () => root.classList.remove("aurora-root");
  }, []);

  return (
    <div className="events-container">
      {/* Aurora Background */}
      <Aurora
        colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
        amplitude={1}
        blend={0.5}
      />

      {/* Page Content */}
      <div className="events-content">
        <h1
          style={{
            color: CRIMSON,
            fontFamily: FONT?.serif,
            fontSize: "clamp(28px, 4vw, 40px)",
            marginBottom: "6px",
          }}
        >
          Events
        </h1>

        <p
          style={{
            color: TEXT_MUTED,
            marginBottom: "24px",
            fontSize: "clamp(14px, 1.5vw, 16px)",
          }}
        >
          Academic and institutional events.
        </p>

        <div className="events-grid">
          {events.map((event, index) => (
            <div key={index} className="event-card">
              <h3>{event.title}</h3>
              <p>
                <strong>Date:</strong> {event.date}
              </p>
              <p>
                <strong>Location:</strong> {event.location}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scoped Styles */}
      <style>{`
        .events-container {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
        }

        .events-content {
          position: relative;
          z-index: 1;
          max-width: 1100px;
          margin: 0 auto;
          padding: clamp(16px, 3vw, 28px);
          color: #ffffff;
        }

        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 20px;
        }

        .event-card {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 20px;
          color: #ffffff;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .event-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
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
          .events-content {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default EventsPage;