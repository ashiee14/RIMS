import React, { useState, useEffect, useMemo } from "react";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";
import { ChevronDown } from "../components/Navbar";
import { fetchPublications } from "../services/api";
import { useNavigate } from "react-router-dom";
import Pagination from "../components/Pagination";

const {
  crimson: CRIMSON,
  border: BORDER,
  textMuted: TEXT_MUTED,
  textHint: TEXT_HINT,
} = COLORS;

const filters = [
  {
    label: "Year",
    items: [
      "Current Year (1732)",
      "Last Year (1840)",
      "Last 3 Years (4520)",
      "Last 5 Years (5857)",
      "All (7637)",
      "Custom Range",
    ],
  },
  {
    label: "Publication Type",
    items: [
      "All (1732)",
      "Book Chap. (40)",
      "Review (25)",
      "Conf. Paper (39)",
      "Letter (376)",
      "Erratum (0)",
      "Article (327)",
    ],
  },
  {
    label: "Indexed In",
    items: ["Scopus", "PubMed", "Web of Science"],
  },
];

const defaultSelections = {
  Year: ["All (7637)"],
  "Publication Type": ["All (1732)"],
  "Indexed In": [],
};

const QUARTILE_COLORS = {
  Q1: "#B22222",
  Q2: "#1D6B5E",
  Q3: "#C8941A",
  Q4: "#4A90D9",
};

