import { useEffect, useState } from "react";
import Aurora from "../components/Aurora";
import { COLORS, FONT } from "../styles/theme";

const {
  crimson: CRIMSON,
  border: BORDER,
  textMuted: TEXT_MUTED,
  cardBg: CARD_BG,
} = COLORS;

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: 10,
  borderRadius: 8,
  border: "1px solid #ccc",
};


const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
const [editingId, setEditingId] = useState(null);

  const [fields, setFields] = useState({
  title: "",
  event_type: "conference",
  start_date: "",
  end_date: "",
  location: "",
  status: "scheduled",
});

const updateField = (key, value) => {
  setFields((prev) => ({
    ...prev,
    [key]: value,
  }));
};


  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("aurora-root");
    return () => root.classList.remove("aurora-root");
  }, []);

  useEffect(() => {
  const loadEvents = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch("/api/events/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("EVENTS:", data);

      setEvents(Array.isArray(data.results) ? data.results : []);
    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  loadEvents();
}, []);

const handleCreateEvent = async () => {
  try {
    const token = localStorage.getItem("access_token");

    const payload = {
      title: fields.title,
      event_type: fields.event_type,
      start_date: fields.start_date,
      end_date: fields.end_date,
      location: fields.location,
      status: fields.status,
    };

    console.log("EVENT PAYLOAD:", payload);

    const response = await fetch("/api/events/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log("CREATE EVENT STATUS:", response.status);
    console.log("CREATE EVENT DATA:", data);

    if (response.ok) {
      alert("Event created!");

      setEvents((prev) => [data, ...prev]);

      setFields({
        title: "",
        event_type: "conference",
        start_date: "",
        end_date: "",
        location: "",
        status: "scheduled",
      });
    } else {
      alert("Failed to create event");
    }

  } catch (error) {
    console.error("CREATE EVENT ERROR:", error);
  }
};

const handleDeleteEvent = async (id) => {
  try {
    const token = localStorage.getItem("access_token");

    console.log("DELETING EVENT:", id);

    const response = await fetch(`/api/events/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("DELETE STATUS:", response.status);

    if (response.status === 204) {
      alert("Event deleted!");

      setEvents((prev) =>
        prev.filter((event) => event.id !== id)
      );
    } else {
      const data = await response.json();

      console.log("DELETE ERROR:", data);

      alert("Failed to delete event");
    }

  } catch (error) {
    console.error("DELETE EVENT ERROR:", error);
  }
};

const handleEditClick = (event) => {
  setEditingId(event.id);

  setFields({
    title: event.title || "",
    event_type: event.event_type || "conference",
    start_date: event.start_date || "",
    end_date: event.end_date || "",
    location: event.location || "",
    status: event.status || "scheduled",
  });
};

const handleUpdateEvent = async () => {
  try {
    const token = localStorage.getItem("access_token");

    const payload = {
      title: fields.title,
      event_type: fields.event_type,
      start_date: fields.start_date,
      end_date: fields.end_date,
      location: fields.location,
      status: fields.status,
    };

    console.log("UPDATING EVENT:", payload);

    const response = await fetch(
      `/api/events/${editingId}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    console.log("UPDATE STATUS:", response.status);
    console.log("UPDATE DATA:", data);

    if (response.ok) {
      alert("Event updated!");

      setEvents((prev) =>
        prev.map((event) =>
          event.id === editingId ? data : event
        )
      );

      setEditingId(null);

      setFields({
        title: "",
        event_type: "conference",
        start_date: "",
        end_date: "",
        location: "",
        status: "scheduled",
      });
    } else {
      alert("Failed to update event");
    }

  } catch (error) {
    console.error("UPDATE ERROR:", error);
  }
};



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

<div
  style={{
    background: CARD_BG,
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  }}
>
  <h3>Create Event</h3>

  <input
    type="text"
    placeholder="Event Title"
    value={fields.title}
    onChange={(e) =>
      updateField("title", e.target.value)
    }
    style={inputStyle}
  />

  <select
    value={fields.event_type}
    onChange={(e) =>
      updateField("event_type", e.target.value)
    }
    style={inputStyle}
  >
    <option value="conference">Conference</option>
    <option value="fdp">FDP</option>
    <option value="workshop">Workshop</option>
    <option value="seminar">Seminar</option>
    <option value="webinar">Webinar</option>
  </select>

  <input
    type="date"
    value={fields.start_date}
    onChange={(e) =>
      updateField("start_date", e.target.value)
    }
    style={inputStyle}
  />

  <input
    type="date"
    value={fields.end_date}
    onChange={(e) =>
      updateField("end_date", e.target.value)
    }
    style={inputStyle}
  />

  <input
    type="text"
    placeholder="Location"
    value={fields.location}
    onChange={(e) =>
      updateField("location", e.target.value)
    }
    style={inputStyle}
  />

  <select
    value={fields.status}
    onChange={(e) =>
      updateField("status", e.target.value)
    }
    style={inputStyle}
  >
    <option value="draft">Draft</option>
    <option value="scheduled">Scheduled</option>
    <option value="open">Open</option>
    <option value="running">Running</option>
    <option value="completed">Completed</option>
    <option value="cancelled">Cancelled</option>
  </select>

  <button
  onClick={
    editingId
      ? handleUpdateEvent
      : handleCreateEvent
  }
  style={{
    marginTop: 14,
    padding: "10px 18px",
    border: "none",
    borderRadius: 8,
    background: CRIMSON,
    color: "#fff",
    cursor: "pointer",
  }}
>
  {editingId ? "Update Event" : "Create Event"}
</button>

</div>
        <div className="events-grid">
          {loading ? (
  <p>Loading events...</p>
) : events.length === 0 ? (
  <p>No events found.</p>
) : (
  events.map((event) => (
    <div key={event.id} className="event-card">
      <h3>{event.title}</h3>

      <p>
        <strong>Type:</strong> {event.event_type}
      </p>

      <p>
        <strong>Status:</strong> {event.status}
      </p>

      <p>
        <strong>Start:</strong> {event.start_date}
      </p>

      <p>
        <strong>End:</strong> {event.end_date}
      </p>

      <p>
        <strong>Location:</strong> {event.location}
      </p>

      <button
  onClick={() => handleEditClick(event)}
  style={{
    marginTop: 10,
    marginRight: 10,
    padding: "8px 14px",
    border: "none",
    borderRadius: 8,
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
  }}
>
  Edit
</button>


      <button
  onClick={() => handleDeleteEvent(event.id)}
  style={{
    marginTop: 10,
    padding: "8px 14px",
    border: "none",
    borderRadius: 8,
    background: "#2c15c5",
    color: "#fff",
    cursor: "pointer",
  }}
>
  Delete
</button>


    </div>
  ))
)}
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