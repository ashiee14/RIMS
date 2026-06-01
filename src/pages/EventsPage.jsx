import { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import Aurora from "../components/Aurora";
import { COLORS, FONT } from "../styles/theme";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();
  const { role } = useAuth();
  const isViewer = role === "viewer";

  const [editForm, setEditForm] = useState({
      title: "",
      event_type: "conference",
      start_date: "",
      end_date: "",
      location: "",
      status: "scheduled",
  });

  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("aurora-root");
    return () => root.classList.remove("aurora-root");
  }, []);

  useEffect(() => {
  const loadEvents = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("access_token");

      const response = await fetch(`${import.meta.env.VITE_API_URL}/events/?page=${currentPage}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setEvents(data.results || []);
      setTotalPages(data.total_pages || 1);

    } catch (error) {
      console.error("Error fetching events:", error);
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  loadEvents();
}, [currentPage]);



const handleDeleteEvent = async (id) => {
  try {
    const token = localStorage.getItem("access_token");

    console.log("DELETING EVENT:", id);

    const response = await fetch(`https://rims-api.prerna.sh/api/events/${id}/`, {
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

  setEditForm({
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
      title: editForm.title,
      event_type: editForm.event_type,
      start_date: editForm.start_date,
      end_date: editForm.end_date,
      location: editForm.location,
      status: editForm.status,
    };

    console.log("UPDATING EVENT:", payload);

    const response = await fetch(
      `https://rims-api.prerna.sh/api/events/${editingId}/`,
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

      setEditForm({
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
            color: "#fff",
            textShadow: "0 2px 2px CRIMSON",
            fontFamily: FONT?.serif,
            fontSize: "clamp(28px, 4vw, 40px)",
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

        {!isViewer && (
          <button
            onClick={() => navigate("/add-event")}
            className="event-btn event-create-btn"
            style={{ marginBottom: 24 }}
          >
            Add Event
          </button>
        )}


        <div className="events-grid">
          {loading ? (
  <p>Loading events...</p>
) : events.length === 0 ? (
  <p>No events found.</p>
) : (
  events.map((event) => (
    <div key={event.id} className="event-card">

  {editingId === event.id ? (
    <>
  <input
    type="text"
    placeholder="Event Title"
    value={editForm.title}
    onChange={(e) =>
      setEditForm({
        ...editForm,
        title: e.target.value,
      })
    }
    style={inputStyle}
  />

  <select
    value={editForm.event_type}
    onChange={(e) =>
      setEditForm({
        ...editForm,
        event_type: e.target.value,
      })
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
    value={editForm.start_date}
    onChange={(e) =>
      setEditForm({
        ...editForm,
        start_date: e.target.value,
      })
    }
    style={inputStyle}
  />

  <input
    type="date"
    value={editForm.end_date}
    onChange={(e) =>
      setEditForm({
        ...editForm,
        end_date: e.target.value,
      })
    }
    style={inputStyle}
  />

  <input
    type="text"
    placeholder="Location"
    value={editForm.location}
    onChange={(e) =>
      setEditForm({
        ...editForm,
        location: e.target.value,
      })
    }
    style={inputStyle}
  />

  <select
    value={editForm.status}
    onChange={(e) =>
      setEditForm({
        ...editForm,
        status: e.target.value,
      })
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

  <div
    style={{
      display: "flex",
      gap: 10,
      marginTop: 12,
      flexWrap: "wrap",
    }}
  >
    <button
      onClick={handleUpdateEvent}
      className="event-btn event-edit-btn"
    >
      Save
    </button>

    <button
      onClick={() => setEditingId(null)}
      className="event-btn event-delete-btn"
    >
      Cancel
    </button>
  </div>
</>
  ) : (
    <>
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
        onClick={() => navigate(`/events/${event.id}`)}
        className="event-btn"
        style={{
          marginTop: 10,
          marginRight: 10,
          padding: "8px 14px",
          border: "none",
          borderRadius: 8,
          background: "#ffffff",
          color: "#2200a8",
          cursor: "pointer",
          fontWeight: "bold",
        }}
        
      >
        View 
      </button>

      <button
        onClick={() => handleEditClick(event)}
        className="event-btn event-edit-btn"
        style={{ marginTop: 10, marginRight: 10 }}
      >
        Edit
      </button>

      <button
        onClick={() => handleDeleteEvent(event.id)}
        className="event-btn event-delete-btn"
        style={{ marginTop: 10, marginRight: 10 }}
      >
        Delete
      </button>
    </>
  )}
</div>
  ))
)}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => { setCurrentPage(p); window.scrollTo(0, 0); }} />
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
          justify-content: space-between;
        }

        .event-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgb(255, 255, 255);
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

        .event-btn {
  padding: 10px 14px;

  border: none;

  border-radius: 8px;

  cursor: pointer;

  font-weight: bold;

  color: #fff;

  transition:
    transform 0.25s ease,
    opacity 0.25s ease;
}

.event-btn:hover {
  transform: translateY(-2px);

  opacity: 0.92;
}

.event-edit-btn {
  background: #2563eb;
}

.event-delete-btn {
  background: #2c15c5;
}

.event-create-btn {
  background: ${CRIMSON};
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