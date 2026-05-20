import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";

import {
  fetchEventById,
  participateInEvent,
  leaveEvent,
} from "../services/api";

const {
  crimson: CRIMSON,
  textMuted: TEXT_MUTED,
} = COLORS;

const EventDetailsPage = () => {
  const { id } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadEvent = async () => {
    try {
      const data = await fetchEventById(id);

      console.log("EVENT DETAILS:", data);

      setEvent(data);

    } catch (error) {
      console.error("Failed loading event:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvent();
  }, [id]);

  const handleParticipate = async () => {
    try {
      await participateInEvent(id);

      alert("Successfully participated!");

      loadEvent();

    } catch (error) {
      console.error(error);
      alert("Failed to participate");
    }
  };

  const handleLeave = async () => {
    try {
      await leaveEvent(id);

      alert("Participation removed!");

      loadEvent();

    } catch (error) {
      console.error(error);
      alert("Failed to leave event");
    }
  };

  if (loading) {
    return <p>Loading event...</p>;
  }

  if (!event) {
    return <p>Event not found.</p>;
  }

  return (
    <div className="aurora-page">
      <Aurora
        colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
        amplitude={1}
        blend={0.5}
      />

      <div className="aurora-content">

        <h1 style={{ color: CRIMSON }}>
          {event.title}
        </h1>

        <p style={{ color: TEXT_MUTED }}>
          {event.description}
        </p>

        <div className="aurora-card">

          <p>
            <strong>Date:</strong> {event.date}
          </p>

          <p>
            <strong>Venue:</strong> {event.venue}
          </p>

          <p>
            <strong>Organizer:</strong> {event.organizer}
          </p>

          <div className="btn-group">

            <button onClick={handleParticipate}>
              Participate
            </button>

            <button onClick={handleLeave}>
              Leave Event
            </button>

          </div>
        </div>
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
          max-width: 900px;
          margin: 0 auto;
          padding: 28px;
          color: white;
        }

        .aurora-card {
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: 20px;
          margin-top: 20px;
        }

        .btn-group {
          display: flex;
          gap: 12px;
          margin-top: 20px;
        }

        button {
          padding: 12px 18px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default EventDetailsPage;