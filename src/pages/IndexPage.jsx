import { useEffect, useState } from "react";
import Aurora from "../components/Aurora";
import { COLORS, FONT, RADIUS } from "../styles/theme";
import { useFetch } from "../hooks/useFetch";
import { useNavigate } from "react-router-dom";

import {
  StatCard,
  LoadingSpinner,
  ErrorBanner,
} from "../components/UI";

import {
  DonutChart,
  DonutLegend,
  TrendChart,
} from "../components/Charts";

import {
  getOverviewStats,
  getQuartileData,
  getSDGData,
  getPublicationTrend,
  getCitationTotals,
  getColleges,
  fetchCollegeDashboard,
  fetchTotalUsers,
  fetchPublicationMetricsAll,
  fetchPublications,
} from "../services/api";


/* ────────────────────────────────────────────────────────────────
   Glassmorphism Style
──────────────────────────────────────────────────────────────── */
const glassCard = {
  background: "rgba(255, 255, 255, 0.12)",
  backdropFilter: "blur(14px)",
  WebkitBackdropFilter: "blur(14px)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
  borderRadius: RADIUS.lg,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
  padding: "14px 16px",
};

/* ────────────────────────────────────────────────────────────────
   Top Stats Row
──────────────────────────────────────────────────────────────── */
function TopStatsRow({ stats, totalUsers }) {
  if (!stats) return null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 12,
        marginBottom: 14,
      }}
    >
      <div style={glassCard}>
        <div style={{ fontSize: 18, color: "#eaeaea", marginTop: 12 }}>
          Total Indexed Publications
        </div>
        <StatCard
          
          label="Total Publications/Proceedings"
          value={stats.totalPublications.toLocaleString()}
          sub={`↑ ${stats.retracted} Retracted`}
        />
      </div>

      <div style={glassCard}>
        <div style={{ fontSize: 18, color: "#eaeaea", marginTop: 12 }}>
          Total Registered Users
        </div>

        <div
          style={{
            fontSize: 28,
            fontWeight: 700,
            color: "#fff",
            marginTop: 18,
            marginBottom: 12,
          }}
        >
          {totalUsers ?? 0}
        </div>
      </div>


      {/* Impact Factor */}
      <div style={glassCard}>
        <div style={{ fontSize: 18, color: "#eaeaea" }}>
          Impact Factor
        </div>
        <div style={{ fontSize: 12, color: "#ddd" }}>Average</div>
        <div
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          {stats.impactFactor.average}
        </div>
        <div style={{ fontSize: 11, color: "#ddd" }}>
          Cumulative:{" "}
          {stats.impactFactor.cumulative.toLocaleString()}
        </div>
      </div>

    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Indexed Section
──────────────────────────────────────────────────────────────── */
function IndexedRow({ stats }) {
  if (!stats) return null;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, minmax(220px, 1fr))",
        gap: 12,
        marginBottom: 14,
      }}
    >
      {/* Indexed In */}
      <div style={glassCard}>
        <div style={{ fontSize: 18, color: "#fff", marginBottom: 10 }}>
          Indexed in
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 8,
          }}
        >
          {stats.indexedIn.map(({ label, value, color }) => (
            <div
              key={label}
              style={{
                textAlign: "center",
                padding: "10px 6px",
                borderRadius: RADIUS.md,
                background: "rgba(255,255,255,0.2)",
              }}
            >
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color,
                }}
              >
                {value.toLocaleString()}
              </div>
              <div style={{ fontSize: 11, color: "#fff" }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* h-Index & i10-Index */}
      <div style={glassCard}>
        <div style={{ display: "grid",
            gridTemplateColumns: "repeat(2  , 1fr)",
            gap: 8, }}>
              <div style={{ fontSize: 18, color: "#fff", marginBottom: 10 }}>
          <IndexBlock label="h-Index" items={stats.hIndex} />
          </div>
          <div style={{ fontSize: 18, color: "#fff", marginBottom: 10 }}>
          <IndexBlock label="i10-Index" items={stats.i10Index} />
          </div>
        </div>
      </div>

      {/* Percentiles */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <PercentileCard
          label="Top 1 Percentile"
          value={stats.top1Percentile}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <PercentileCard
          label="Top 10 Percentile"
          value={stats.top10Percentile}
        />
      </div>
    </div>
  );
}

