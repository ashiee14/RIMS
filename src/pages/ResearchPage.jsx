import { useState, useEffect, useMemo } from "react";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";
import { fetchProjects } from "../services/api";
// Mock data for development (to be replaced with real API calls)


const {
  crimson: CRIMSON,
  teal: TEAL,
  border: BORDER,
  text: TEXT,
  textMuted: TEXT_MUTED,
  lightBg: LIGHT_BG,
  cardBg: CARD_BG,
} = COLORS;

const DEFAULT_FILTERS = {
  faculty: "",
  dept: "",
  name: "",
  funded: "all",
  fundedBy: "",
  org: "",
  status: "",
};

const ResearchPage = ({ onNav }) => {
  const [timeFilter, setTimeFilter] = useState("All");
  const [rows, setRows] = useState([]);
  const [sidebarFilters, setSidebarFilters] = useState(DEFAULT_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState("date");
  const [sortDirection, setSortDirection] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const sortOptions = [
    { value: "date", label: "Date" },
    { value: "funds", label: "Funds" },
    { value: "faculty", label: "Faculty" },
    { value: "dept", label: "Department" },
    { value: "name", label: "Project Name" },
    { value: "status", label: "Status" },
  ];

  const filteredRows = useMemo(() => {
    const currentYear = new Date().getFullYear();

    const yearRange = {
      "Current Year": [currentYear, currentYear],
      "Last Year": [currentYear - 1, currentYear - 1],
      "Last 3 Years": [currentYear - 2, currentYear],
      "Last 5 Years": [currentYear - 4, currentYear],
      All: [1900, currentYear],
    }[timeFilter] || [1900, currentYear];

    const [minYear, maxYear] = yearRange;

    const normalize = (value) => String(value || "").trim().toLowerCase();
    const matches = (value, filterValue) => {
      if (!filterValue || filterValue === "all") return true;
      return normalize(value).includes(filterValue.trim().toLowerCase());
    };

    return rows
      .filter((row) => {
        if (!row.date) return timeFilter === "All";
        const year = new Date(row.date).getFullYear();
        return year >= minYear && year <= maxYear;
      })
      .filter((row) => {
        return (
          matches(row.faculty, appliedFilters.faculty) &&
          matches(row.dept, appliedFilters.dept) &&
          matches(row.name, appliedFilters.name) &&
          matches(row.fundedBy, appliedFilters.fundedBy) &&
          matches(row.org, appliedFilters.org) &&
          matches(row.status, appliedFilters.status) &&
          (appliedFilters.funded === "all" ||
            (appliedFilters.funded === "Funded" && row.funded) ||
            (appliedFilters.funded === "Not Funded" && !row.funded))
        );
      })
      .sort((a, b) => {
        const direction = sortDirection === "desc" ? -1 : 1;

        if (sortBy === "funds") {
          return direction * (Number(a.funds) - Number(b.funds));
        }

        if (sortBy === "date") {
          const aDate = a.date ? new Date(a.date).getTime() : 0;
          const bDate = b.date ? new Date(b.date).getTime() : 0;
          return direction * (aDate - bDate);
        }

        return direction * a[sortBy].localeCompare(b[sortBy], undefined, {
          sensitivity: "base",
        });
      });
  }, [rows, timeFilter, appliedFilters, sortBy, sortDirection]);

  const handleFilterChange = (key, value) => {
    setSidebarFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    setAppliedFilters(sidebarFilters);
  };

  const clearFilters = () => {
    setSidebarFilters(DEFAULT_FILTERS);
    setAppliedFilters(DEFAULT_FILTERS);
    setTimeFilter("All");
    setSortBy("date");
    setSortDirection("desc");
  };

  // Adds aurora styling to the root
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const apiParams = {};

        if (appliedFilters.name) apiParams.title = appliedFilters.name;
        if (appliedFilters.faculty)
          apiParams["principal_investigator__full_name"] = appliedFilters.faculty;
        if (appliedFilters.dept)
          apiParams["department__name"] = appliedFilters.dept;
        if (appliedFilters.status) apiParams.status = appliedFilters.status;
        if (appliedFilters.funded === "Funded") apiParams.funded = true;
        if (appliedFilters.funded === "Not Funded") apiParams.funded = false;
        if (appliedFilters.fundedBy)
          apiParams["funding_agency__name"] = appliedFilters.fundedBy;
        if (appliedFilters.org)
          apiParams["funding_agency__country"] = appliedFilters.org;

        const orderingField = {
          date: "start_date",
          funds: "amount",
          faculty: "principal_investigator__full_name",
          dept: "department__name",
          name: "title",
          status: "status",
        }[sortBy];

        if (orderingField) {
          apiParams.ordering = `${sortDirection === "desc" ? "-" : ""}${orderingField}`;
        }

        const data = await fetchProjects(apiParams);

        console.log("PROJECT API RESPONSE:", data);

        const projects = Array.isArray(data)
          ? data
          : Array.isArray(data?.results)
          ? data.results
          : [];

        if (!Array.isArray(projects)) {
          console.warn("Invalid API response, using empty array");
          setRows([]);
          return;
        }

        const formatted = projects.map((item, index) => ({
          id: item.id || index + 1,
          faculty: item.principal_investigator?.full_name || "N/A",
          dept: item.department?.name || "N/A",
          name: item.title || "N/A",
          type: "Research",
          duration:
            item.start_date && item.end_date
              ? `${item.start_date} - ${item.end_date}`
              : "--",
          date: item.start_date || "--",
          funded: Number(item.amount) > 0,
          funds: item.amount || 0,
          fundedBy: item.funding_agency?.name || "N/A",
          org: item.funding_agency?.country || "N/A",
          status: item.status || "Unknown",
        }));

        setRows(formatted);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Unable to load research projects.");
        setRows([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [appliedFilters, sortBy, sortDirection]);

 
  return (
    <div className="research-container">
      {/* Aurora Background */}
      <Aurora
        colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
        amplitude={1}
        blend={0.5}
      />

      {/* Page Content */}
      <div className="research-content">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: 28,
              fontWeight: 400,
            }}
          >
            Research Projects
          </h1>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["All", "Current Year", "Last Year", "Last 3 Years", "Last 5 Years"].map((l) => {
              const active = timeFilter === l;
              return (
                <button
                  key={l}
                  onClick={() => setTimeFilter(l)}
                  style={{
                    padding: "9px 16px",
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    background: active ? CRIMSON : "rgba(255,255,255,0.12)",
                    color: active ? "#fff" : "#f5f5f5",
                    border: active ? `1px solid ${CRIMSON}` : `1px solid rgba(255,255,255,0.18)`,
                    boxShadow: active ? "0 8px 20px rgba(160, 39, 124, 0.18)" : "none",
                    outline: "none",
                  }}
                >
                  {l}
                </button>
              );
            })}
          </div>
        </div>

        <div className="research-layout">
          <aside className="sidebar">
            <div className="sidebar-header">
              <span>Filters & Sort</span>
            </div>

            <div className="filter-section">
              <div className="filter-title">Filters</div>
              <label className="filter-label">
                Faculty
                <input
                  value={sidebarFilters.faculty}
                  onChange={(e) => handleFilterChange("faculty", e.target.value)}
                  className="filter-input"
                  placeholder="Search faculty"
                />
              </label>
              <label className="filter-label">
                Department
                <input
                  value={sidebarFilters.dept}
                  onChange={(e) => handleFilterChange("dept", e.target.value)}
                  className="filter-input"
                  placeholder="Search department"
                />
              </label>
              <label className="filter-label">
                Project Name
                <input
                  value={sidebarFilters.name}
                  onChange={(e) => handleFilterChange("name", e.target.value)}
                  className="filter-input"
                  placeholder="Search project title"
                />
              </label>
              <label className="filter-label">
                Funded By
                <input
                  value={sidebarFilters.fundedBy}
                  onChange={(e) => handleFilterChange("fundedBy", e.target.value)}
                  className="filter-input"
                  placeholder="Search agency"
                />
              </label>
              <label className="filter-label">
                Organization
                <input
                  value={sidebarFilters.org}
                  onChange={(e) => handleFilterChange("org", e.target.value)}
                  className="filter-input"
                  placeholder="Search organization"
                />
              </label>
              <label className="filter-label">
                Status
                <input
                  value={sidebarFilters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="filter-input"
                  placeholder="Search status"
                />
              </label>
            </div>

            <div className="filter-section">
              <div className="filter-title">Funded status</div>
              <select
                value={sidebarFilters.funded}
                onChange={(e) => handleFilterChange("funded", e.target.value)}
                className="filter-select"
              >
                <option value="all">All</option>
                <option value="Funded">Funded</option>
                <option value="Not Funded">Not Funded</option>
              </select>
            </div>

            <div className="filter-section">
              <div className="filter-title">Sort by</div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-section">
              <div className="filter-title">Sort direction</div>
              <select
                value={sortDirection}
                onChange={(e) => setSortDirection(e.target.value)}
                className="filter-select"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
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

          <div className="research-main">
            <div className="table-wrapper">
              {loading ? (
                <div className="table-empty">Loading research projects...</div>
              ) : error ? (
                <div className="table-empty">{error}</div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table
                    style={{
                      width: "100%",
                      borderCollapse: "collapse",
                    }}
                  >
                    <thead>
                      <tr style={{ background: CRIMSON }}>
                        {[
                          "Sl. No.",
                          "Name of Faculty",
                          "Department",
                          "Project Name",
                          "Research Type",
                          "Duration",
                          "Dates",
                          "Funded",
                          "Funds (Lakhs)",
                          "Funded By",
                          "Organization Name",
                          "Status",
                          "Actions",
                        ].map((h) => (
                          <th
                            key={h}
                            style={{
                              padding: "12px",
                              color: "#fff",
                              fontSize: 11,
                              fontWeight: 500,
                              textAlign: "left",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRows.map((r) => (
                        <tr
                          key={r.id}
                          style={{ borderBottom: `1px solid ${BORDER}` }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.background = LIGHT_BG)
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.background = "")
                          }
                        >
                          <td
                            style={{
                              padding: "14px 12px",
                              fontSize: 13,
                              textAlign: "center",
                              color: TEXT_MUTED,
                            }}
                          >
                            {r.id}
                          </td>
                          <td
                            style={{
                              padding: "14px 12px",
                              fontSize: 13,
                              fontWeight: 500,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {r.faculty}
                          </td>
                          <td
                            style={{
                              padding: "14px 12px",
                              fontSize: 12,
                              color: TEXT_MUTED,
                              maxWidth: 140,
                            }}
                          >
                            {r.dept}
                          </td>
                          <td
                            style={{
                              padding: "14px 12px",
                              fontSize: 12,
                              maxWidth: 200,
                              lineHeight: 1.5,
                            }}
                          >
                            {r.name}
                          </td>
                          <td style={{ padding: "14px 12px", fontSize: 12 }}>
                            {r.type}
                          </td>
                          <td
                            style={{
                              padding: "14px 12px",
                              fontSize: 12,
                              textAlign: "center",
                              color: TEXT_MUTED,
                            }}
                          >
                            {r.duration}
                          </td>
                          <td
                            style={{
                              padding: "14px 12px",
                              fontSize: 12,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {r.date}
                          </td>
                          <td style={{ padding: "14px 12px" }}>
                            <span
                              style={{
                                fontSize: 12,
                                color: TEAL,
                                fontWeight: 500,
                              }}
                            >
                              {r.funded ? "Funded" : "Not Funded"}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: "14px 12px",
                              fontSize: 12,
                              textAlign: "right",
                            }}
                          >
                            {r.funds}
                          </td>
                          <td style={{ padding: "14px 12px", fontSize: 12 }}>
                            {r.fundedBy}
                          </td>
                          <td
                            style={{
                              padding: "14px 12px",
                              fontSize: 12,
                              maxWidth: 140,
                            }}
                          >
                            {r.org}
                          </td>
                          <td style={{ padding: "14px 12px" }}>
                            <span
                              style={{
                                background: CRIMSON,
                                color: "#fff",
                                padding: "3px 10px",
                                borderRadius: 6,
                                fontSize: 11,
                                fontWeight: 500,
                              }}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td style={{ padding: "14px 12px" }}>
                            <button
                              style={{
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                color: TEXT_MUTED,
                                fontSize: 18,
                              }}
                            >
                              ⋮
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Scoped Styles */}
      <style>{`
        .research-container {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
        }

        .research-content {
          position: relative;
          z-index: 1;
          max-width: 1400px;
          margin: 0 auto;
          padding: clamp(16px, 3vw, 28px);
          color: #ffffff;
        }

        .research-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 22px;
        }

        .research-layout {
          display: flex;
          gap: 24px;
          align-items: stretch;
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
          color: #fff;
          font-size: 13px;
          margin-bottom: 10px;
          display: block;
        }

        .button-group {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .filter-pill {
          border: 1px solid rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.08);
          color: #f5f5f5;
          border-radius: 999px;
          padding: 9px 14px;
          text-align: left;
          cursor: pointer;
          font-size: 12px;
          transition: all 0.15s ease;
        }

        .filter-pill.active {
          background: ${CRIMSON};
          border-color: ${CRIMSON};
          color: #ffffff;
        }

        .filter-label {
          display: block;
          margin-bottom: 12px;
          font-size: 12px;
          color: ${TEXT_MUTED};
        }

        .filter-label input,
        .filter-select {
          width: 100%;
          margin-top: 6px;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid ${BORDER};
          background: rgba(255,255,255,0.08);
          color: #fff;
          font-size: 13px;
          outline: none;
        }

        .filter-select {
          appearance: none;
          -webkit-appearance: none;
          -moz-appearance: none;
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

        .research-main {
          flex: 1;
          min-width: 0;
        }

        .table-wrapper {
          background: ${CARD_BG};
          border: 1px solid ${BORDER};
          border-radius: 16px;
          padding: 18px;
          overflow: hidden;
        }

        .table-empty {
          color: ${TEXT_MUTED};
          padding: 48px 0;
          text-align: center;
        }

        @media (max-width: 1024px) {
          .research-layout {
            flex-direction: column;
          }

          .sidebar {
            width: 100%;
          }
        }

        @media (max-width: 768px) {
          .research-content {
            padding: 16px;
          }

          .filter-pill {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
};

export default ResearchPage;