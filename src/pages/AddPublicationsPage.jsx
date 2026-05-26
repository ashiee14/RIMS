import { useState, useEffect } from "react";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";
import { createPublication } from "../services/api";

const {
  crimson: CRIMSON,
  teal: TEAL,
  border: BORDER,
  text: TEXT,
  textMuted: TEXT_MUTED,
  cardBg: CARD_BG,
} = COLORS;

const AddPublicationsPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    authors: "",
    journal: "",
    year: "",
    quartile: "",
    impactFactor: "",
    indexedIn: "",
    doi: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("aurora-root");
    return () => root.classList.remove("aurora-root");
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      setError("");

      // Convert frontend fields
      // into backend serializer format
      const payload = {
        title: formData.title,

        // backend likely expects array
        author_names: formData.authors
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),

        journal: formData.journal,

        year: Number(formData.year),

        quartile: formData.quartile,

        impact_factor: formData.impactFactor
          ? Number(formData.impactFactor)
          : null,

        indexed_in: formData.indexedIn
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean),

        doi: formData.doi,
      };

      console.log("SUBMITTING:", payload);

      const response =
        await createPublication(payload);

      console.log(
        "PUBLICATION CREATED:",
        response
      );

      alert("Publication added successfully!");

      // Reset form
      setFormData({
        title: "",
        authors: "",
        journal: "",
        year: "",
        quartile: "",
        impactFactor: "",
        indexedIn: "",
        doi: "",
      });

    } catch (err) {
      console.error(err);

      console.log(
        "BACKEND ERROR:",
        err.response?.data
      );

      setError(
        err.response?.data?.detail ||
        "Failed to create publication."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="addpub-container">
      {/* Aurora Background */}
      <Aurora
        colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
        amplitude={1}
        blend={0.5}
      />

      {/* Page Content */}
      <div className="addpub-content">
        <h1 style={{ color: CRIMSON }}>Add Publication</h1>
        <p style={{ color: TEXT_MUTED }}>
          Enter publication details to add them to the research repository.
        </p>

        <form onSubmit={handleSubmit} className="form-card">
          <input type="text" name="title" placeholder="Publication Title" onChange={handleChange} required />
          <input type="text" name="authors" placeholder="Authors" onChange={handleChange} required />
          <input type="text" name="journal" placeholder="Journal / Conference" onChange={handleChange} required />

          <div className="grid-2">
            <input type="number" name="year" placeholder="Year" onChange={handleChange} required />
            <input type="text" name="doi" placeholder="DOI" onChange={handleChange} />
          </div>

          <div className="grid-3">
            <input type="text" name="quartile" placeholder="Quartile (Q1–Q4)" onChange={handleChange} />
            <input type="number" step="0.01" name="impactFactor" placeholder="Impact Factor" onChange={handleChange} />
            <input type="text" name="indexedIn" placeholder="Indexed In (Scopus, WoS, PubMed)" onChange={handleChange} />
          </div>
          {error && (
            <div className="error-text">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="submit-btn"
            disabled={submitting}
          >
            {submitting
              ? "Adding..."
              : "Add Publication"}
          </button>

        </form>
      </div>

      {/* Scoped Styles */}
      <style>{`
        .addpub-container {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
        }

        .addpub-content {
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

        .form-card input {
          padding: 10px;
          border-radius: 8px;
          border: 1px solid ${BORDER};
          font-size: 14px;
          color: ${TEXT};
        }

        .error-text {
          color: #ffb3b3;
          font-size: 13px;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .grid-3 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
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
          .grid-2, .grid-3 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AddPublicationsPage;