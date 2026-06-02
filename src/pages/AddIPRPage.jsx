import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Aurora from "../components/Aurora";
import { COLORS,FONT } from "../styles/theme";
import { addIPR, extractIPR } from "../services/api";


const { crimson: CRIMSON } = COLORS;

const AddIPRPage = () => {
  const [file, setFile] = useState(null);
  const [extracting, setExtracting] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    ipr_type: "",
    status: "",
    application_no: "",
    filing_date: "",
  });

  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleExtract = async () => {
    if (!file) {
      alert("Please select a file first");
      return;
    }

    try {
      setExtracting(true);

      const formData = new FormData();
      formData.append("file", file);

      const data = await extractIPR(formData);

      console.log("EXTRACTED DATA:", data);

      // 🔥 Autofill form
      setFormData((prev) => ({
        ...prev,
        title: data.title || "",
        ipr_type: data.ipr_type || "",
        status: data.status || "",
        application_no: data.application_no || "",
        filing_date: data.filing_date || "",
      }));

      alert("Data extracted successfully!");

    } catch (error) {
      console.error(error);
      alert("Extraction failed");
    } finally {
      setExtracting(false);
    }
  };

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

    } 
    catch (error) {
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
        <h1 style={{ color: "#fff",
            textShadow: "0 2px 2px CRIMSON",
            fontFamily: FONT?.serif,
            fontSize: "clamp(28px, 4vw, 40px)", }}>
                  Add IPR
                </h1>

                <form onSubmit={handleSubmit} className="aurora-card">
                  <input type="file" onChange={handleFileChange} />

        <button
          type="button"
          onClick={handleExtract}
          disabled={extracting}
        >
          {extracting ? "Extracting..." : "Auto Fill from File"}
        </button>

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