function IndexBlock({ label, items }) {
  return (
    <>
      <div style={{ fontSize: 18, color: "#fff", marginBottom: 6 }}>
        {label}
      </div>
      <div style={{ display: "flex", gap: 10 }}>
        {items.map(({ label: l, value }) => (
          <div
            key={l}
            style={{
              flex: 1,
              textAlign: "center",
              padding: "6px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: RADIUS.sm,
            }}
          >
            <div style={{ fontWeight: 700, color: "#fff" }}>
              {value}
            </div>
            <div style={{ fontSize: 10, color: "#eee" }}>
              {l}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function PercentileCard({ label, value }) {
  return (
    <div style={{ ...glassCard, textAlign: "center" }}>
      <div style={{ fontSize: 18, color: "#eee" }}>{label}</div>
      <div
        style={{
          fontSize: 26,
          fontWeight: 700,
          color: "#fff",
        }}
      >
        {value}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Charts Section
──────────────────────────────────────────────────────────────── */
function ChartsRow({
  trendData,
  citationTotals,
  quartileData,
  sdgData,
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr minmax(200px, 0.45fr)",
        gap: 12,
        marginBottom: 14,
      }}
    >
      {/* Trend Chart */}
      <div style={glassCard}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <span style={{ fontSize: 18, color: "#eaeaea", marginTop: 12, justifyContent: "center", display: "flex" }}>
            Publication Trends
          </span>
        </div>
        <TrendChart data={trendData} />
      </div>

      {/* Donut & SDG */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={glassCard}>
          <div
            style={{
              textAlign: "center",
              fontWeight: 600,
              color: "#fff",
              marginBottom: 10,
            }}
          >
            Quartiles
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <DonutChart data={quartileData} size={100} />
            <DonutLegend data={quartileData} />
          </div>
        </div>

        <div style={glassCard}>
          <div style={{ color: "#fff", marginBottom: 8 }}>
            Sustainable Development Goals
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 6,
            }}
          >
            {sdgData.map((d) => (
              <div
                key={d.label}
                style={{
                  background: d.color,
                  borderRadius: RADIUS.md,
                  padding: "8px",
                  color: "#fff",
                }}
              >
                <strong>{d.count}</strong>
                <div style={{ fontSize: 10 }}>{d.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Shared table styles
──────────────────────────────────────────────────────────────── */
const QUARTILE_COLORS = { Q1: "#B22222", Q2: "#1D6B5E", Q3: "#C8941A", Q4: "#4A90D9" };

const TH = {
  padding: "12px 16px",
  color: "#fff",
  fontSize: 12,
  fontWeight: 700,
  textAlign: "left",
  letterSpacing: "0.04em",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
  borderBottom: "2px solid rgba(255,255,255,0.15)",
};

const TD = {
  padding: "13px 16px",
  fontSize: 13,
  color: "rgba(255,255,255,0.88)",
  borderBottom: "1px solid rgba(255,255,255,0.06)",
  verticalAlign: "middle",
};

const tableCard = {
  ...glassCard,
  padding: 0,
  overflow: "hidden",
};

/* ────────────────────────────────────────────────────────────────
   Top Researchers Table
──────────────────────────────────────────────────────────────── */
function TopResearchersSection({ researchers, onRowClick }) {
  if (!researchers?.length) return null;

  return (
    <div style={tableCard}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(180,0,0,0.85)" }}>
              {["#", "Researcher", "H-Index", "Publications", "Citations"].map((h) => (
                <th key={h} style={TH}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {researchers.map((r, i) => (
              <tr
                key={r.user_id}
                onClick={() => onRowClick && onRowClick(r.user_id)}
                style={{ cursor: onRowClick ? "pointer" : "default", transition: "background 0.15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 1 ? "rgba(255,255,255,0.02)" : "transparent")}
              >
                <td style={{ ...TD, color: "rgba(255,255,255,0.35)", width: 36, fontWeight: 600 }}>
                  {i + 1}
                </td>
                <td style={{ ...TD, fontWeight: 600, color: "#fff" }}>{r.name}</td>
                <td style={{ ...TD, textAlign: "center" }}>
                  <span style={{
                    display: "inline-block",
                    background: "rgba(178,34,34,0.35)",
                    border: "1px solid rgba(178,34,34,0.6)",
                    color: "#ff9999",
                    borderRadius: 6,
                    padding: "3px 12px",
                    fontWeight: 700,
                    fontSize: 13,
                  }}>
                    {r.h_index ?? 0}
                  </span>
                </td>
                <td style={TD}>{r.total_publications ?? 0}</td>
                <td style={TD}>{(r.total_citations ?? 0).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Top Publications Table
──────────────────────────────────────────────────────────────── */
function TopPublicationsTable({ pubs, loading, onRowClick }) {
  if (loading) {
    return (
      <div style={{ ...glassCard, color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
        Loading top publications…
      </div>
    );
  }

  if (!pubs.length) {
    return (
      <div style={{ ...glassCard, color: "rgba(255,255,255,0.5)", fontSize: 13 }}>
        No publications data available yet.
      </div>
    );
  }

  return (
    <div style={tableCard}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "rgba(180,0,0,0.85)" }}>
              {["#", "Title", "Journal", "Year", "Impact Factor", "Citations", "Quartile"].map((h) => (
                <th key={h} style={TH}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pubs.map((p, i) => (
              <tr
                key={p.id}
                onClick={() => onRowClick(p.id)}
                style={{
                  cursor: "pointer",
                  background: i % 2 === 1 ? "rgba(255,255,255,0.02)" : "transparent",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = i % 2 === 1 ? "rgba(255,255,255,0.02)" : "transparent")}
              >
                <td style={{ ...TD, color: "rgba(255,255,255,0.35)", width: 36, fontWeight: 600 }}>
                  {i + 1}
                </td>
                <td style={{ ...TD, maxWidth: 340 }}>
                  <div style={{ lineHeight: 1.4, wordBreak: "break-word" }}>{p.title}</div>
                </td>
                <td style={{ ...TD, maxWidth: 180, color: "rgba(255,255,255,0.65)" }}>
                  <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}>
                    {p.journal?.name || "—"}
                  </div>
                </td>
                <td style={{ ...TD, whiteSpace: "nowrap", color: "rgba(255,255,255,0.65)" }}>
                  {p.year}
                </td>
                <td style={{ ...TD, whiteSpace: "nowrap", fontWeight: 600, color: "#fff" }}>
                  {p.impact_factor != null ? Number(p.impact_factor).toFixed(2) : "—"}
                </td>
                <td style={{ ...TD, whiteSpace: "nowrap" }}>
                  {(p.cited_by_count ?? 0).toLocaleString()}
                </td>
                <td style={TD}>
                  {p.journal?.quartile ? (
                    <span style={{
                      background: QUARTILE_COLORS[p.journal.quartile] || "#555",
                      color: "#fff",
                      borderRadius: 6,
                      padding: "3px 10px",
                      fontSize: 11,
                      fontWeight: 700,
                      letterSpacing: "0.03em",
                    }}>
                      {p.journal.quartile}
                    </span>
                  ) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Institutional Table
──────────────────────────────────────────────────────────────── */
function InstitutionalTable({ colleges }) {
   
}

/* ────────────────────────────────────────────────────────────────
   Main Index Page
──────────────────────────────────────────────────────────────── */
export default function IndexPage() {
  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("home-root");
    return () => root.classList.remove("home-root");
  }, []);

  const navigate = useNavigate();

  const {
    data: dashboardData,
    loading: dashboardLoading,
    error: dashboardError,
  } = useFetch(fetchCollegeDashboard);
    
  useEffect(() => {
    if (dashboardData) {
      console.log(
        "REAL DASHBOARD RESPONSE:",
        dashboardData
      );
    }
  }, [dashboardData]);

  const { data: stats } =
    useFetch(getOverviewStats);

  const { data: quartile } =
    useFetch(getQuartileData);

  const { data: sdg } =
    useFetch(getSDGData);

  const { data: trend } =
    useFetch(getPublicationTrend);

  const { data: citations } =
    useFetch(getCitationTotals);

  const { data: totalUsers } =
    useFetch(fetchTotalUsers);

  const {
    data: colleges,
    loading: collegesLoading,
    error: collegesError,
  } = useFetch(getColleges);

  const { data: metricsData } = useFetch(fetchPublicationMetricsAll);

  const [topPubs, setTopPubs] = useState([]);
  const [topPubsLoading, setTopPubsLoading] = useState(true);

  useEffect(() => {
    fetchPublications({ ordering: "-cited_by_count", page_size: 10 })
      .then((data) => {
        const results = Array.isArray(data) ? data : (data?.results || []);
        setTopPubs(results);
      })
      .catch(() => {})
      .finally(() => setTopPubsLoading(false));
  }, []);

  const anyLoading =  dashboardLoading ||  collegesLoading;

  const anyError =  dashboardError ||  collegesError;

  
  const realStats = dashboardData
  ? {
      totalPublications:
        dashboardData.publications?.total || 0,

      indexedPublications:
        dashboardData.publications?.total || 0,

      retracted: 0,

      impactFactor: {
        average: metricsData?.avg_impact_factor != null
          ? Number(metricsData.avg_impact_factor).toFixed(2)
          : "—",
        cumulative: metricsData?.cumulative_impact_factor != null
          ? Number(metricsData.cumulative_impact_factor).toFixed(2)
          : "—",
      },

      researchImpact: {
        policy: 0,
        news:
          dashboardData.publications
            ?.total_citations || 0,
        wiki: 0,
        fwci: 0,
        pe: 0,
      },

      indexedIn: [
        {
          label: "Scopus",
          value:
            dashboardData.publications?.total || 0,
          color: "#E8820C",
        },
        {
          label: "Books",
          value:
            dashboardData.books?.total_books || 0,
          color: "#2563EB",
        },
        {
          label: "Projects",
          value:
            dashboardData.projects?.total || 0,
          color: "#C8941A",
        },
      ],

      hIndex: [
        {
          label: "h-index",
          value:
            metricsData?.h_index ??
            dashboardData.research_indices?.h_index ??
            0,
        },
      ],

      i10Index: [
        {
          label: "i10-index",
          value:
            metricsData?.i10_index ??
            dashboardData.research_indices?.i10_index ??
            0,
        },
      ],

      top1Percentile:
        metricsData?.top_1_percent_count ?? dashboardData.awards?.total ?? 0,

      top10Percentile:
        metricsData?.top_10_percent_count ?? dashboardData.ipr?.granted ?? 0,
    }
  : null;

  const realQuartileData = dashboardData
  ? [
      {
        label: "Q1",
        value:
          dashboardData.publications
            ?.by_quartile?.Q1 || 0,
        color: "#B22222",
      },
      {
        label: "Q2",
        value:
          dashboardData.publications
            ?.by_quartile?.Q2 || 0,
        color: "#1D6B5E",
      },
      {
        label: "Q3",
        value:
          dashboardData.publications
            ?.by_quartile?.Q3 || 0,
        color: "#C8941A",
      },
      {
        label: "Q4",
        value:
          dashboardData.publications
            ?.by_quartile?.Q4 || 0,
        color: "#4A90D9",
      },
      {
        label: "None",
        value:
          dashboardData.publications
            ?.by_quartile?.unranked || 0,
        color: "#888888",
      },
    ]
  : [];

  const realTrendData =
  dashboardData?.publications?.by_year || [];

  const realCitationTotals = dashboardData
  ? {
      crossref:
        dashboardData.publications
          ?.total_citations || 0,

      scopus:
        dashboardData.publications
          ?.total_citations || 0,
    }
  : null;


  if (anyLoading) return <LoadingSpinner />;
  if (anyError) return <ErrorBanner message={anyError} />;

  return (
    <div className="index-container">
      <Aurora
        colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
        amplitude={1}
        blend={0.5}
      />

      <div className="index-content">
        <h1
          style={{
            fontFamily: FONT.serif,
            fontSize: "clamp(24px, 3vw, 34px)",
            fontWeight: 400,
            marginBottom: 22,
            color: "#ffffff",
          }}
        >
          Overview
        </h1>

        <TopStatsRow stats={realStats || stats} totalUsers={totalUsers}/>
        <IndexedRow stats={realStats || stats} />
        <ChartsRow
          trendData={
            realTrendData.length
              ? realTrendData
              : trend
          }
          citationTotals={
            realCitationTotals || citations
          }
          quartileData={
            realQuartileData.length
              ? realQuartileData
              : quartile
          }
          sdgData={sdg}
        />

        {dashboardData?.top_researchers?.length > 0 && (
          <>
            <h2
              style={{
                fontFamily: FONT.serif,
                fontSize: "22px",
                color: "#fff",
                margin: "20px 0 10px",
              }}
            >
              Top Researchers by H-Index
            </h2>
            <TopResearchersSection
              researchers={dashboardData.top_researchers}
              onRowClick={(userId) => navigate(`/users/${userId}`)}
            />
          </>
        )}

        <h2
          style={{
            fontFamily: FONT.serif,
            fontSize: "22px",
            color: "#fff",
            margin: "20px 0 10px",
          }}
        >
          Top Publications by Citations
        </h2>
        <TopPublicationsTable
          pubs={topPubs}
          loading={topPubsLoading}
          onRowClick={(id) => navigate(`/publications/${id}`)}
        />
      </div>

      <style>{`
        .index-container {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
        }
        .index-content {
          position: relative;
          z-index: 1;
          padding: clamp(16px, 3vw, 28px);
          max-width: 1400px;
          margin: 0 auto;
        }
      `}</style>
    </div>
  );
}