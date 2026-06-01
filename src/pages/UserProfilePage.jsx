import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Aurora from "../components/Aurora";
import { COLORS} from "../styles/theme";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import {
  previewORCID,
  fetchMyPublications,
  searchPublications,
  fetchPublicationMetrics,
} from "../services/api";

const API_BASE = import.meta.env.VITE_API_URL;

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
  const { id: paramId } = useParams();
  const navigate = useNavigate();
  const { role, linkOrcid } = useAuth();
  const isViewer = role === "viewer";

  const token = localStorage.getItem("access_token");

  let tokenId = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      tokenId = payload.user_id;
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  const id = paramId ? Number(paramId) : tokenId;

  const [activeTab, setActiveTab] = useState("Publications");
  
  const [error, setError] = useState("");
  const [pubs, setPubs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  const [conferences, setConferences] = useState([]);
  const [awards, setAwards] = useState([]);

  const [sortBy, setSortBy] = useState("latest");
  const [filterType, setFilterType] = useState("all");
  const [showOpenAccess, setShowOpenAccess] = useState(false);
  const [ifMin, setIfMin] = useState("");
  const [ifMax, setIfMax] = useState("");
  const [top1Filter, setTop1Filter] = useState(false);
  const [top10Filter, setTop10Filter] = useState(false);
  const [userMetrics, setUserMetrics] = useState(null);
  
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

      fetchedRef.current = false;

      if (id) {
        fetchedRef.current = true;
        fetchProfile();
      } else {
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
      console.log("API URL:", `${API_BASE}/users/${id}/`);

      const userRes = await axios.get(
        `${API_BASE}/users/${id}/`, 
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

      // Render the page immediately after getting profile
      setLoading(false);

      // Fetch secondary data in parallel — failures won't block the page
      const headers = { Authorization: `Bearer ${token}` };
      const isOwnProfile = !paramId || Number(paramId) === tokenId;

      // If viewing another researcher's profile, publications are already in fetchedUser
      if (!isOwnProfile) {
        setPubs(fetchedUser.publications || []);
      }

      const [pubRes, statsRes, , confRes, awardsRes] = await Promise.allSettled([
        isOwnProfile && !isViewer ? fetchMyPublications() : Promise.resolve(null),
        isOwnProfile && !isViewer ? axios.get(`${API_BASE}/publications/stats/`, { headers }) : Promise.resolve(null),
        isOwnProfile && !isViewer ? fetchPublicationMetrics().then(setUserMetrics).catch(() => {}) : Promise.resolve(null),
        axios.get(`${API_BASE}/events/`, { headers }),
        axios.get(`${API_BASE}/awards/`, { headers }),
      ]);

      if (isOwnProfile && pubRes.status === "fulfilled" && pubRes.value != null)
        setPubs(pubRes.value.results || pubRes.value);

      if (statsRes.status === "fulfilled" && statsRes.value != null)
        setStats(statsRes.value.data);

      if (confRes.status === "fulfilled")
        setConferences(confRes.value.data.results || []);

      if (awardsRes.status === "fulfilled")
        setAwards(awardsRes.value.data.results || []);

      if (fetchedUser?.orcid_id) {
        try {
          setOrcidPreview(await previewORCID(fetchedUser.orcid_id));
        } catch (_) {}
      }

    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        setError("You don't have permission to view this profile. Link your ORCID to access full features.");
      } else if (err.response?.status === 401) {
        setError("Session expired. Please log in again.");
      } else {
        setError("Failed to load profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleORCIDLink = async () => {
    try {
      setOrcidLoading(true);
      setOrcidError("");

      if (!orcidInput.trim()) {
        setOrcidError(
          "Please enter an ORCID ID"
        );
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
        err.response?.data?.detail ||
        "Failed to link ORCID"
      );
    } finally {
      setOrcidLoading(false);
    }
  };
  const QUARTILE_COLORS_P = { Q1: "#B22222", Q2: "#1D6B5E", Q3: "#C8941A", Q4: "#4A90D9" };

  const displayedPubs = useMemo(() => {
    let result = [...pubs];
    if (filterType !== "all") {
      result = result.filter((p) =>
        (p.publication_type || "").toLowerCase() === filterType.toLowerCase()
      );
    }
    if (showOpenAccess) result = result.filter((p) => p.is_open_access);
    if (ifMin !== "") result = result.filter((p) => p.impact_factor != null && p.impact_factor >= parseFloat(ifMin));
    if (ifMax !== "") result = result.filter((p) => p.impact_factor != null && p.impact_factor <= parseFloat(ifMax));
    if (top1Filter) result = result.filter((p) => p.in_top_1_percentile);
    else if (top10Filter) result = result.filter((p) => p.in_top_10_percentile);
    if (sortBy === "latest") result.sort((a, b) => (b.year || 0) - (a.year || 0));
    else if (sortBy === "oldest") result.sort((a, b) => (a.year || 0) - (b.year || 0));
    else if (sortBy === "citations") result.sort((a, b) => (b.cited_by_count || 0) - (a.cited_by_count || 0));
    else if (sortBy === "impact_factor") result.sort((a, b) => (b.impact_factor || 0) - (a.impact_factor || 0));
    return result;
  }, [pubs, filterType, showOpenAccess, ifMin, ifMax, top1Filter, top10Filter, sortBy]);

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

  

  // ── Shared style tokens ──────────────────────────────────────
  const glassCard = {
    background: "rgba(255,255,255,0.07)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 14,
    padding: "16px 18px",
  };
  const statLabel = { fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em" };
  const statValue = { fontSize: 30, fontWeight: 700, color: "#fff", lineHeight: 1 };
  const statSub   = { fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4 };
  const selectStyle = {
    padding: "6px 10px", borderRadius: 8, fontSize: 12,
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff", cursor: "pointer", outline: "none",
  };
  const filterBtn = {
    padding: "6px 12px", borderRadius: 8, fontSize: 12,
    border: "1px solid rgba(255,255,255,0.15)",
    background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.7)",
    cursor: "pointer",
  };
  const ifInput = {
    width: 70, padding: "5px 8px", borderRadius: 8, fontSize: 12,
    background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)",
    color: "#fff", outline: "none",
  };
  const badge = { fontSize: 11, color: "#fff", padding: "3px 8px", borderRadius: 5, fontWeight: 600 };
  const badgeGhost = {
    fontSize: 11, padding: "3px 8px", borderRadius: 5,
    background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.7)",
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", color: "#fff" }}>
      <Aurora colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]} amplitude={1} blend={0.5} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>

        {/* ── HERO HEADER ───────────────────────────────── */}
        <div style={{ ...glassCard, padding: "28px 32px", marginBottom: 20, display: "flex", gap: 24, alignItems: "flex-start" }}>
          {/* Avatar */}
          <div style={{
            width: 80, height: 80, borderRadius: 16, flexShrink: 0,
            background: "linear-gradient(135deg, #ff6b81, #5227FF)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, color: "#fff", fontWeight: 700,
            boxShadow: "0 8px 32px rgba(82,39,255,0.4)",
          }}>
            {`${profile?.first_name?.[0] || ""}${profile?.last_name?.[0] || ""}`}
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: "#fff", margin: "0 0 4px" }}>
              {profile?.full_name}
            </h1>
            <div style={{ fontSize: 14, color: "#a78bfa", fontWeight: 500, marginBottom: 4 }}>
              {profile?.designation || "Faculty"}
            </div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 14 }}>
              {profile?.department?.name || "Unknown Department"} · {profile?.institution?.name || "Unknown Institution"}
              {profile?.email && <span style={{ marginLeft: 12 }}>{profile.email}</span>}
            </div>

            {/* Pills */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              {["LinkedIn", "X"].map((s) => (
                <span key={s} style={{
                  fontSize: 11, padding: "4px 12px", borderRadius: 6,
                  background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.65)", cursor: "pointer",
                }}>{s}</span>
              ))}
              <span style={{
                fontSize: 11, padding: "4px 12px", borderRadius: 6, fontWeight: 600,
                background: profile?.orcid_id ? "rgba(22,163,74,0.2)" : "rgba(245,158,11,0.2)",
                border: `1px solid ${profile?.orcid_id ? "rgba(74,222,128,0.4)" : "rgba(251,191,36,0.4)"}`,
                color: profile?.orcid_id ? "#4ade80" : "#fbbf24",
              }}>
                {profile?.orcid_id ? "✓ ORCID Connected" : "ORCID Not Linked"}
              </span>
            </div>

            {profile?.orcid_id && (
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 8 }}>
                ORCID: {profile.orcid_id}
              </div>
            )}

            {orcidPreview && (
              <div style={{
                marginTop: 10, padding: "6px 14px", display: "inline-flex", gap: 20,
                background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8, fontSize: 12, color: "rgba(255,255,255,0.55)",
              }}>
                <span>Name: {orcidPreview.name || "N/A"}</span>
                <span>Works: {orcidPreview.works_count || 0}</span>
              </div>
            )}

            {!profile?.orcid_id && (
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                <input
                  type="text" placeholder="Enter ORCID ID" value={orcidInput}
                  onChange={(e) => setOrcidInput(e.target.value)}
                  style={{ padding: "7px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.08)", color: "#fff", fontSize: 12, minWidth: 200, outline: "none" }}
                />
                <button onClick={handleORCIDLink} disabled={orcidLoading}
                  style={{ background: "#5227FF", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 12 }}>
                  {orcidLoading ? "Linking…" : "Link ORCID"}
                </button>
              </div>
            )}
            {orcidError && <div style={{ fontSize: 12, color: "#f87171", marginTop: 6 }}>{orcidError}</div>}
          </div>

          {/* Edit button */}
          <button onClick={() => console.log("Edit Profile")} style={{
            flexShrink: 0, padding: "8px 18px", borderRadius: 10, fontSize: 13,
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.18)",
            color: "#fff", cursor: "pointer",
          }}>
            Edit Profile ↗
          </button>
        </div>

        {!isViewer && <>
        {/* ── OVERVIEW HEADER ───────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: "rgba(255,255,255,0.8)", margin: 0, letterSpacing: "0.03em", textTransform: "uppercase" }}>
            Overview
          </h2>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            {["Current Year", "Last Year", "Last 3 Years", "Last 5 Years", "All", "Custom"].map((l) => (
              <button key={l} style={{
                padding: "4px 10px", borderRadius: 6, fontSize: 11, cursor: "pointer",
                background: l === "All" ? "#5227FF" : "rgba(255,255,255,0.06)",
                color: l === "All" ? "#fff" : "rgba(255,255,255,0.55)",
                border: l === "All" ? "1px solid #5227FF" : "1px solid rgba(255,255,255,0.1)",
              }}>{l}</button>
            ))}
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginLeft: 4 }}>Last Updated: 16 Sept 2024</span>
          </div>
        </div>

        {/* ── STAT GRID ─────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 12, marginBottom: 20 }}>
          <div style={glassCard}>
            <div style={statLabel}>Total Publications</div>
            <div style={statValue}>{pubs.length}</div>
            <div style={statSub}>0 Retracted</div>
          </div>

          <div style={{ ...glassCard, background: "rgba(82,39,255,0.25)", borderColor: "rgba(82,39,255,0.4)" }}>
            <div style={statLabel}>Indexed Publications</div>
            <div style={statValue}>{stats?.indexed_publications || 0}</div>
          </div>

          <div style={glassCard}>
            <div style={statLabel}>Impact Factor Avg</div>
            <div style={{ ...statValue, fontSize: 26 }}>
              {userMetrics?.avg_impact_factor != null
                ? Number(userMetrics.avg_impact_factor).toFixed(2)
                : stats?.average_impact_factor || "—"}
            </div>
            {userMetrics?.cumulative_impact_factor != null && (
              <div style={statSub}>Cumulative: {Number(userMetrics.cumulative_impact_factor).toFixed(2)}</div>
            )}
          </div>

          <div style={{ ...glassCard, background: "rgba(34,0,168,0.3)", borderColor: "rgba(82,39,255,0.35)" }}>
            <div style={statLabel}>1st / Corr. Author</div>
            <div style={statValue}>{stats?.first_author_publications || 0}</div>
          </div>

          {userMetrics && (
            <div style={{ ...glassCard, background: "rgba(178,34,34,0.25)", borderColor: "rgba(178,34,34,0.4)" }}>
              <div style={statLabel}>Top 1% Publications</div>
              <div style={statValue}>{userMetrics.top_1_percent_count ?? 0}</div>
            </div>
          )}

          {userMetrics && (
            <div style={{ ...glassCard, background: "rgba(232,130,12,0.25)", borderColor: "rgba(232,130,12,0.4)" }}>
              <div style={statLabel}>Top 10% Publications</div>
              <div style={statValue}>{userMetrics.top_10_percent_count ?? 0}</div>
            </div>
          )}

          <div style={glassCard}>
            <div style={statLabel}>Research Impact</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px 4px", marginTop: 6 }}>
              {[
                ["Policy", stats?.policy_mentions || 0],
                ["News",   stats?.news_mentions   || 0],
                ["Wiki",   stats?.wiki_mentions   || 0],
                ["FWCI",   userMetrics?.h_index ?? stats?.fwci ?? 0],
                ["PE",     stats?.patent_citations || 0],
              ].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 1 }}>{l}</div>
                  <div style={{ fontSize: 17, fontWeight: 700, color: "#fff" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TABS ──────────────────────────────────────── */}
        <div style={{ ...glassCard, padding: 0, overflow: "hidden" }}>
          <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0 8px" }}>
            {["Publications", "Conferences", "Awards"].map((t) => (
              <button key={t} onClick={() => setActiveTab(t)} style={{
                padding: "14px 22px", fontSize: 13, fontWeight: 500, cursor: "pointer",
                background: "none", border: "none",
                color: activeTab === t ? "#fff" : "rgba(255,255,255,0.4)",
                borderBottom: activeTab === t ? "2px solid #5227FF" : "2px solid transparent",
                transition: "color 0.15s",
              }}>{t}</button>
            ))}
          </div>

          <div style={{ padding: 20 }}>

            {/* ── PUBLICATIONS ── */}
            {activeTab === "Publications" && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 10, flexWrap: "wrap" }}>
                  <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>
                    {pubs.length} publications
                  </span>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} style={selectStyle}>
                      <option value="latest">Latest</option>
                      <option value="oldest">Oldest</option>
                      <option value="citations">Most Citations</option>
                      <option value="impact_factor">Highest IF</option>
                    </select>
                    <select value={filterType} onChange={(e) => setFilterType(e.target.value)} style={selectStyle}>
                      <option value="all">All Types</option>
                      <option value="Journal">Journal</option>
                      <option value="Conference">Conference</option>
                      <option value="Book Chapter">Book Chapter</option>
                    </select>
                    {[
                      ["Open Access", showOpenAccess, () => setShowOpenAccess(!showOpenAccess), "#5227FF"],
                      ["Top 1%",      top1Filter,     () => { setTop1Filter(!top1Filter); setTop10Filter(false); }, "#B22222"],
                      ["Top 10%",     top10Filter,    () => { setTop10Filter(!top10Filter); setTop1Filter(false); }, "#E8820C"],
                    ].map(([label, active, onClick, color]) => (
                      <button key={label} onClick={onClick} style={{
                        ...filterBtn,
                        background: active ? color : "rgba(255,255,255,0.07)",
                        borderColor: active ? color : "rgba(255,255,255,0.15)",
                        color: active ? "#fff" : "rgba(255,255,255,0.6)",
                      }}>{label}</button>
                    ))}
                  </div>
                  <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>IF:</span>
                    <input type="number" min="0" step="0.1" placeholder="Min" value={ifMin} onChange={(e) => setIfMin(e.target.value)} style={ifInput} />
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>—</span>
                    <input type="number" min="0" step="0.1" placeholder="Max" value={ifMax} onChange={(e) => setIfMax(e.target.value)} style={ifInput} />
                    {(ifMin || ifMax) && (
                      <button onClick={() => { setIfMin(""); setIfMax(""); }} style={filterBtn}>Clear</button>
                    )}
                  </div>
                </div>

                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginBottom: 14 }}>
                  Showing {displayedPubs.length} of {pubs.length}
                </div>

                {displayedPubs.length === 0 && (
                  <div style={{ padding: 36, textAlign: "center", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 12, color: "rgba(255,255,255,0.35)" }}>
                    No publications match the current filters
                  </div>
                )}

                {displayedPubs.map((pub, index) => (
                  <div key={pub.id || index} onClick={() => navigate(`/publications/${pub.id}`)}
                    style={{
                      borderLeft: "3px solid #5227FF",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderLeftColor: "#5227FF",
                      borderLeftWidth: 3,
                      borderRadius: 10, padding: "14px 16px",
                      marginBottom: 10, cursor: "pointer",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
                    onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                  >
                    <h4 style={{ color: "#c4b5fd", marginBottom: 5, fontSize: 14, fontWeight: 600, lineHeight: 1.4, margin: "0 0 5px" }}>
                      {pub.title}
                    </h4>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 10 }}>
                      {pub.journal?.name || "Unknown Journal"} · {pub.year || "N/A"}
                    </div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      <span style={badgeGhost}>{pub.publication_type || "Publication"}</span>
                      {pub.in_top_1_percentile && <span style={{ ...badge, background: "#B22222" }}>Top 1%</span>}
                      {pub.in_top_10_percentile && !pub.in_top_1_percentile && <span style={{ ...badge, background: "#E8820C" }}>Top 10%</span>}
                      {pub.journal?.quartile && <span style={{ ...badge, background: QUARTILE_COLORS_P[pub.journal.quartile] || "#555" }}>{pub.journal.quartile}</span>}
                      {pub.is_open_access && <span style={{ ...badge, background: "rgba(22,163,74,0.25)", color: "#4ade80", border: "1px solid rgba(74,222,128,0.3)" }}>Open Access</span>}
                      {pub.impact_factor != null && <span style={badgeGhost}>IF {Number(pub.impact_factor).toFixed(2)}</span>}
                      {pub.cited_by_count != null && <span style={badgeGhost}>{pub.cited_by_count} citations</span>}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* ── CONFERENCES ── */}
            {activeTab === "Conferences" && (
              <>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 14 }}>
                  {conferences.length} conferences
                </div>
                {conferences.length === 0 && (
                  <div style={{ padding: 36, textAlign: "center", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 12, color: "rgba(255,255,255,0.35)" }}>
                    No conferences found
                  </div>
                )}
                {conferences.map((c, i) => (
                  <div key={c.id || i} style={{ ...glassCard, marginBottom: 10, padding: "14px 16px" }}>
                    <h4 style={{ color: "#c4b5fd", margin: "0 0 6px", fontSize: 14, fontWeight: 600 }}>
                      {c.title || "Conference Event"}
                    </h4>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", display: "flex", gap: 16, flexWrap: "wrap" }}>
                      <span>{c.event_type || "Conference"}</span>
                      <span>{c.location || "N/A"}</span>
                      <span>{c.year || "N/A"}</span>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* ── AWARDS ── */}
            {activeTab === "Awards" && (
              <>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 14 }}>
                  {awards.length} awards
                </div>
                {awards.length === 0 && (
                  <div style={{ padding: 36, textAlign: "center", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: 12, color: "rgba(255,255,255,0.35)" }}>
                    No awards found
                  </div>
                )}
                {awards.map((a, i) => (
                  <div key={a.id || i} style={{ ...glassCard, marginBottom: 10, padding: "14px 16px" }}>
                    <h4 style={{ color: "#c4b5fd", margin: "0 0 6px", fontSize: 14, fontWeight: 600 }}>
                      {a.title || "Award"}
                    </h4>
                    <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", display: "flex", gap: 16, flexWrap: "wrap" }}>
                      <span>{a.organization || "N/A"}</span>
                      <span>{a.year || "N/A"}</span>
                      {a.category && <span>{a.category}</span>}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
        </>}

      </div>
    </div>
  );
};

export default UserProfilePage;