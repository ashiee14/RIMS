import { useState, useEffect } from "react";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";
import { fetchProjectById, updateProject } from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

const {
  crimson: CRIMSON,
  teal: TEAL,
  border: BORDER,
  text: TEXT,
  textMuted: TEXT_MUTED,
} = COLORS;

const EditResearchProjectPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    department_id: "",
    funding_agency_id: "",
    amount: "",
    start_date: "",
    end_date: "",
    status: "active",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProject = async () => {
      try {
        const data = await fetchProjectById(id);

        setFormData({
          title: data.title || "",
          description: data.description || "",
          department_id: data.department?.id || "",
          funding_agency_id: data.funding_agency?.id || "",
          amount: data.amount || "",
          start_date: data.start_date || "",
          end_date: data.end_date || "",
          status: data.status || "active",
        });

      } catch (error) {
        console.error("LOAD ERROR:", error);
        alert("Failed to load project");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateProject(id, formData);

      alert("Project updated successfully!");
      navigate("/research");

    } catch (error) {
      console.error("UPDATE ERROR:", error);
      alert("Failed to update project");
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Loading...</p>;

  return (
    <div className="addresearch-container">
      <Aurora
        colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
        amplitude={1}
        blend={0.5}
      />

      <div className="addresearch-content">
        <h1 style={{ color: CRIMSON }}>Edit Research Project</h1>
        <p style={{ color: TEXT_MUTED }}>
          Update your research project details.
        </p>

        <form onSubmit={handleSubmit} className="form-card">

          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
          />

          <div className="grid-2">
            <input
              type="number"
              name="department_id"
              value={formData.department_id}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="funding_agency_id"
              value={formData.funding_agency_id}
              onChange={handleChange}
            />
          </div>

          <div className="grid-2">
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
            />

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="proposed">Proposed</option>
            </select>
          </div>

          <div className="grid-2">
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
          </div>

          <button type="submit" className="submit-btn">
            Update Project
          </button>

        </form>
      </div>

      <style>{`
        .addresearch-container {
          position: relative;
          min-height: 100vh;
        }

        .addresearch-content {
          position: relative;
          z-index: 1;
          max-width: 900px;
          margin: 0 auto;
          padding: 24px;
          color: #fff;
        }

        .form-card {
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .form-card input,
        .form-card select,
        .form-card textarea {
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
          padding: 10px;
          border-radius: 8px;
          border: none;
          cursor: pointer;
        }

        .submit-btn:hover {
          background: ${TEAL};
        }
      `}</style>
    </div>
  );
};

export default EditResearchProjectPage;