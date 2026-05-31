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

const QUARTILE_COLORS = {
  Q1: "#B22222",
  Q2: "#1D6B5E",
  Q3: "#C8941A",
  Q4: "#4A90D9",
};

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

            {/* Quality badges */}
            <div className="detail-badges">
              {publication.in_top_1_percentile && (
                <span className="detail-badge badge-top1">Top 1%</span>
              )}
              {publication.in_top_10_percentile && !publication.in_top_1_percentile && (
                <span className="detail-badge badge-top10">Top 10%</span>
              )}
              {publication.journal?.quartile && (
                <span
                  className="detail-badge"
                  style={{ background: QUARTILE_COLORS[publication.journal.quartile] || "#555" }}
                >
                  {publication.journal.quartile}
                </span>
              )}
              {publication.is_open_access && (
                <span className="detail-badge badge-oa">Open Access</span>
              )}
            </div>

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
                {publication.journal?.issn && (
                  <span className="sub-detail"> · ISSN {publication.journal.issn}</span>
                )}
                {publication.journal?.publisher && (
                  <span className="sub-detail"> · {publication.journal.publisher}</span>
                )}
              </span>
            </div>

            {publication.journal?.hindex != null && (
              <div className="detail-row">
                <strong>Journal H-Index:</strong>
                <span>{publication.journal.hindex}</span>
              </div>
            )}

            <div className="detail-row">
              <strong>Year:</strong>
              <span>{publication.year || "N/A"}</span>
            </div>

            <div className="detail-row">
              <strong>Publication Type:</strong>
              <span>{publication.publication_type || "N/A"}</span>
            </div>

            <div className="detail-row">
              <strong>Indexed In:</strong>
              <span>
                {Array.isArray(publication.indexing) && publication.indexing.length > 0
                  ? publication.indexing.map((i) => i.badge?.name).filter(Boolean).join(", ")
                  : Array.isArray(publication.indexed_in)
                  ? publication.indexed_in.join(", ")
                  : publication.indexed_in || "N/A"}
              </span>
            </div>

            <div className="detail-row">
              <strong>DOI:</strong>
              <span>
                {publication.doi ? (
                  <a
                    href={`https://doi.org/${publication.doi}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: CRIMSON }}
                  >
                    {publication.doi}
                  </a>
                ) : "N/A"}
              </span>
            </div>

            <div className="detail-row">
              <strong>Citations:</strong>
              <span>{publication.cited_by_count ?? "N/A"}</span>
            </div>

            {publication.impact_factor != null && (
              <div className="detail-row">
                <strong>Impact Factor:</strong>
                <span>IF: {Number(publication.impact_factor).toFixed(2)}</span>
              </div>
            )}

            {publication.fwci != null && (
              <div className="detail-row">
                <strong>FWCI:</strong>
                <span>
                  {Number(publication.fwci).toFixed(2)}
                  {publication.fwci > 1.0 && (
                    <span className="sub-detail"> (above world average)</span>
                  )}
                </span>
              </div>
            )}

            {publication.citation_normalized_percentile != null && (
              <div className="detail-row">
                <strong>Citation Percentile:</strong>
                <span>
                  {(publication.citation_normalized_percentile * 100).toFixed(1)}th percentile
                </span>
              </div>
            )}

            {(publication.volume || publication.issue || publication.pages) && (
              <div className="detail-row">
                <strong>Volume / Issue / Pages:</strong>
                <span>
                  {[
                    publication.volume && `Vol. ${publication.volume}`,
                    publication.issue && `Issue ${publication.issue}`,
                    publication.pages && `pp. ${publication.pages}`,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </div>
            )}

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
          margin-bottom: 16px;
          color: ${CRIMSON};
        }

        .detail-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 20px;
        }

        .detail-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.04em;
        }

        .badge-top1 { background: #B22222; }
        .badge-top10 { background: #E8820C; }
        .badge-oa { background: #1D6B5E; }

        .detail-row {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          padding: 12px 0;
          border-bottom: 1px solid ${BORDER};
        }

        .detail-row strong {
          min-width: 220px;
          flex-shrink: 0;
        }

        .sub-detail {
          color: ${TEXT_MUTED};
          font-size: 0.9em;
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
          .detail-row strong {
            min-width: unset;
          }
        }
      `}</style>
    </div>
  );
};

export default PublicationDetailsPage;
