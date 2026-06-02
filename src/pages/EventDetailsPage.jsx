import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Aurora from "../components/Aurora";
import { COLORS, FONT } from "../styles/theme";
import { useAuth } from "../contexts/AuthContext";

const {
  crimson: CRIMSON,
  border: BORDER,
  textMuted: TEXT_MUTED,
  textHint: TEXT_HINT,
} = COLORS;

const EventDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const isViewer = role === "viewer";

  const [event, setEvent] = useState(null);

  const [loading, setLoading] = useState(true);

  const [participating, setParticipating] =
    useState(false);

  useEffect(() => {
    const root = document.getElementById("root");

    root.classList.add("aurora-root");

    return () =>
      root.classList.remove("aurora-root");
  }, []);

  useEffect(() => {
    const loadEvent = async () => {
      try {
        setLoading(true);

        const token =
          localStorage.getItem("access_token");

        const response = await fetch(
          `https://rims-api.prerna.sh/api/events/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("EVENT DETAILS:", data);

        setEvent(data);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadEvent();
  }, [id]);

  const handleParticipate = async () => {
    try {
      setParticipating(true);

      const token =
        localStorage.getItem("access_token");

      const response = await fetch(
        `https://rims-api.prerna.sh/api/events/${id}/participate/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":
              "application/json",
          },
        }
      );

      const data = await response.json();

      console.log("PARTICIPATE:", data);

      if (response.ok) {
        alert("Participation successful!");
      } else {
        alert(
          data?.detail ||
            "Failed to participate"
        );
      }

    } catch (error) {
      console.error(error);

      alert("Error participating in event");
    } finally {
      setParticipating(false);
    }
  };

  if (loading) {
    return (
      <div className="details-page">
        <p>Loading event...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="details-page">
        <p>Event not found.</p>
      </div>
    );
  }

  return (
    <div className="details-page">
      <Aurora
        colorStops={[
          "#8061fc",
          "#2500b7",
          "#000000",
          "#2200a8",
        ]}
        amplitude={1}
        blend={0.5}
      />

      <div className="details-content">
        <button
          onClick={() => navigate(-1)}
          className="back-btn"
        >
          ← Back
        </button>

        <div className="details-card">
          <div className="status-pill">
            {event.status}
          </div>

          <h1 style={{color: "#fff",
                    textShadow: "0 2px 2px CRIMSON",
                    fontFamily: FONT?.serif,
                    fontSize: "clamp(28px, 4vw, 40px)",}}>{event.title}</h1>

          <p>
            <strong>Type:</strong>{" "}
            {event.event_type}
          </p>

          <p>
            <strong>Location:</strong>{" "}
            {event.location || "N/A"}
          </p>

          <p>
            <strong>Start Date:</strong>{" "}
            {event.start_date}
          </p>

          <p>
            <strong>End Date:</strong>{" "}
            {event.end_date}
          </p>

          {event.description && (
            <div className="description-box">
              <h3>Description</h3>

              <p>{event.description}</p>
            </div>
          )}

          {!isViewer && (
            <button
              onClick={handleParticipate}
              disabled={participating}
              className="participate-btn"
            >
              {participating ? "Processing..." : "Participate"}
            </button>
          )}
        </div>
      </div>

      <style>{`
        .details-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
          color: white;
        }

        .details-content {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: auto;
          padding: 30px;
        }

        .back-btn {
          margin-bottom: 20px;
          padding: 10px 16px;
          border: none;
          border-radius: 8px;
          background: rgba(255,255,255,0.12);
          color: white;
          cursor: pointer;
        }

        .details-card {
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(14px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 18px;
          padding: 28px;
          position: relative;
        }

        .details-card h1 {
          margin-top: 10px;
          margin-bottom: 20px;
          line-height: 1.3;
          color: ${CRIMSON};
        }

        .details-card p {
          margin: 10px 0;
          color: rgba(255,255,255,0.92);
        }

        .status-pill {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.14);
          border: 1px solid ${BORDER};
          color: ${TEXT_HINT};
          font-size: 12px;
          text-transform: uppercase;
        }

        .description-box {
          margin-top: 24px;
          padding: 20px;
          border-radius: 14px;
          background: rgba(0,0,0,0.2);
        }

        .participate-btn {
          margin-top: 28px;
          padding: 14px 18px;
          border: none;
          border-radius: 10px;
          background: ${CRIMSON};
          color: white;
          font-weight: bold;
          cursor: pointer;
          width: 100%;
          transition: 0.25s ease;
        }

        .participate-btn:hover {
          transform: translateY(-2px);
          opacity: 0.92;
        }

        .participate-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default EventDetailsPage;