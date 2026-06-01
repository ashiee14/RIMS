import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";
import { fetchIPRById } from "../services/api";

const {
  crimson: CRIMSON,
  border: BORDER,
  textMuted: TEXT_MUTED,
  cardBg: CARD_BG,
} = COLORS;

const IPRDetailsPage = () => {
  const { id } = useParams();

  const [ipr, setIpr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadIPR = async () => {
      try {
        setLoading(true);

        const data = await fetchIPRById(id);

        console.log("IPR DETAILS:", data);

        setIpr(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load IPR details.");
      } finally {
        setLoading(false);
      }
    };

    loadIPR();
  }, [id]);

  return (
    <div className="ipr-details-container">
      <Aurora
        colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
        amplitude={1}
        blend={0.5}
      />

      <div className="ipr-details-content">
        
        {loading ? (
          <div className="message">Loading IPR...</div>
        ) : error ? (   
          <div className="message">{error}</div>
        ) : !ipr ? (
          <div className="message">IPR not found.</div>
        ) : (

            
          <div className="details-card">
                        
            <h1>{ipr.title}</h1>

            <div className="detail-row">
              <strong>IPR Type:</strong>
              <span>{ipr.ipr_type || "N/A"}</span>
            </div>

            <div className="detail-row">
              <strong>Status:</strong>
              <span>{ipr.status || "N/A"}</span>
            </div>

            <div className="detail-row">
              <strong>Application Number:</strong>
              <span>{ipr.application_no || "N/A"}</span>
            </div>

            <div className="detail-row">
              <strong>Filing Date:</strong>
              <span>{ipr.filing_date || "N/A"}</span>
            </div>

            <div className="detail-row">
              <strong>Grant Date:</strong>
              <span>{ipr.grant_date || "N/A"}</span>
            </div>

            <div className="detail-row">
              <strong>Inventors:</strong>
              <span>
                {Array.isArray(ipr.inventors)
                  ? ipr.inventors.join(", ")
                  : ipr.inventors || "N/A"}
              </span>
            </div>

            <div className="description-block">
              <strong>Description</strong>

              <p>
                {ipr.description ||
                  "No description available."}
              </p>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .ipr-details-container {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
        }

        .ipr-details-content {
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
          line-height: 1.3;
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

export default IPRDetailsPage;