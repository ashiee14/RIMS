import { useState, useEffect } from "react";
import Aurora from "../components/Aurora";
import { COLORS} from "../styles/theme";
import axios from "axios";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  previewORCID,
} from "../services/api";
import { fetchMyPublications } from "../services/api";
import { searchPublications } from "../services/api";

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
  const navigate = useNavigate();
  const { role, linkOrcid } = useAuth();
  const isViewer = role === "viewer";

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

  const [selectedPublication, setSelectedPublication] = useState(null);
  const [citationText, setCitationText] = useState("");
  const [conferences, setConferences] = useState([]);
  const [awards, setAwards] = useState([]);

  const [sortBy, setSortBy] = useState("latest");
  const [filterType, setFilterType] = useState("all");
  const [showOpenAccess, setShowOpenAccess] = useState(false);
  
  const [orcidPreview, setOrcidPreview] =
    useState(null);

  const [orcidLoading, setOrcidLoading] =
    useState(false);

  const [orcidError, setOrcidError] =
    useState("");

  const [orcidInput, setOrcidInput] =
    useState("");

  const [searchQuery, setSearchQuery] = useState("");

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
  
      const handleSearch = async () => {
      try {
        const res = await searchPublications(
          searchQuery,
          filterType
        );

        setPubs(res.results || res);
      } catch (err) {
        console.error("Search failed", err);
      }
    };


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

      // PUBLICATIONS — skip for viewers (blocked endpoint)
      if (!isViewer) {
        const pubRes = await fetchMyPublications();
        setPubs(pubRes.results || pubRes);
      }

      
      // PUBLICATION STATS — skip for viewers
      if (!isViewer) {
        const statsRes = await axios.get(
          `${API_BASE}/api/publications/stats/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStats(statsRes.data);
      }

      //CONFEERENCES
      const confRes = await axios.get(
          `${API_BASE}/api/events/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("CONFERENCES:", confRes.data);

        setConferences(confRes.data.results || []);

      //AWARDS
      const awardsRes = await axios.get(
        `${API_BASE}/api/awards/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("AWARDS:", awardsRes.data);

      setAwards(awardsRes.data.results || []);

      // ORCID PREVIEW
        if (fetchedUser?.orcid_id) {
          try {
            const previewData =
              await previewORCID(fetchedUser.orcid_id);

            console.log(
              "ORCID PREVIEW:",
              previewData
            );

            setOrcidPreview(previewData);
          } catch (previewErr) {
            console.log(
              "ORCID preview unavailable",
              previewErr
            );
          }
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

  const handleORCIDLink = async () => {
    try {
      setOrcidLoading(true);
      setOrcidError("");

      if (!orcidInput.trim()) {
        setOrcidError("Please enter an ORCID ID");
        return;
      }

      const response = await linkOrcid(orcidInput.trim());

      if (response.status === "linked") {
        navigate("/dashboard");
      } else if (response.status === "not_found") {
        setOrcidError("Your ORCID is not registered in RIMS. You remain a viewer.");
      }

      setOrcidInput("");

    } catch (err) {
      console.error(err);
      setOrcidError(
        err.response?.data?.detail || "Failed to link ORCID"
      );
    } finally {
      setOrcidLoading(false);
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 10,
              marginTop: 8,
            }}
          >

            {/* Social Pills */}
            <div
              style={{
                display: "flex",
                gap: 8,
                flexWrap: "wrap",
              }}
            >
              {["LinkedIn", "X"].map((s) => (
                <span
                  key={s}
                  style={{
                    fontSize: 11,
                    background: LIGHT_BG,
                    border: `1px solid ${BORDER}`,
                    padding: "3px 8px",
                    borderRadius: 5,
                    color: TEXT_MUTED,
                    cursor: "pointer",
                  }}
                >
                  {s}
                </span>
              ))}

              {/* ORCID STATUS */}
              <span
                style={{
                  fontSize: 11,
                  padding: "3px 8px",
                  borderRadius: 5,
                  background:
                    profile?.orcid_id
                      ? "#16a34a"
                      : "#f59e0b",
                  color: "#fff",
                }}
              >
                {profile?.orcid_id
                  ? `ORCID Connected`
                  : `ORCID Not Linked`}
              </span>
            </div>

            {/* ORCID ID */}
            {profile?.orcid_id && (
              <div
                style={{
                  fontSize: 12,
                  color: "#2200a8",
                }}
              >
                ORCID: {profile.orcid_id}
              </div>
            )}

            {/* ORCID Preview */}
            {orcidPreview && (
              <div
                style={{
                  background: LIGHT_BG,
                  border: `1px solid ${BORDER}`,
                  borderRadius: 8,
                  padding: "10px",
                  fontSize: 12,
                  color: TEXT,
                }}
              >
                <div
                  style={{
                    fontWeight: 600,
                    marginBottom: 4,
                  }}
                >
                  ORCID Preview
                </div>

                <div>
                  Name:{" "}
                  {orcidPreview.name || "N/A"}
                </div>

                <div>
                  Works:{" "}
                  {orcidPreview.works_count || 0}
                </div>
              </div>
            )}

            {/* ORCID Link Form */}
            {!profile?.orcid_id && (
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  flexWrap: "wrap",
                }}
              >
                <input
                  type="text"
                  placeholder="Enter ORCID ID"
                  value={orcidInput}
                  onChange={(e) =>
                    setOrcidInput(e.target.value)
                  }
                  style={{
                    padding: "8px 10px",
                    borderRadius: 6,
                    border: `1px solid ${BORDER}`,
                    fontSize: 12,
                    minWidth: 220,
                  }}
                />

                <button
                  onClick={handleORCIDLink}
                  disabled={orcidLoading}
                  style={{
                    background: TEAL,
                    color: "#fff",
                    border: "none",
                    borderRadius: 6,
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                >
                  {orcidLoading
                    ? "Linking..."
                    : "Link ORCID"}
                </button>
              </div>
            )}

            {/* Error */}
            {orcidError && (
              <div
                style={{
                  color: "red",
                  fontSize: 12,
                }}
              >
                {orcidError}
              </div>
            )}
          </div>
        </div>
        <button 
          onClick={() => console.log("Edit Profile")}
          style={{ color: "#2200a8", border: `1px solid ${BORDER}`, background: "#fff", padding: "8px 14px", borderRadius: 8, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            Edit Profile ↗
          </button>
      </div>

      {!isViewer && <>
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

          {/* PUBLICATIONS TAB */}
          {activeTab === "Publications" && (
            <>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 12,
                  gap: 10,
                  flexWrap: "wrap",
                }}
              >
                
                <span
                  style={{
                    fontSize: 13,
                    color: TEXT_MUTED,
                  }}
                >
                  Publications ({pubs.length} results)
                </span>

                {/* your existing sort/filter UI stays here */}
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <select
                    value={sortBy}
                    onChange={(e) =>
                      setSortBy(e.target.value)
                    }
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: `1px solid ${BORDER}`,
                    }}
                  >
                    <option value="latest">
                      Latest
                    </option>

                    <option value="oldest">
                      Oldest
                    </option>

                    <option value="citations">
                      Most Citations
                    </option>
                  </select>

                  <select
                    value={filterType}
                    onChange={(e) =>
                      setFilterType(e.target.value)
                    }
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: `1px solid ${BORDER}`,
                    }}
                  >
                    <option value="all">
                      All Types
                    </option>

                    <option value="Journal">
                      Journal
                    </option>

                    <option value="Conference">
                      Conference
                    </option>

                    <option value="Book Chapter">
                      Book Chapter
                    </option>
                  </select>

                  <button
                    onClick={() =>
                      setShowOpenAccess(
                        !showOpenAccess
                      )
                    }
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: `1px solid ${BORDER}`,
                      background: showOpenAccess
                        ? TEAL
                        : "#fff",
                      color: showOpenAccess
                        ? "#fff"
                        : TEXT,
                      cursor: "pointer",
                    }}
                  >
                    Open Access
                  </button>
                </div>
              </div>

              {/* your existing publications rendering stays here */}
              {pubs.length === 0 && (
                  <div
                    style={{
                      padding: 30,
                      textAlign: "center",
                      border: `1px dashed ${BORDER}`,
                      borderRadius: 10,
                      color: TEXT_MUTED,
                    }}
                  >
                    No publications found
                  </div>
                )}

                {pubs.map((pub, index) => (
                  <div
                    key={pub.id || index}
                    style={{
                      border: `1px solid ${BORDER}`,
                      borderRadius: 10,
                      padding: 14,
                      marginBottom: 10,
                      background: CARD_BG,
                      cursor: "pointer",
                    }}
                    onClick={() =>
                      setSelectedPublication(pub)
                    }
                  >
                    <h4
                      style={{
                        color: CRIMSON,
                        marginBottom: 8,
                      }}
                    >
                      {pub.title}
                    </h4>

                    <div
                      style={{
                        fontSize: 12,
                        color: TEXT_MUTED,
                        marginBottom: 6,
                      }}
                    >
                      {pub.journal?.name || "Unknown Journal"}
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: TEXT_MUTED,
                        marginBottom: 6,
                      }}
                    >
                      Year: {pub.year || "N/A"}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 11,
                          background: LIGHT_BG,
                          border: `1px solid ${BORDER}`,
                          padding: "3px 8px",
                          borderRadius: 5,
                        }}
                      >
                        {pub.publication_type || "Publication"}
                      </span>

                      {pub.is_open_access && (
                        <span
                          style={{
                            fontSize: 11,
                            background: "#dcfce7",
                            color: "#166534",
                            padding: "3px 8px",
                            borderRadius: 5,
                          }}
                        >
                          Open Access
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </>
          )}

          {/* CONFERENCES TAB */}
          {activeTab === "Conferences" && (
            <>
              <div
                style={{
                  fontSize: 13,
                  color: TEXT_MUTED,
                  marginBottom: 14,
                }}
              >
                Conferences ({conferences.length} results)
              </div>

              {conferences.length === 0 && (
                <div
                  style={{
                    padding: 30,
                    textAlign: "center",
                    border: `1px dashed ${BORDER}`,
                    borderRadius: 10,
                    color: TEXT_MUTED,
                  }}
                >
                  No conferences found
                </div>
              )}

              {conferences.map((c, index) => (
                <div
                  key={c.id || index}
                  style={{
                    border: `1px solid ${BORDER}`,
                    borderRadius: 10,
                    padding: 14,
                    marginBottom: 10,
                  }}
                >
                  <h4
                    style={{
                      color: CRIMSON,
                      marginBottom: 8,
                    }}
                  >
                    {c.title || "Conference Event"}
                  </h4>

                  <div
                    style={{
                      fontSize: 12,
                      color: TEXT_MUTED,
                      marginBottom: 6,
                    }}
                  >
                    Type: {c.event_type || "Conference"}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: TEXT_MUTED,
                      marginBottom: 6,
                    }}
                  >
                    Venue: {c.location || "N/A"}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: TEXT_MUTED,
                    }}
                  >
                    Year: {c.year || "N/A"}
                  </div>
                </div>
              ))}
            </>
          )}

          {/* AWARDS TAB */}
          {activeTab === "Awards" && (
            <>
              <div
                style={{
                  fontSize: 13,
                  color: TEXT_MUTED,
                  marginBottom: 14,
                }}
              >
                Awards ({awards.length} results)
              </div>

              {awards.length === 0 && (
                <div
                  style={{
                    padding: 30,
                    textAlign: "center",
                    border: `1px dashed ${BORDER}`,
                    borderRadius: 10,
                    color: TEXT_MUTED,
                  }}
                >
                  No awards found
                </div>
              )}

              {awards.map((a, index) => (
                <div
                  key={a.id || index}
                  style={{
                    border: `1px solid ${BORDER}`,
                    borderRadius: 10,
                    padding: 14,
                    marginBottom: 10,
                    background: CARD_BG,
                  }}
                >
                  <h4
                    style={{
                      color: CRIMSON,
                      marginBottom: 8,
                    }}
                  >
                    {a.title || "Award"}
                  </h4>

                  <div
                    style={{
                      fontSize: 12,
                      color: TEXT_MUTED,
                      marginBottom: 6,
                    }}
                  >
                    Organization: {a.organization || "N/A"}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: TEXT_MUTED,
                      marginBottom: 6,
                    }}
                  >
                    Year: {a.year || "N/A"}
                  </div>

                  <div
                    style={{
                      fontSize: 12,
                      color: TEXT_MUTED,
                    }}
                  >
                    Category: {a.category || "N/A"}
                  </div>
                </div>
              ))}
            </>
          )}
      </div>
      </div>

        {citationText && (
          <div
            onClick={() => setCitationText("")}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
              padding: 20,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "100%",
                maxWidth: 600,
                background: CARD_BG,
                borderRadius: 14,
                padding: 24,
                border: `1px solid ${BORDER}`,
              }}
            >
              <h2
                style={{
                  color: CRIMSON,
                  marginBottom: 16,
                }}
              >
                Citation (APA)
              </h2>

              <div
                style={{
                  lineHeight: 1.7,
                  marginBottom: 18,
                  color: TEXT_MUTED,
                }}
              >
                {citationText}
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    citationText
                  );

                  alert("Citation copied!");
                }}
                style={{
                  background: CRIMSON,
                  color: "#fff",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                Copy Citation
              </button>
            </div>
          </div>
        )}

        {selectedPublication && (
        <div
          onClick={() => setSelectedPublication(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: 700,
              maxHeight: "85vh",
              overflowY: "auto",
              background: CARD_BG,
              borderRadius: 14,
              padding: 24,
              border: `1px solid ${BORDER}`,
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 18,
              }}
            >
              <h2
                style={{
                  color: CRIMSON,
                  fontSize: 20,
                  margin: 0,
                  lineHeight: 1.4,
                }}
              >
                {selectedPublication.title}
              </h2>

              <button
                onClick={() => setSelectedPublication(null)}
                style={{
                  border: "none",
                  background: "transparent",
                  fontSize: 22,
                  cursor: "pointer",
                }}
              >
                ×
              </button>
            </div>

            {/* Authors */}
            <div style={{ marginBottom: 14 }}>
              <strong>Authors:</strong>{" "}
              {selectedPublication.author_names?.join(", ") ||
                "Unknown"}
            </div>

            {/* Journal */}
            <div style={{ marginBottom: 10 }}>
              <strong>Journal:</strong>{" "}
              {selectedPublication.journal?.name || "N/A"}
            </div>

            {/* Publication Type */}
            <div style={{ marginBottom: 10 }}>
              <strong>Type:</strong>{" "}
              {selectedPublication.publication_type || "N/A"}
            </div>

            {/* Year */}
            <div style={{ marginBottom: 10 }}>
              <strong>Year:</strong>{" "}
              {selectedPublication.year || "N/A"}
            </div>

            {/* DOI */}
            <div style={{ marginBottom: 10 }}>
              <strong>DOI:</strong>{" "}
              {selectedPublication.doi || "N/A"}
            </div>

            {/* ISSN */}
            <div style={{ marginBottom: 10 }}>
              <strong>ISSN:</strong>{" "}
              {selectedPublication.issn || "N/A"}
            </div>

            {/* Publisher */}
            <div style={{ marginBottom: 10 }}>
              <strong>Publisher:</strong>{" "}
              {selectedPublication.publisher || "N/A"}
            </div>

            {/* Citations */}
            <div style={{ marginBottom: 10 }}>
              <strong>Citations:</strong>{" "}
              {selectedPublication.cited_by_count || 0}
            </div>

            {/* Open Access */}
            <div style={{ marginBottom: 18 }}>
              <strong>Open Access:</strong>{" "}
              {selectedPublication.is_open_access
                ? "Yes"
                : "No"}
            </div>

            {/* Keywords */}
            <div style={{ marginBottom: 18 }}>
              <strong>Keywords:</strong>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginTop: 8,
                }}
              >
                {selectedPublication.keywords?.length ? (
                  selectedPublication.keywords.map((k) => (
                    <span
                      key={k}
                      style={{
                        padding: "4px 10px",
                        borderRadius: 20,
                        background: LIGHT_BG,
                        border: `1px solid ${BORDER}`,
                        fontSize: 11,
                      }}
                    >
                      {k}
                    </span>
                  ))
                ) : (
                  <span>No keywords</span>
                )}
              </div>
            </div>

            {/* Abstract */}
            <div>
              <strong>Abstract</strong>

              <div
                style={{
                  marginTop: 10,
                  lineHeight: 1.7,
                  fontSize: 14,
                  color: TEXT_MUTED,
                }}
              >
                {selectedPublication.abstract ||
                  "No abstract available"}
              </div>
            </div>
          </div>
        </div>
      )}



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
      </>}
    </div>
  );
};

export default UserProfilePage;