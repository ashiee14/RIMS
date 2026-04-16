import { useState, useEffect } from "react";
import Aurora from "../components/Aurora";
import { COLORS, FONT } from "../styles/theme";

const { 
  crimson: CRIMSON,
  crimsonLight: CRIMSON_LIGHT,
  teal: TEAL,
  border: BORDER,
  text: TEXT,
  textMuted: TEXT_MUTED,
  lightBg: LIGHT_BG,
  cardBg: CARD_BG,
  textHint: TEXT_HINT,
} = COLORS;


const UserProfilePage = ({ onNav }) => {
  const [activeTab, setActiveTab] = useState("Publications");
  const pubs = [
    { id: 1, title: "Minimal Erythema Dose Variability in Indian Skin: Clinical Implications Across Pigmentary and Inflammatory Dermatoses", authors: "Divya Asnani, Shrishti Singh, Anushka Agarwal, Priya Garg, Aayush Gupta", journal: "Clinical and Experimental Dermatology  Published: 4 Oct 2025", q: "Q2", if: 2.9, hindex: 92, fwci: 0, pe: 0, indexed: "PubMed" },
  ];
  useEffect(() => {
  const root = document.getElementById("root");
  root.classList.add("aurora-root");
  return () => root.classList.remove("aurora-root");
}, []);
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
      {/* Profile Header */}
      <Aurora
      colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
      amplitude={1}
      blend={0.5}
      />  
      <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "20px 24px", marginBottom: 20, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 90, height: 90, borderRadius: 10, background: `linear-gradient(135deg, ${CRIMSON_LIGHT}, ${TEAL})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#fff", fontWeight: 700, flexShrink: 0 }}>AG</div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: CRIMSON, marginBottom: 2 }}>User 1</h2>
          <div style={{ fontSize: 14, color: TEAL, fontWeight: 500, marginBottom: 2 }}>Professor and Head of department</div>
          <div style={{ fontSize: 13, color: TEXT_MUTED, marginBottom: 8 }}>Dermatology, Venereology & Leprosy</div>
          <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 6 }}>✉ aayush.gupta@dpu.edu.in</div>
          <div style={{ display: "flex", gap: 8 }}>
            {["ORCID", "LinkedIn", "X"].map(s => (
              <span key={s} style={{ fontSize: 11, background: LIGHT_BG, border: `1px solid ${BORDER}`, padding: "3px 8px", borderRadius: 5, color: TEXT_MUTED, cursor: "pointer" }}>{s}</span>
            ))}
          </div>
        </div>
        <button style={{ border: `1px solid ${BORDER}`, background: "#fff", padding: "8px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>Edit Profile ↗</button>
      </div>

      {/* Overview */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400 }}>Overview</h2>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["Current Year", "Last Year", "Last 3 Years", "Last 5 Years", "All", "Custom"].map((l, i) => (
            <button key={l} style={{ padding: "5px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer", background: l === "All" ? TEAL : "#fff", color: l === "All" ? "#fff" : TEXT, border: `1px solid ${l === "All" ? TEAL : BORDER}` }}>{l}</button>
          ))}
          <span style={{ fontSize: 11, color: TEXT_HINT, paddingTop: 6 }}>Last Updated: 16 Sept 2024</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr 1fr 1fr 1.4fr", gap: 10, marginBottom: 12 }}>
        <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, color: TEXT_MUTED }}>Total Publications/Proceedings</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>85</div>
          <div style={{ fontSize: 11, color: TEXT_HINT }}>0 Retracted</div>
        </div>
        <div style={{ background: CRIMSON, borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Indexed Publications/Proceedings</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginTop: 4 }}>80</div>
        </div>
        <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, color: TEXT_MUTED }}>Impact Factor Average</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>3.05</div>
          <div style={{ fontSize: 11, color: TEXT_HINT }}>Cumulative: 259.2</div>
        </div>
        <div style={{ background: TEAL, borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>1st/Corres. Author Publications</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginTop: 4 }}>56</div>
        </div>
        <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, color: TEXT_MUTED, marginBottom: 8 }}>Research Impact</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
            {[["Policy", 4], ["News", 8], ["Wiki", 8], ["FWCI", "0.58"], ["PE", 59]].map(([l, v]) => (
              <div key={l} style={{ fontSize: 11 }}><span style={{ color: TEXT_HINT }}>{l} </span><span style={{ fontWeight: 600 }}>{v}</span></div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 12, marginBottom: 14, overflow: "hidden" }}>
        <div style={{ display: "flex", borderBottom: `1px solid ${BORDER}` }}>
          {["Publications", "Conferences", "Awards"].map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: "12px 22px", fontSize: 13, fontWeight: 500, cursor: "pointer",
              background: "none", border: "none",
              color: activeTab === t ? CRIMSON : TEXT_MUTED,
              borderBottom: activeTab === t ? `2px solid ${CRIMSON}` : "2px solid transparent"
            }}>{t}</button>
          ))}
        </div>
        <div style={{ padding: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: TEXT_MUTED }}>Publications (showing 1–10 of 15 results)</span>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ padding: "5px 12px", border: `1px solid ${BORDER}`, borderRadius: 6, background: "#fff", fontSize: 12, cursor: "pointer" }}>Sort By ▾</button>
              <button style={{ padding: "5px 12px", border: `1px solid ${BORDER}`, borderRadius: 6, background: "#fff", fontSize: 12, cursor: "pointer" }}>Filter ▾</button>
            </div>
          </div>
          {pubs.map((p) => (
            <div key={p.id} style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px", marginBottom: 10 }}>
              <h4 style={{ fontSize: 13, color: CRIMSON, fontWeight: 600, marginBottom: 5, lineHeight: 1.4 }}>{p.title}</h4>
              <div style={{ fontSize: 11, color: TEXT_MUTED, marginBottom: 3 }}>Authors: {p.authors}</div>
              <div style={{ fontSize: 11, color: TEXT_HINT, marginBottom: 10 }}>{p.journal}</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                <span style={{ background: CRIMSON, color: "#fff", padding: "3px 8px", borderRadius: 5, fontSize: 11 }}>Quartile: {p.q}</span>
                <span style={{ border: `1px solid ${BORDER}`, padding: "3px 8px", borderRadius: 5, fontSize: 11 }}>Impact Factor: {p.if}</span>
                <span style={{ border: `1px solid ${BORDER}`, padding: "3px 8px", borderRadius: 5, fontSize: 11 }}>H-Index: {p.hindex}</span>
                <span style={{ border: `1px solid ${BORDER}`, padding: "3px 8px", borderRadius: 5, fontSize: 11 }}>FWCI: {p.fwci}</span>
                <span style={{ border: `1px solid ${BORDER}`, padding: "3px 8px", borderRadius: 5, fontSize: 11 }}>Publication Equivalent: {p.pe}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ border: `1px solid ${BORDER}`, background: "#fff", padding: "5px 12px", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>View More</button>
                <button style={{ border: `1px solid ${BORDER}`, background: "#fff", padding: "5px 12px", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>Cite</button>
                <button style={{ border: `1px solid ${BORDER}`, background: "#fff", padding: "5px 12px", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>Preview PDF</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
  .userprofile-container {
    position: relative;
    min-height: 100vh;
    width: 100%;
    overflow: hidden;
  }

  .userprofile-content {
    position: relative;
    z-index: 1;
    max-width: 1100px;
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

  /* Responsive Design */
  @media (max-width: 768px) {
    .userprofile-content {
      padding: 16px;
    }
  }
`}</style>
    </div>
  );
};

export default UserProfilePage;