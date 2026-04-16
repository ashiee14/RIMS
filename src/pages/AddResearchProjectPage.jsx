import { useState, useEffect } from "react";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";

const {
  crimson: CRIMSON,
  teal: TEAL,
  border: BORDER,
  text: TEXT,
  textMuted: TEXT_MUTED,
} = COLORS;

const AddResearchProjectPage = () => {
  const [formData, setFormData] = useState({
    faculty: "",
    department: "",
    title: "",
    type: "",
    startDate: "",
    fundingAgency: "",
    fundingAmount: "",
    status: "Ongoing",
  });

  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("aurora-root");
    return () => root.classList.remove("aurora-root");
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Research Project Added:", formData);
    alert("Research project added successfully!");
  };

  return (
    <div className="addresearch-container">
      {/* Aurora Background */}
      <Aurora
        colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
        amplitude={1}
        blend={0.5}
      />

      {/* Page Content */}
      <div className="addresearch-content">
        <h1 style={{ color: CRIMSON }}>Add Research Project</h1>
        <p style={{ color: TEXT_MUTED }}>
          Provide details of funded or non-funded research projects.
        </p>

        <form onSubmit={handleSubmit} className="form-card">
          <input type="text" name="faculty" placeholder="Faculty Name" onChange={handleChange} required />
          <input type="text" name="department" placeholder="Department" onChange={handleChange} required />
          <input type="text" name="title" placeholder="Project Title" onChange={handleChange} required />

          <div className="grid-2">
            <input type="text" name="type" placeholder="Research Type (National/International)" onChange={handleChange} />
            <input type="date" name="startDate" onChange={handleChange} />
          </div>

          <div className="grid-2">
            <input type="text" name="fundingAgency" placeholder="Funding Agency" onChange={handleChange} />
            <input type="number" name="fundingAmount" placeholder="Funding Amount (Lakhs)" onChange={handleChange} />
          </div>

          <select name="status" onChange={handleChange}>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
            <option value="Proposed">Proposed</option>
          </select>

          <button type="submit" className="submit-btn">
            Add Research Project
          </button>
        </form>
      </div>

      {/* Scoped Styles */}
      <style>{`
        .addresearch-container {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
        }

        .addresearch-content {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
          padding: clamp(16px, 3vw, 28px);
          color: #ffffff;
        }

        .form-card {
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          padding: 20px;
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .form-card input,
        .form-card select {
          padding: 10px;
          border-radius: 8px;
          border: 1px solid ${BORDER};
          font-size: 14px;
          color: ${TEXT};
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .submit-btn {
          background: ${CRIMSON};
          color: #fff;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: 0.3s;
        }

        .submit-btn:hover {
          background: ${TEAL};
        }

        .aurora-container {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AddResearchProjectPage;