const PublicationsPage = () => {
  const navigate = useNavigate();

  const [pubs, setPubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState(null);
  const [selections, setSelections] = useState(defaultSelections);
  const [appliedSelections, setAppliedSelections] = useState(defaultSelections);
  const [nameQuery, setNameQuery] = useState("");
  const [appliedNameQuery, setAppliedNameQuery] = useState("");

  // API-level filters
  const [ifMin, setIfMin] = useState("");
  const [ifMax, setIfMax] = useState("");
  const [top1, setTop1] = useState(false);
  const [top10, setTop10] = useState(false);
  const [apiParams, setApiParams] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("aurora-root");
    return () => root.classList.remove("aurora-root");
  }, []);

  const handleExport = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/publications/export/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("spreadsheetml")) throw new Error("Invalid file response");
      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "publications.xlsx";
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error("Export failed", err);
      alert("Export failed: " + err.message);
    } finally {
      setExporting(false);
    }
  };

  useEffect(() => {
    const loadPublications = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPublications({ ...apiParams, page: currentPage });
        const publications = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : [];

        setPubs(publications);
        setTotalPages(data?.total_pages || 1);
      } catch (err) {
        console.error(err);
        setError("Failed to load publications");
        setPubs([]);
      } finally {
        setLoading(false);
      }
    };

    loadPublications();
  }, [apiParams, currentPage]);

  const toggleSelection = (group, item) => {
    setSelections((prev) => {
      const current = Array.isArray(prev[group]) ? prev[group] : [];
      const selected = new Set(current);
      if (selected.has(item)) selected.delete(item);
      else selected.add(item);
      return { ...prev, [group]: Array.from(selected) };
    });
  };

  const applyFilters = () => {
    const params = {};
    if (top1) params.in_top_1_percentile = true;
    else if (top10) params.in_top_10_percentile = true;
    if (ifMin !== "") params.impact_factor_gte = parseFloat(ifMin);
    if (ifMax !== "") params.impact_factor_lte = parseFloat(ifMax);
    setApiParams(params);
    setAppliedSelections({ ...selections });
    setAppliedNameQuery(nameQuery.trim());
  };

  const clearFilters = () => {
    setSelections({ ...defaultSelections });
    setAppliedSelections({ ...defaultSelections });
    setNameQuery("");
    setAppliedNameQuery("");
    setIfMin("");
    setIfMax("");
    setTop1(false);
    setTop10(false);
    setApiParams({});
  };

  const activeFilterLabel = (group) => {
    const values = selections[group] || [];
    return values.length === 0 ? "None" : values.join(", ");
  };

  const filteredPubs = useMemo(() => {
    const yearValue = (p) => Number(p.year) || 0;
    const indexedValue = (p) => {
      const value = p.indexed_in || p.indexed || p.indexedIn || "";
      return Array.isArray(value) ? value.map(String).join(" ").toLowerCase() : String(value).toLowerCase();
    };
    const typeValue = (p) => String(p.publication_type || p.type || "").toLowerCase();
    const nameValue = (p) => {
      const names = Array.isArray(p.author_names) ? p.author_names.join(" ") : p.author_names || "";
      return `${names} ${p.title || ""}`.toLowerCase();
    };

    const matchesYear = (p) => {
      const year = yearValue(p);
      const selected = appliedSelections.Year;
      if (!selected.length || selected.includes("All (7637)")) return true;
      if (selected.includes("Custom Range")) return true;
      const currentYear = new Date().getFullYear();
      return selected.some((item) => {
        if (item.startsWith("Current Year")) return year === currentYear;
        if (item.startsWith("Last Year")) return year === currentYear - 1;
        if (item.startsWith("Last 3 Years")) return year >= currentYear - 2 && year <= currentYear;
        if (item.startsWith("Last 5 Years")) return year >= currentYear - 4 && year <= currentYear;
        return false;
      });
    };

    const matchesType = (p) => {
      const selected = appliedSelections["Publication Type"];
      if (!selected.length || selected.includes("All (1732)")) return true;
      return selected.some((item) => typeValue(p).includes(item.split(" (")[0].toLowerCase()));
    };

    const matchesIndexed = (p) => {
      const selected = appliedSelections["Indexed In"];
      if (!selected.length) return true;
      return selected.some((item) => indexedValue(p).includes(item.toLowerCase()));
    };

    const matchesName = (p) => {
      const rawQuery = (appliedNameQuery || nameQuery || "").trim().toLowerCase();
      if (!rawQuery) return true;

      const q = rawQuery.replace(/[^a-z0-9]/g, "");
      const full = nameValue(p).replace(/[^a-z0-9]/g, "");
      if (full.includes(q)) return true;

      const authors = Array.isArray(p.author_names) ? p.author_names : p.author_names ? [p.author_names] : [];
      const authorInitials = authors.map((a) => {
        return String(a).split(/\s+/).filter(Boolean).map((part) => (part[0] || "").toLowerCase()).join("");
      });

      const combinedInitials = authorInitials.join("");
      if (combinedInitials.includes(q)) return true;

      for (const a of authors) {
        const parts = String(a).split(/\s+/).filter(Boolean).map((t) => t.toLowerCase());
        const initials = parts.map((t) => (t[0] || "")).join("");
        if (initials.includes(q)) return true;
        for (const tok of parts) {
          if (tok.startsWith(rawQuery)) return true;
          if (tok.includes(rawQuery)) return true;
        }
      }

      return false;
    };

    return pubs.filter((p) => matchesYear(p) && matchesType(p) && matchesIndexed(p) && matchesName(p));
  }, [pubs, appliedSelections, appliedNameQuery, nameQuery]);


  return (
    <div className="publications-page">
      <Aurora
        colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
        amplitude={1}
        blend={0.5}
      />

      <div className="publications-content">
        <div className="publications-layout">
          <aside className="sidebar">
            <div className="sidebar-header">Filters</div>

            <div className="filter-section">
              <div className="filter-title">
                <span>Search by name</span>
              </div>
              <input
                className="name-search-input"
                type="text"
                value={nameQuery}
                onChange={(e) => setNameQuery(e.target.value)}
                placeholder="Search authors or title"
              />
            </div>

            {filters.map((section) => (
              <div key={section.label} className="filter-section">
                <div className="filter-title">
                  <span>{section.label}</span>
                  <ChevronDown size={12} />
                </div>

                {section.items.map((item) => (
                  <label key={item} className="filter-item">
                    <input
                      type="checkbox"
                      checked={Array.isArray(selections[section.label]) && selections[section.label].includes(item)}
                      onChange={() => toggleSelection(section.label, item)}
                      style={{ accentColor: CRIMSON }}
                    />
                    {item}
                  </label>
                ))}
              </div>
            ))}

            {/* Percentile filter */}
            <div className="filter-section">
              <div className="filter-title">
                <span>Percentile</span>
                <ChevronDown size={12} />
              </div>
              <label className="filter-item">
                <input
                  type="checkbox"
                  checked={top1}
                  onChange={(e) => {
                    setTop1(e.target.checked);
                    if (e.target.checked) setTop10(false);
                  }}
                  style={{ accentColor: CRIMSON }}
                />
                Top 1%
              </label>
              <label className="filter-item">
                <input
                  type="checkbox"
                  checked={top10}
                  onChange={(e) => {
                    setTop10(e.target.checked);
                    if (e.target.checked) setTop1(false);
                  }}
                  style={{ accentColor: CRIMSON }}
                />
                Top 10%
              </label>
            </div>

            {/* Impact Factor range filter */}
            <div className="filter-section">
              <div className="filter-title">
                <span>Impact Factor</span>
                <ChevronDown size={12} />
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <input
                  className="name-search-input"
                  type="number"
                  min="0"
                  step="0.1"
                  value={ifMin}
                  onChange={(e) => setIfMin(e.target.value)}
                  placeholder="Min"
                  style={{ flex: 1, padding: "8px 10px" }}
                />
                <span style={{ color: TEXT_MUTED, fontSize: 12 }}>—</span>
                <input
                  className="name-search-input"
                  type="number"
                  min="0"
                  step="0.1"
                  value={ifMax}
                  onChange={(e) => setIfMax(e.target.value)}
                  placeholder="Max"
                  style={{ flex: 1, padding: "8px 10px" }}
                />
              </div>
            </div>

            <div className="filter-actions">
              <button className="action-button" onClick={applyFilters}>
                Apply filters
              </button>
              <button className="clear-button" onClick={clearFilters}>
                Clear all
              </button>
            </div>
          </aside>

          <main className="content">
            <div className="results-row">
              <div>
                <h1 style={{ margin: 0, fontSize: 28, fontWeight: 400 }}>
                  Publications
                </h1>
                <p style={{ color: TEXT_MUTED, marginTop: 8 }}>
                  {loading
                    ? "Loading publications..."
                    : error
                    ? error
                    : `${filteredPubs.length} publications found`}
                </p>
              </div>
            </div>

            <div className="results-summary">
              <span>Active filters:</span>
              <div className="filter-summary">
                {Object.keys(appliedSelections).map((group) => (
                  <div key={group} className="summary-pill">
                    {group}: {activeFilterLabel(group)}
                  </div>
                ))}
                {appliedNameQuery ? (
                  <div className="summary-pill">Names: {appliedNameQuery}</div>
                ) : null}
                {apiParams.in_top_1_percentile && <div className="summary-pill">Top 1%</div>}
                {apiParams.in_top_10_percentile && <div className="summary-pill">Top 10%</div>}
                {apiParams.impact_factor_gte && <div className="summary-pill">IF ≥ {apiParams.impact_factor_gte}</div>}
                {apiParams.impact_factor_lte && <div className="summary-pill">IF ≤ {apiParams.impact_factor_lte}</div>}
                <div
                  className="summary-pill"
                  onClick={!exporting && !loading ? handleExport : undefined}
                  title="Export to Excel"
                  style={{ cursor: exporting ? "not-allowed" : "pointer", opacity: exporting ? 0.5 : 1 }}
                >
                  {exporting ? "Exporting…" : "⬇ Export"}
                </div>
              </div>
            </div>

            {loading ? (
              <div className="table-empty">Loading publications...</div>
            ) : error ? (
              <div className="table-empty">{error}</div>
            ) : filteredPubs.length === 0 ? (
              <div className="table-empty">No publications match the selected filters.</div>
            ) : (
              filteredPubs.map((p) => (
                <div key={p.id} className="pub-card">
                  {p.is_open_access && (
                    <div className="pdf-badge">PDF Available</div>
                  )}
                  <h3 style={{ color: CRIMSON, margin: 0, paddingRight: p.is_open_access ? 110 : 0 }}>
                    {p.title}
                  </h3>
                  <p style={{ color: TEXT_MUTED, margin: "8px 0" }}>
                    Authors: {p.author_names?.join(", ") || "N/A"}
                  </p>
                  <p style={{ color: TEXT_HINT, margin: 0 }}>
                    {p.journal?.name || "Unknown Journal"} • {p.year}
                  </p>

                  {/* Quality badges */}
                  <div className="pub-badges">
                    {p.in_top_1_percentile && (
                      <span className="badge badge-top1">Top 1%</span>
                    )}
                    {p.in_top_10_percentile && !p.in_top_1_percentile && (
                      <span className="badge badge-top10">Top 10%</span>
                    )}
                    {p.journal?.quartile && (
                      <span
                        className="badge badge-quartile"
                        style={{ background: QUARTILE_COLORS[p.journal.quartile] || "#555" }}
                      >
                        {p.journal.quartile}
                      </span>
                    )}
                  </div>

                  {/* Metrics chips */}
                  {(p.impact_factor != null || p.journal?.hindex != null) && (
                    <div className="pub-metrics">
                      {p.impact_factor != null && (
                        <span className="metric-chip">
                          IF: {Number(p.impact_factor).toFixed(2)}
                        </span>
                      )}
                      {p.journal?.hindex != null && (
                        <span className="metric-chip">
                          Journal H-Index: {p.journal.hindex}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="pub-actions">
                    <button
                      className="view-button"
                      onClick={() => navigate(`/publications/${p.id}`)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => { setCurrentPage(p); window.scrollTo(0, 0); }} />
          </main>
        </div>
      </div>

      <style>{`
        .aurora-page {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
        }
        .publications-page {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
        }
        .aurora-content,
        .publications-content {
          position: relative;
          z-index: 1;
          color: #ffffff;
        }
        .publications-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: clamp(16px, 3vw, 28px);
        }
        .pub-container,
        .publications-layout {
          display: flex;
          gap: 24px;
          align-items: flex-start;
        }
        .sidebar {
          width: 280px;
          padding: 18px;
          background: rgba(255,255,255,0.04);
          border: 1px solid ${BORDER};
          border-radius: 16px;
          overflow: hidden;
        }
        .sidebar-header {
          font-size: 12px;
          font-weight: 700;
          color: ${TEXT_MUTED};
          text-transform: uppercase;
          margin-bottom: 18px;
          letter-spacing: 0.08em;
        }
        .filter-section {
          margin-bottom: 18px;
        }
        .filter-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #fff;
          font-size: 13px;
          margin-bottom: 10px;
        }
        .name-search-input {
          width: 100%;
          box-sizing: border-box;
          padding: 10px 12px;
          background: rgba(255,255,255,0.08);
          border: 1px solid ${BORDER};
          border-radius: 12px;
          color: #fff;
          font-size: 13px;
          outline: none;
        }
        .name-search-input::placeholder {
          color: ${TEXT_HINT};
        }
        .filter-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: ${TEXT_MUTED};
          margin-bottom: 8px;
          cursor: pointer;
        }
        .filter-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 8px;
        }
        .action-button,
        .clear-button {
          flex: 1;
          padding: 10px 16px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.18);
          font-size: 12px;
          cursor: pointer;
          transition: all 0.15s ease;
        }
        .action-button {
          background: ${CRIMSON};
          color: #ffffff;
          border-color: ${CRIMSON};
        }
        .clear-button {
          background: rgba(255,255,255,0.08);
          color: #f5f5f5;
        }
        .content {
          flex: 1;
          min-width: 0;
          overflow-y: auto;
        }
        .results-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
          gap: 16px;
        }
        .results-summary {
          margin-bottom: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          color: ${TEXT_MUTED};
        }
        .filter-summary {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        .summary-pill {
          background: rgba(255,255,255,0.08);
          border: 1px solid ${BORDER};
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 12px;
          color: #fff;
        }
        .results {
          margin-bottom: 18px;
          color: #fff;
        }
        .pub-card {
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 16px;
          padding: 20px;
          margin-bottom: 16px;
          position: relative;
        }
        .pdf-badge {
          position: absolute;
          top: 14px;
          right: 14px;
          background: #1D6B5E;
          color: #fff;
          font-size: 10px;
          padding: 4px 8px;
          border-radius: 0 12px 0 8px;
        }
        .table-empty {
          padding: 48px 0;
          text-align: center;
          color: ${TEXT_MUTED};
        }
        .pub-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 10px;
        }
        .badge {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.04em;
        }
        .badge-top1 { background: #B22222; }
        .badge-top10 { background: #E8820C; }
        .pub-metrics {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }
        .metric-chip {
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 8px;
          padding: 3px 10px;
          font-size: 11px;
          color: #e0e0e0;
        }
        .pub-actions {
          margin-top: 18px;
          display: flex;
          justify-content: flex-end;
        }
        .view-button {
          padding: 10px 18px;
          border-radius: 999px;
          border: none;
          background: #ffffff;
          color: #2200a8;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: 0.2s ease;
        }
        .view-button:hover {
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
};

export default PublicationsPage;
