import { useState, useEffect } from "react";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";
import { createProject } from "../services/api";
import { useNavigate } from "react-router-dom";

const {
  crimson: CRIMSON,
  teal: TEAL,
  border: BORDER,
  text: TEXT,
  textMuted: TEXT_MUTED,
} = COLORS;

const AddResearchProjectPage = () => {
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
          const response = await createProject(formData);

          console.log("PROJECT CREATED:", response);

          alert("Research project added successfully!");

          setFormData({
            title: "",
            description: "",
            department_id: "",
            funding_agency_id: "",
            amount: "",
            start_date: "",
            end_date: "",
            status: "active",
          });

           // Redirect to Research Page
          navigate("/research");

        } catch (error) {
          console.error("CREATE PROJECT ERROR:", error);

          alert("Failed to create project");
        }
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

            <input
              type="text"
              name="title"
              placeholder="Project Title"
              onChange={handleChange}
              required
            />

            <textarea
              name="description"
              placeholder="Project Description"
              onChange={handleChange}
            />

            <div className="grid-2">

              <input
                type="number"
                name="department_id"
                placeholder="Department ID"
                onChange={handleChange}
                required
              />

              <input
                type="number"
                name="funding_agency_id"
                placeholder="Funding Agency ID"
                onChange={handleChange}
              />

            </div>

            <div className="grid-2">

              <input
                type="number"
                name="amount"
                placeholder="Funding Amount"
                onChange={handleChange}
              />

              <select name="status" onChange={handleChange}>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="proposed">Proposed</option>
              </select>

            </div>

            <div className="grid-2">

              <input
                type="date"
                name="start_date"
                onChange={handleChange}
              />

              <input
                type="date"
                name="end_date"
                onChange={handleChange}
              />

            </div>

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