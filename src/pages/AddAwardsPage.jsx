import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";

const {
  crimson: CRIMSON,
  border: BORDER,
  text: TEXT,
  textMuted: TEXT_MUTED,
  textHint: TEXT_HINT,
  cardBg: CARD_BG,
  lightBg: LIGHT_BG,
} = COLORS;

const AddAwardsPage = ({ onNav }) => {
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    faculty: "",
    dept: "",
    title: "",
    date: "",
    agency: "",
    location: "",
    level: "",
    category: "",
    description: "",
  });
    
  const update = (k, v) => setFields(p => ({ ...p, [k]: v }));
  
  useEffect(() => {
    const root = document.getElementById("root");

    root.classList.add("aurora-root");

    return () =>
      root.classList.remove("aurora-root");
  }, []);
  
  const handleSaveAward = async () => {
  console.log("BUTTON CLICKED");

  try {
    const token = localStorage.getItem("access_token");

    const payload = {
      title: fields.title,
      awarding_agency: fields.agency,
      award_date: fields.date,
      recipient_id: 1,
    };

    console.log("SENDING:", payload);

    const response = await fetch("/api/awards/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log("CREATE STATUS:", response.status);
    console.log("CREATE DATA:", data);

    if (response.ok) {
      alert("Award created successfully!");
      navigate("/awards");
    } 
    else {
      alert("Failed to create award");
    }

  } catch (error) {
    console.error("CREATE ERROR:", error);
  }
};

  const labelStyle = { fontSize: 13, fontWeight: 500, marginBottom: 6, display: "block", color: TEXT };
  const reqStar = <span style={{ color: CRIMSON }}>*</span>;
  const inputStyle = { width: "100%", padding: "10px 12px", border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, color: TEXT, background: "#fff", outline: "none" };
  
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
      <h1 style={{ color: CRIMSON }}>
        Add Award
      </h1>

      <p style={{ color: TEXT_MUTED }}>
        Upload an image or manually create
        a new award entry.
      </p>

      <div className="upload-card">
        <h3 style={{ marginBottom: 16 }}>
          Upload Award Image
        </h3>

        <div className="upload-preview">
          <div>
            <div
              style={{
                fontSize: 34,
                marginBottom: 6,
              }}
            >
              📜
            </div>

            <div
              style={{
                fontSize: 12,
                opacity: 0.8,
              }}
            >
              Certificate Preview
            </div>
          </div>
        </div>

        <button className="action-btn save-btn">
          Upload Image
        </button>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSaveAward();
        }}
        className="form-card"
      >
        <input
          type="text"
          placeholder="Faculty Name"
          value={fields.faculty}
          onChange={(e) =>
            update("faculty", e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Department"
          value={fields.dept}
          onChange={(e) =>
            update("dept", e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Award Title"
          value={fields.title}
          onChange={(e) =>
            update("title", e.target.value)
          }
        />

        <input
          type="date"
          value={fields.date}
          onChange={(e) =>
            update("date", e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Awarding Agency"
          value={fields.agency}
          onChange={(e) =>
            update("agency", e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Location"
          value={fields.location}
          onChange={(e) =>
            update("location", e.target.value)
          }
        />

        <select
          value={fields.level}
          onChange={(e) =>
            update("level", e.target.value)
          }
        >
          <option value="">
            Select Level
          </option>

          <option>
            International
          </option>

          <option>National</option>

          <option>State</option>

          <option>Institutional</option>
        </select>

        <select
          value={fields.category}
          onChange={(e) =>
            update(
              "category",
              e.target.value
            )
          }
        >
          <option value="">
            Select Category
          </option>

          <option>Best Paper</option>

          <option>
            Best Researcher
          </option>

          <option>
            Excellence Award
          </option>

          <option>Other</option>
        </select>

        <textarea
          placeholder="Description"
          value={fields.description}
          onChange={(e) =>
            update(
              "description",
              e.target.value
            )
          }
        />

        <div className="btn-row">
          <button
            type="button"
            className="action-btn delete-btn"
            onClick={() =>
              navigate("/awards")
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="action-btn save-btn"
          >
            Save Award
          </button>
        </div>
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

      .upload-card {
        background: rgba(255,255,255,0.12);

        backdrop-filter: blur(12px);

        border-radius: 12px;

        padding: 24px;

        margin-bottom: 24px;

        text-align: center;
      }

      .upload-preview {
        width: 220px;
        height: 130px;

        margin: 0 auto 18px;

        border-radius: 12px;

        border: 2px dashed
          rgba(255,255,255,0.4);

        display: flex;

        align-items: center;
        justify-content: center;

        background:
          rgba(255,255,255,0.08);
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
      .form-card select,
      .form-card textarea {
        padding: 12px;

        border-radius: 8px;

        border: none;

        outline: none;
      }

      .form-card textarea {
        min-height: 100px;
      }

      .action-btn {
        padding: 12px 18px;

        border: none;

        border-radius: 8px;

        color: white;

        font-weight: bold;

        cursor: pointer;
      }

      .save-btn {
        background: ${CRIMSON};
      }

      .delete-btn {
        background: #444;
      }

      .btn-row {
        display: flex;

        justify-content: flex-end;

        gap: 10px;

        margin-top: 10px;
      }
    `}</style>
  </div>
);
};


export default AddAwardsPage;