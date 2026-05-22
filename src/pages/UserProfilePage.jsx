import { useState, useEffect } from "react";
import Aurora from "../components/Aurora";
import { COLORS} from "../styles/theme";
import axios from "axios";
import { useRef } from "react";

const API_BASE = "https://rims-api.prerna.sh";

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


const UserProfilePage = () => {
  const fetchedRef = useRef(false);
  
  const token = localStorage.getItem("access_token");

  let id = null;

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      id = payload.user_id;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  const [activeTab, setActiveTab] = useState("Publications");
  
  const [error, setError] = useState("");
  const [pubs, setPubs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
      const root = document.getElementById("root");
      root.classList.add("aurora-root");

      if (fetchedRef.current) return;

      fetchedRef.current = true;

      if (id) {
        fetchProfile();
      } else {
        console.log("No ID found");
        setLoading(false);
      }

      return () => root.classList.remove("aurora-root");
    }, [id]);
  
  
  const fetchProfile = async () => {
    try {
      setError("");

      if (!id) {
        console.log("No user ID found");
        setLoading(false);
        return;
      }

      // USER PROFILE

      console.log("Fetching user:", id);

      console.log("TOKEN:", token);
      console.log("USER ID:", id);
      console.log("API URL:", `${API_BASE}/api/users/${id}/`);

      const userRes = await axios.get(
        `${API_BASE}/api/users/${id}/`, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const fetchedUser = userRes.data;
      console.log("USER RESPONSE:", fetchedUser);

      if (!fetchedUser) {
        console.log("No profile returned from backend");
        return;
      }

      console.log("PROFILE DATA:", fetchedUser);

      setProfile(fetchedUser);

      // PUBLICATIONS
      if (fetchedUser?.orcid_id) {
        const pubRes = await axios.get(
          `${API_BASE}/api/publications/researcher/${fetchedUser.orcid_id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setPubs(pubRes.data.results || []);

              // PUBLICATION STATS
      const statsRes = await axios.get(
        `${API_BASE}/api/publications/stats/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("STATS RESPONSE:", statsRes.data);

      if (!statsRes.data) {
        console.log("No stats returned");
      }

      setStats(statsRes.data);
      }

    } 
    catch (err) {
      console.log("FULL ERROR:", err);

      if (err.response) {
        console.log("ERROR STATUS:", err.response.status);
        console.log("ERROR DATA:", err.response.data);
      }

      console.error(err);

      setError("Failed to load profile");
    }
  finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: TEXT_MUTED,
          fontSize: 18,
        }}
      >
        Loading profile...
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "CRIMSON",
          fontSize: 18,
        }}
      >
        {error}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
      {/* Profile Header */}
      <Aurora
      colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
      amplitude={1}
      blend={0.5}
      />  
      <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 14, padding: "20px 24px", marginBottom: 20, display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 90, height: 90, borderRadius: 10, background: `linear-gradient(135deg, ${CRIMSON_LIGHT}, ${TEAL})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#fff", fontWeight: 700, flexShrink: 0 }}> {`${profile?.first_name?.[0] || ""}${profile?.last_name?.[0] || ""}`} </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: CRIMSON, marginBottom: 2 }}>{profile?.full_name}</h2>
          <div style={{ fontSize: 14, color: TEAL, fontWeight: 500, marginBottom: 2 }}>{profile?.designation || "Faculty"}</div>
          <div style={{ fontSize: 13, color: "#2200a8", marginBottom: 8 }}>
            {profile?.department?.name || "Unknown Department"},{" "}
            {profile?.institution?.name || "Unknown Institution"}
          </div>
          <div style={{ fontSize: 12, marginBottom: 6, color:"#2200a8"}}>{profile?.email}</div>
          <div style={{ display: "flex", gap: 8, color:"#2200a8" }}>
            {["ORCID", "LinkedIn", "X"].map(s => (
              <span key={s} style={{ fontSize: 11, background: LIGHT_BG, border: `1px solid ${BORDER}`, padding: "3px 8px", borderRadius: 5, color: TEXT_MUTED, cursor: "pointer" }}>{s}</span>
            ))}
          </div>
        </div>
        <button 
          onClick={() => console.log("Edit Profile")}
          style={{ color: "#2200a8", border: `1px solid ${BORDER}`, background: "#fff", padding: "8px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            Edit Profile ↗
          </button>
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10, marginBottom: 12 }}>
        <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, color: TEXT_MUTED }}>Total Publications/Proceedings</div>
          <div style={{ fontSize: 28, fontWeight: 700, marginTop: 4 }}>{pubs.length}</div>
          <div style={{ fontSize: 11, color: TEXT_HINT }}>0 Retracted</div>
        </div>
        <div style={{ background: CRIMSON, borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Indexed Publications/Proceedings</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginTop: 4 }}>
            {stats?.indexed_publications || 0}</div>
        </div>
        <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, color: TEXT_MUTED }}>Impact Factor Average</div>
          <div style={{ fontSize: 22, fontWeight: 700, marginTop: 4 }}>
            {stats?.average_impact_factor || "0.0"}
          </div>
        </div>
        <div style={{ background: TEAL, borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>1st/Corres. Author Publications</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", marginTop: 4 }}>
              {stats?.first_author_publications || 0}
            </div>
        </div>
        <div style={{ background: CARD_BG, border: `1px solid ${BORDER}`, borderRadius: 12, padding: "14px 16px" }}>
          <div style={{ fontSize: 11, color: TEXT_MUTED, marginBottom: 8 }}>Research Impact</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 4 }}>
            {
            [
              ["Policy", stats?.policy_mentions || 0],
              ["News", stats?.news_mentions || 0],
              ["Wiki", stats?.wiki_mentions || 0],
              ["FWCI", stats?.fwci || 0],
              ["PE", stats?.patent_citations || 0]
            ].map(([l, v]) => (
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
            <span style={{ fontSize: 13, color: TEXT_MUTED }}>
              Publications ({pubs.length} results)
            </span>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ padding: "5px 12px", border: `1px solid ${BORDER}`, borderRadius: 6, background: "#fff", fontSize: 12, cursor: "pointer" }}>Sort By ▾</button>
              <button style={{ padding: "5px 12px", border: `1px solid ${BORDER}`, borderRadius: 6, background: "#fff", fontSize: 12, cursor: "pointer" }}>Filter ▾</button>
            </div>
          </div>

          {pubs.length === 0 && (
            <div
              style={{
                padding: "30px",
                textAlign: "center",
                color: TEXT_MUTED,
                border: `1px dashed ${BORDER}`,
                borderRadius: 10,
              }}
            >
              No publications found
            </div>
          )}


          {pubs.map((p) => (
            <div key={p.id || p.title} style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: "14px", marginBottom: 10 }}>
              <h4 style={{ fontSize: 13, color: CRIMSON, fontWeight: 600, marginBottom: 5, lineHeight: 1.4 }}>{p.title}</h4>
              <div style={{ fontSize: 11, color: TEXT_MUTED, marginBottom: 3 }}> Authors: {
                p.author_names?.length
                  ? p.author_names.join(", ")
                  : "Unknown Authors"
              }</div>
              <div style={{ fontSize: 11, color: TEXT_HINT, marginBottom: 10 }}> {p.journal?.name || "Unknown Journal"} • {p.year || "N/A"} </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
                <span
                  style={{
                    background: CRIMSON,
                    color: "#fff",
                    padding: "3px 8px",
                    borderRadius: 5,
                    fontSize: 11,
                  }}
                >
                  {p.publication_type || "Publication"}
                </span>

                <span
                  style={{
                    border: `1px solid ${BORDER}`,
                    padding: "3px 8px",
                    borderRadius: 5,
                    fontSize: 11,
                  }}
                >
                  Citations: {p.cited_by_count || 0}  
                </span>

                {p.is_open_access && (
                  <span
                    style={{
                      border: `1px solid ${BORDER}`,
                      padding: "3px 8px",
                      borderRadius: 5,
                      fontSize: 11,
                    }}
                  >
                    Open Access
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button 
                  onClick={() => console.log("View More")} 
                  style={{ border: `1px solid ${BORDER}`, background: "#fff", padding: "5px 12px", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>
                    View More
                </button>
                <button onClick={() => console.log("Cite")} style={{ border: `1px solid ${BORDER}`, background: "#fff", padding: "5px 12px", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>Cite</button>
                <button onClick={() => console.log("Preview PDF")} style={{ border: `1px solid ${BORDER}`, background: "#fff", padding: "5px 12px", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>Preview PDF</button>
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