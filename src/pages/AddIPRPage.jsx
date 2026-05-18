import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";
import { addIPR } from "../services/api";

const { crimson: CRIMSON } = COLORS;

const AddIPRPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    ipr_type: "",
    status: "",
    application_no: "",
    filing_date: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await addIPR(formData);

      console.log("ADD IPR RESPONSE:", response);
      
      alert("IPR added successfully!");

      navigate("/ipr");

    } catch (error) {
  console.error("FULL ERROR:", error);

  console.log("Backend Response:", error.response);

  alert(
    JSON.stringify(
      error.response?.data || "Failed to add IPR",
      null,
      2
    )
  );
} finally {
      setLoading(false);
    }
  };

  return (
    <div className="aurora-page">
      <Aurora
        colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
        amplitude={1}
        blend={0.5}
      />

      <div className="aurora-content">
        <h1 style={{ color: CRIMSON }}>
          Add IPR
        </h1>

        <form onSubmit={handleSubmit} className="aurora-card">

          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="ipr_type"
            placeholder="IPR Type"
            value={formData.ipr_type}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="status"
            placeholder="Status"
            value={formData.status}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="application_no"
            placeholder="Application Number"
            value={formData.application_no}
            onChange={handleChange}
          />

          <input
            type="date"
            name="filing_date"
            value={formData.filing_date}
            onChange={handleChange}
          />

          <button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add IPR"}
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
          margin: 0 auto;
          padding: 28px;
          color: white;
        }

        .aurora-card {
          display: flex;
          flex-direction: column;
          gap: 14px;

          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(12px);

          border: 1px solid rgba(255,255,255,0.2);

          border-radius: 12px;

          padding: 20px;
        }

        input {
          padding: 12px;
          border-radius: 8px;
          border: none;
          outline: none;
        }

        button {
          padding: 12px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
        }
      `}</style>
    </div>
  );
};

export default AddIPRPage;