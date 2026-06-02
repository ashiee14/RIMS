import { useState, useEffect } from "react";
import Aurora from "../components/Aurora";
import { COLORS, FONT } from "../styles/theme";

const {
  crimson: CRIMSON,
  border: BORDER,
  text: TEXT,
  textMuted: TEXT_MUTED,
  cardBg: CARD_BG,
} = COLORS;

const SDG_COLORS = {
  1:"#E5243B",2:"#DDA63A",3:"#4C9F38",4:"#C5192D",5:"#FF3A21",
  6:"#26BDE2",7:"#FCC30B",8:"#A21942",9:"#FD6925",10:"#DD1367",
  11:"#FD9D24",12:"#BF8B2E",13:"#3F7E44",14:"#0A97D9",15:"#56C02B",
  16:"#00689D",17:"#19486A",
};

const SDGTaggerPage = () => {
  const [text, setText] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [worksSearched, setWorksSearched] = useState(0);

  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("aurora-root");
    return () => root.classList.remove("aurora-root");
  }, []);

  const handleTag = async () => {
    if (text.trim().length < 20) {
      setError("Please enter at least 20 characters.");
      return;
    }
    setLoading(true);
    setError("");
    setResult([]);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/publications/sdg/tag/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to tag."); return; }
      setResult(data.sdgs || []);
      setWorksSearched(data.works_searched || 0);
      if ((data.sdgs || []).length === 0) setError(data.note || "No SDGs found for this text.");
    } catch (err) {
      setError("Failed to reach server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="sdg-container">
      {/* Aurora Background */}
      <Aurora
        colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
        amplitude={1}
        blend={0.5}
      />

      {/* Page Content */}
      <div className="sdg-content">
        <h1
          style={{
            color: "#fff",
            fontFamily: FONT?.serif,
            textShadow: "0 2px 2px CRIMSON",
            fontSize: "clamp(28px, 4vw, 40px)",
          }}
        >
          SDG Tagger
        </h1>

        <p style={{ color: TEXT_MUTED }}>
          Analyze research text and map it to relevant UN Sustainable Development Goals.
        </p>

        <div
          style={{
            background: CARD_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            padding: 20,
          }}
        >
          <textarea
            rows="6"
            placeholder="Paste your abstract or research summary..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              width: "100%",
              padding: 12,
              borderRadius: 8,
              border: `1px solid ${BORDER}`,
              marginBottom: 12,
              color: TEXT,
            }}
          />

          <button
            onClick={handleTag}
            disabled={loading}
            style={{
              background: CRIMSON, color: "#fff", border: "none",
              padding: "10px 18px", borderRadius: 8,
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Loading…" : "Tag SDGs"}
          </button>

          {error && <p style={{ color: "#f87171", marginTop: 12, fontSize: 13 }}>{error}</p>}

          {result.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <p style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 12 }}>
                Analysed by Gemini AI · top {result.length} relevant SDG{result.length !== 1 ? "s" : ""}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {result.map((sdg) => (
                  <div key={sdg.number} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    background: "rgba(255,255,255,0.05)", borderRadius: 8,
                    padding: "10px 14px", border: `1px solid ${SDG_COLORS[sdg.number]}44`,
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 6, flexShrink: 0,
                      background: SDG_COLORS[sdg.number],
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: 13, color: "#fff",
                    }}>
                      {sdg.number}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 500, fontSize: 14 }}>{sdg.name}</div>
                      {sdg.reason && (
                        <div style={{ fontSize: 11, color: TEXT_MUTED, marginTop: 2 }}>
                          {sdg.reason}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scoped Styles */}
      <style>{`
        .sdg-container {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
        }

        .sdg-content {
          position: relative;
          z-index: 1;
          max-width: 900px;
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
          .sdg-content {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default SDGTaggerPage;