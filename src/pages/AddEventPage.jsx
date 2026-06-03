import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Aurora from "../components/Aurora";
import { COLORS,FONT } from "../styles/theme";
import API from "../services/api";

const {
  crimson: CRIMSON,
  textMuted: TEXT_MUTED,
} = COLORS;

const AddEventPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
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

    return () =>
      root.classList.remove("aurora-root");
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/events/create/", formData);

      console.log("CREATE EVENT:", res.data);

      alert("Event created successfully!");
      navigate("/events");

    } catch (error) {
      console.error(error);
      alert("Error creating event");
    }
  };

  return (
    <div className="aurora-page">
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

      <div className="aurora-content">
        <h1 style={{ color: "#fff",
            textShadow: "0 2px 2px CRIMSON",
            fontFamily: FONT?.serif,
            fontSize: "clamp(28px, 4vw, 40px)", }}>
          Add Event
        </h1>

        <p style={{ color: TEXT_MUTED }}>
          Create a new event record.
        </p>

        <form
          onSubmit={handleSubmit}
          className="form-card"
        >
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <select
            name="event_type"
            value={formData.event_type}
            onChange={handleChange}
          >
            <option value="conference">
              Conference
            </option>

            <option value="fdp">
              FDP
            </option>

            <option value="workshop">
              Workshop
            </option>

            <option value="seminar">
              Seminar
            </option>

            <option value="webinar">
              Webinar
            </option>
          </select>

          <input
            type="date"
            name="start_date"
            value={formData.start_date}
            onChange={handleChange}
          />

          <input
            type="date"
            name="end_date"
            value={formData.end_date}
            onChange={handleChange}
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="draft">
              Draft
            </option>

            <option value="scheduled">
              Scheduled
            </option>

            <option value="open">
              Open
            </option>

            <option value="running">
              Running
            </option>

            <option value="completed">
              Completed
            </option>

            <option value="cancelled">
              Cancelled
            </option>
          </select>

          <button type="submit">
            Save Event
          </button>
        </form>
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
          max-width: 700px;
          margin: auto;
          padding: 30px;
          color: white;
        }

        .form-card {
          background: rgba(255,255,255,0.12);

          backdrop-filter: blur(12px);

          border-radius: 12px;

          padding: 24px;

          display: flex;

          flex-direction: column;

          gap: 14px;
        }

        .form-card input,
        .form-card select {
          padding: 12px;

          border-radius: 8px;

          border: none;

          outline: none;
        }

        .form-card button {
          padding: 12px;

          border: none;

          border-radius: 8px;

          background: ${CRIMSON};

          color: white;

          font-weight: bold;

          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default AddEventPage;