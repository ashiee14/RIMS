import { useState, useEffect } from "react";
import Aurora from "../components/Aurora";
import { COLORS, FONT } from "../styles/theme";
import { checkJournal } from "../services/api";

const {
  crimson: CRIMSON,
  teal: TEAL,
  border: BORDER,
  textMuted: TEXT_MUTED,
  cardBg: CARD_BG,
} = COLORS;

const JournalCheckerPage = () => {
  const [journal, setJournal] = useState("");
  const [result, setResult] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Adds Aurora styling to the root
  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("aurora-root");

    return () => root.classList.remove("aurora-root");
  }, []);

  const handleCheck = async () => {
    if (!journal.trim()) return;

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const data = await checkJournal(journal);

      console.log("JOURNAL RESPONSE:", data);

      setResult(data);

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.detail ||
        "Journal not found"
      );

    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="journal-container">
      {/* Aurora Background */}
      <Aurora
        colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
        amplitude={1}
        blend={0.5}
      />

      {/* Page Content */}
      <div className="journal-content">
        <h1
          style={{
            color: CRIMSON,
            fontFamily: FONT?.serif,
            fontSize: "clamp(28px, 4vw, 40px)",
          }}
        >
          Journal Checker
        </h1>

        <p style={{ color: TEXT_MUTED }}>
          Verify journal indexing, quartile ranking, and impact factor.
        </p>

        <div
          style={{
            background: CARD_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            padding: 20,
          }}
        >
          <input
            type="text"
            placeholder="Enter journal name, ISSN (e.g. 0140-6736), or OpenAlex ID (e.g. S12345)"
            value={journal}
            onChange={(e) => setJournal(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            style={{ width: "100%", padding: 10, borderRadius: 8, border: `1px solid ${BORDER}`, marginBottom: 12, color: "#fff", background: "rgba(255,255,255,0.07)" }}
          />

          <button onClick={handleCheck} style={{ background: CRIMSON, color: "#fff", border: "none", padding: "9px 20px", borderRadius: 8, cursor: "pointer", fontWeight: 500 }}>
            {loading ? "Checking…" : "Check Journal"}
          </button>

          {error && <p style={{ marginTop: 12, color: "#f87171", fontSize: 13 }}>{error}</p>}

          {result && (
            <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 12 }}>
              <p style={{ fontSize: 12, color: TEXT_MUTED }}>{result.count} journal{result.count !== 1 ? "s" : ""} found</p>
              {(result.results || []).map((j, i) => (
                <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: `1px solid ${BORDER}`, borderRadius: 10, padding: 16 }}>
                  <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8 }}>{j.display_name}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 16px", fontSize: 13 }}>
                    <span style={{ color: TEXT_MUTED }}>ISSN</span>
                    <span>{j.issn?.join(", ") || "—"}</span>
                    <span style={{ color: TEXT_MUTED }}>Quartile</span>
                    <span style={{ color: j.quartile ? "#4ade80" : TEXT_MUTED }}>{j.quartile || "—"}</span>
                    <span style={{ color: TEXT_MUTED }}>CiteScore</span>
                    <span>{j.citescore ?? "—"}</span>
                    <span style={{ color: TEXT_MUTED }}>Impact Factor</span>
                    <span>{j.impact_factor ?? "—"}</span>
                    <span style={{ color: TEXT_MUTED }}>Scopus</span>
                    <span style={{ color: j.is_indexed_in_scopus ? "#4ade80" : "#f87171" }}>{j.is_indexed_in_scopus ? "Indexed" : "Not indexed"}</span>
                    <span style={{ color: TEXT_MUTED }}>Web of Science</span>
                    <span style={{ color: j.is_indexed_in_wos ? "#4ade80" : "#f87171" }}>{j.is_indexed_in_wos ? "Indexed" : "Not indexed"}</span>
                    <span style={{ color: TEXT_MUTED }}>Open Access</span>
                    <span>{j.is_open_access ? "Yes" : "No"}</span>
                  </div>
                  {j.provider_urls && (
                    <div style={{ marginTop: 10, display: "flex", gap: 10, flexWrap: "wrap" }}>
                      {j.provider_urls.homepage && <a href={j.provider_urls.homepage} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: TEAL }}>Homepage ↗</a>}
                      {j.provider_urls.openalex && <a href={j.provider_urls.openalex} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: TEAL }}>OpenAlex ↗</a>}
                      {j.provider_urls.wos && <a href={j.provider_urls.wos} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: TEAL }}>WoS ↗</a>}
                      {j.provider_urls.scopus && <a href={j.provider_urls.scopus} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: TEAL }}>Scopus ↗</a>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Scoped Styles */}
      <style>{`
        .journal-container {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
        }

        .journal-content {
          position: relative;
          z-index: 1;
          max-width: 800px;
          margin: 0 auto;
          padding: clamp(16px, 3vw, 28px);
          color: #ffffff;
        }

        /* Ensure Aurora stays in the background */
        .aurora-container {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .aurora-layer {
          position: absolute;
          width: 100%;
          height: 100%;
          animation: auroraMove 18s infinite alternate ease-in-out;
        }

        .aurora-layer-1 { animation-delay: 0s; }
        .aurora-layer-2 { animation-delay: 4s; }
        .aurora-layer-3 { animation-delay: 8s; }

        @keyframes auroraMove {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.1); }
          100% { transform: translate(-30px, 40px) scale(1.05); }
        }

        /* Responsive Adjustments */
        @media (max-width: 768px) {
          .journal-content {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default JournalCheckerPage;