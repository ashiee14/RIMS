import React, { useState } from "react";
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
  const [fields, setFields] = useState({ faculty: "Enter name", dept: "Enter department", title: "Enter Title", date: "2023-10-01", agency: "Not specified", location: "Not specified", level: "", category: "", description: "" });
  const update = (k, v) => setFields(p => ({ ...p, [k]: v }));
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
    } else {
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
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px" }}>
      <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30, fontWeight: 400, color: CRIMSON, marginBottom: 6 }}>Add Awards</h1>
      <p style={{ color: TEXT_MUTED, marginBottom: 28 }}>Upload an image for quick extraction, or enter manually.</p>
      <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "28px", marginBottom: 20, textAlign: "center" }}>
        <h3 style={{ fontWeight: 600, marginBottom: 16 }}>Upload Awards Image</h3>
        <div style={{ width: 200, height: 120, margin: "0 auto 16px", background: LIGHT_BG, borderRadius: 10, border: `2px dashed ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", cursor: "pointer" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 32, color: TEXT_HINT }}>📜</div>
            <div style={{ fontSize: 11, color: TEXT_HINT }}>Certificate preview</div>
          </div>
          <div style={{ position: "absolute", top: -10, right: -10, width: 22, height: 22, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#e55", fontSize: 14, cursor: "pointer" }}>✕</div>
        </div>
        <button style={{ background: CRIMSON, color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7 }}>
          ↑ Upload Image
        </button>
      </div>
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <button style={{ background: CRIMSON, color: "#fff", border: "none", padding: "10px 24px", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: "pointer" }}>+ Edit</button>
      </div>
      <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 24px" }}>
          {[
            { label: "Name of the Faculty", key: "faculty", req: true },
            { label: "Department", key: "dept", req: true },
            { label: "Title Of Award", key: "title", req: true },
            { label: "Award Date", key: "date", req: true, type: "date" },
            { label: "Awarding Agency", key: "agency", req: true },
            { label: "Location", key: "location", req: true },
            { label: "Level", key: "level", req: false, type: "select", opts: ["International", "National", "State", "Institutional"] },
            { label: "Category", key: "category", req: false, type: "select", opts: ["Best Paper", "Best Researcher", "Excellence Award", "Other"] },
          ].map(({ label, key, req, type, opts }) => (
            <div key={key}>
              <label style={labelStyle}>{label} {req && reqStar}</label>
              {type === "select" ? (
                <select value={fields[key]} onChange={e => update(key, e.target.value)} style={inputStyle}>
                  <option value="">Select...</option>
                  {opts.map(o => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input type={type || "text"} value={fields[key]} onChange={e => update(key, e.target.value)} style={inputStyle} placeholder={fields[key] || `Enter ${label}`} />
              )}
            </div>
          ))}
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={labelStyle}>Description</label>
            <textarea value={fields.description} onChange={e => update("description", e.target.value)} style={{ ...inputStyle, height: 90, resize: "vertical" }} placeholder="Enter description..." />
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 24, justifyContent: "flex-end" }}>
          <button style={{ padding: "10px 24px", border: `1px solid ${BORDER}`, borderRadius: 8, background: "#fff", fontSize: 13, cursor: "pointer" }}>Cancel</button>
            <button
              onClick={handleSaveAward}
              style={{
                padding: "10px 24px",
                background: CRIMSON,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                cursor: "pointer"
              }}
            >
              Save Award
            </button>        
          </div>
      </div>
    </div>
  );
};

export default AddAwardsPage;