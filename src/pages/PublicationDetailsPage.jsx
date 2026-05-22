import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";
import { fetchPublicationById } from "../services/api";

const {
  crimson: CRIMSON,
  border: BORDER,
  textMuted: TEXT_MUTED,
  cardBg: CARD_BG,
} = COLORS;

const PublicationDetailsPage = () => {
  const { id } = useParams();

  const [publication, setPublication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPublication = async () => {
      try {
        setLoading(true);

        const data = await fetchPublicationById(id);

        console.log("PUBLICATION DETAILS:", data);

        setPublication(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load publication details.");
      } finally {
        setLoading(false);
      }
    };

    loadPublication();
  }, [id]);

  return (
    <div className="publication-details-container">
      <Aurora
        colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
        amplitude={1}
        blend={0.5}
      />

      <div className="publication-details-content">
        {loading ? (
          <div className="message">Loading publication...</div>
        ) : error ? (
          <div className="message">{error}</div>
        ) : !publication ? (
          <div className="message">Publication not found.</div>
        ) : (
          <div className="details-card">
            <h1>{publication.title}</h1>

            <div className="detail-row">
              <strong>Authors:</strong>
              <span>
                {publication.author_names?.join(", ") || "N/A"}
              </span>
            </div>

            <div className="detail-row">
              <strong>Journal:</strong>
              <span>
                {publication.journal?.name || "N/A"}
              </span>
            </div>

            <div className="detail-row">
              <strong>Year:</strong>
              <span>{publication.year || "N/A"}</span>
            </div>

            <div className="detail-row">
              <strong>Publication Type:</strong>
              <span>
                {publication.publication_type || "N/A"}
              </span>
            </div>

            <div className="detail-row">
              <strong>Indexed In:</strong>
              <span>
                {Array.isArray(publication.indexed_in)
                  ? publication.indexed_in.join(", ")
                  : publication.indexed_in || "N/A"}
              </span>
            </div>

            <div className="detail-row">
              <strong>DOI:</strong>
              <span>{publication.doi || "N/A"}</span>
            </div>

            <div className="description-block">
              <strong>Abstract</strong>
              <p>
                {publication.abstract || "No abstract available."}
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .publication-details-container {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
        }

        .publication-details-content {
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

export default PublicationDetailsPage;