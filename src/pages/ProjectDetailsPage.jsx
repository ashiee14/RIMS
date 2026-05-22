import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";
import { fetchProjectById } from "../services/api";

const {
  crimson: CRIMSON,
  border: BORDER,
  textMuted: TEXT_MUTED,
  cardBg: CARD_BG,
} = COLORS;

const ProjectDetailsPage = () => {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        setLoading(true);

        const data = await fetchProjectById(id);

        console.log("PROJECT DETAILS:", data);

        setProject(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load project details.");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [id]);

  return (
    <div className="project-details-container">
      <Aurora
        colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
        amplitude={1}
        blend={0.5}
      />

      <div className="project-details-content">
        {loading ? (
          <div className="message">Loading project...</div>
        ) : error ? (
          <div className="message">{error}</div>
        ) : !project ? (
          <div className="message">Project not found.</div>
        ) : (
          <div className="details-card">
            <h1>{project.title}</h1>

            <div className="detail-row">
              <strong>Principal Investigator:</strong>
              <span>
                {project.principal_investigator?.full_name || "N/A"}
              </span>
            </div>

            <div className="detail-row">
              <strong>Department:</strong>
              <span>{project.department?.name || "N/A"}</span>
            </div>

            <div className="detail-row">
              <strong>Status:</strong>
              <span>{project.status || "N/A"}</span>
            </div>

            <div className="detail-row">
              <strong>Funding Amount:</strong>
              <span>{project.amount || 0}</span>
            </div>

            <div className="detail-row">
              <strong>Funding Agency:</strong>
              <span>{project.funding_agency?.name || "N/A"}</span>
            </div>

            <div className="detail-row">
              <strong>Organization:</strong>
              <span>{project.funding_agency?.country || "N/A"}</span>
            </div>

            <div className="detail-row">
              <strong>Start Date:</strong>
              <span>{project.start_date || "N/A"}</span>
            </div>

            <div className="detail-row">
              <strong>End Date:</strong>
              <span>{project.end_date || "N/A"}</span>
            </div>

            <div className="description-block">
              <strong>Description</strong>
              <p>{project.description || "No description available."}</p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .project-details-container {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
        }

        .project-details-content {
          position: relative;
          z-index: 1;
          max-width: 1000px;
          margin: 0 auto;
          padding: 32px 20px;
        }

        .details-card {
          background: ${CARD_BG};
          border: 1px solid ${BORDER};
          border-radius: 18px;
          padding: 28px;
          color: #22125a;
        }

        .details-card h1 {
          margin-bottom: 24px;
          color: ${CRIMSON};
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          padding: 12px 0;
          border-bottom: 1px solid ${BORDER};
        }

        .detail-row strong {
          min-width: 220px;
        }

        .description-block {
          margin-top: 24px;
        }

        .description-block p {
          margin-top: 12px;
          line-height: 1.7;
          color: ${TEXT_MUTED};
        }

        .message {
          text-align: center;
          padding: 80px 0;
          color: white;
          font-size: 16px;
        }

        @media (max-width: 768px) {
          .detail-row {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default ProjectDetailsPage;