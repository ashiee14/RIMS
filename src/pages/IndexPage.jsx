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
   Helpers
──────────────────────────────────────────────────────────────── */
function fmtFunding(raw) {
  const n = parseFloat(raw) || 0;
  if (n === 0) return "—";
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(2)} Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(1)} L`;
  if (n >= 1_000)      return `₹${(n / 1_000).toFixed(0)}K`;
  return `₹${n}`;
}

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
   Icon for stat cards
──────────────────────────────────────────────────────────────── */
const STAT_ICONS = {
  publications: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
    </svg>
  ),
  citations: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.5 10c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.123.474-.195.474-.195L9.01 4.045S8.81 4.13 8.48 4.273c-.17.064-.395.14-.645.24-.239.103-.518.201-.808.347-.287.14-.629.286-.933.51-.307.217-.637.446-.934.735-.289.281-.602.598-.87.979-.268.375-.547.787-.73 1.253-.187.458-.339.972-.362 1.512l-.007.193V12.5a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-.5zm8 0c-.223 0-.437.034-.65.065.069-.232.14-.468.254-.68.114-.308.292-.575.469-.844.148-.291.409-.488.601-.737.201-.242.475-.403.692-.604.213-.21.492-.315.714-.463.232-.133.434-.28.65-.35.208-.086.39-.16.539-.222.302-.123.474-.195.474-.195L17.01 4.045S16.81 4.13 16.48 4.273c-.17.064-.395.14-.645.24-.239.103-.518.201-.808.347-.287.14-.629.286-.933.51-.307.217-.637.446-.934.735-.289.281-.602.598-.87.979-.268.375-.547.787-.73 1.253-.187.458-.339.972-.362 1.512l-.007.193V12.5a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-.5z"/>
    </svg>
  ),
  impact: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>
    </svg>
  ),
  awards: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
    </svg>
  ),
  funding: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
    </svg>
  ),
};

const STAT_CONFIG = [
  { key: "publications", label: "TOTAL PUBLICATIONS",   iconColor: "#38bdf8", iconBg: "rgba(56,189,248,0.14)" },
  { key: "citations",    label: "TOTAL CITATIONS",      iconColor: "#34d399", iconBg: "rgba(52,211,153,0.14)" },
  { key: "funding",      label: "RESEARCH FUNDING",      iconColor: "#fb923c", iconBg: "rgba(251,146,60,0.14)"  },
  { key: "impact",       label: "AVG IMPACT FACTOR",    iconColor: "#a78bfa", iconBg: "rgba(167,139,250,0.14)" },
  { key: "awards",       label: "TOTAL AWARDS",         iconColor: "#fbbf24", iconBg: "rgba(251,191,36,0.14)"  },
];

/* ────────────────────────────────────────────────────────────────
   Top Stats Row
──────────────────────────────────────────────────────────────── */
function TopStatsRow({ stats, totalUsers }) {
  if (!stats) return null;

  const values = {
    publications: (stats.totalPublications ?? 0).toLocaleString(),
    citations:    (stats.totalCitations    ?? 0).toLocaleString(),
    funding:      fmtFunding(stats.totalFunding ?? "0"),
    impact:       stats.impactFactor?.average ?? "—",
    awards:       (stats.totalAwards       ?? 0).toLocaleString(),
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 12,
        marginBottom: 14,
      }}
    >
      {STAT_CONFIG.map(({ key, label, iconColor, iconBg }) => (
        <div
          key={key}
          style={{
            ...glassCard,
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "18px 20px",
          }}
          className="stat-card-anim"
        >
          <div style={{
            width: 46, height: 46, borderRadius: 12, flexShrink: 0,
            background: iconBg,
            border: `1px solid ${iconColor}33`,
            display: "flex", alignItems: "center", justifyContent: "center",
            color: iconColor,
          }}>
            {STAT_ICONS[key]}
          </div>
          <div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>
              {values[key]}
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.42)", marginTop: 4, letterSpacing: "0.07em", fontWeight: 500 }}>
              {label}
            </div>
          </div>
        </div>
      ))}
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
const SDG_NAMES = {
  1:  "No Poverty",
  2:  "Zero Hunger",
  3:  "Good Health & Well-Being",
  4:  "Quality Education",
  5:  "Gender Equality",
  6:  "Clean Water & Sanitation",
  7:  "Affordable & Clean Energy",
  8:  "Decent Work & Economic Growth",
  9:  "Industry, Innovation & Infrastructure",
  10: "Reduced Inequalities",
  11: "Sustainable Cities & Communities",
  12: "Responsible Consumption",
  13: "Climate Action",
  14: "Life Below Water",
  15: "Life on Land",
  16: "Peace, Justice & Strong Institutions",
  17: "Partnerships for the Goals",
};

function SDGBlocks({ data }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      {data.map((d) => {
        const num  = parseInt(d.label.replace("SDG ", ""), 10);
        const name = SDG_NAMES[num] || d.label;
        return (
          <div
            key={d.label}
            style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "8px 10px", borderRadius: 10,
              background: `${d.color}18`,
              border: `1px solid ${d.color}33`,
              minWidth: 0,
            }}
          >
            {d.icon ? (
              <img
                src={d.icon}
                alt={d.label}
                style={{ width: 34, height: 34, borderRadius: 6, objectFit: "cover", flexShrink: 0 }}
              />
            ) : (
              <div style={{
                width: 34, height: 34, borderRadius: 6, flexShrink: 0,
                background: d.color,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 800, color: "#fff",
              }}>
                {num}
              </div>
            )}
            <div style={{ minWidth: 0, overflow: "hidden" }}>
              <div style={{ fontSize: 9, color: d.color, fontWeight: 700, letterSpacing: "0.05em" }}>
                {d.label}
              </div>
              <div style={{
                fontSize: 10, color: "rgba(255,255,255,0.7)", fontWeight: 500,
                lineHeight: 1.3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {name}
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#fff", lineHeight: 1.1, marginTop: 2 }}>
                {d.value.toLocaleString()}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChartsRow({ trendData, citationTotals, quartileData, sdgData }) {
  const realSDGData = (sdgData || []).map((d) => ({
    label: d.label,
    value: d.count ?? d.value ?? 0,
    color: d.color,
    icon: d.icon || null,
  }));

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr minmax(240px, 0.48fr)",
      gap: 12,
      marginBottom: 14,
    }}>
      {/* Trend Chart */}
      <div style={glassCard}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ color: "#fff", fontWeight: 600 }}>Publication Trends</span>
        </div>
        <TrendChart data={trendData} />
      </div>

      {/* Right column: Quartile + SDG */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

        {/* Quartile Distribution */}
        <div style={glassCard}>
          <div style={{ textAlign: "center", fontWeight: 600, color: "#fff", marginBottom: 10 }}>
            Quartile Distribution
          </div>
          <DonutChart
            data={quartileData}
            centerValue={quartileData.reduce((s, d) => s + d.value, 0)}
            centerLabel="Publications"
            height={180}
            showLegend
            defaultHidden={["None"]}
          />
        </div>

        {/* SDG Contribution */}
        {realSDGData.length > 0 && (
          <div style={glassCard}>
            <div style={{ fontWeight: 600, color: "#fff", marginBottom: 10 }}>
              SDG Contribution
            </div>
            <SDGBlocks data={realSDGData} />
          </div>
        )}

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

      totalCitations:
        dashboardData.publications?.total_citations || 0,

      totalAwards:
        dashboardData.awards?.total || 0,

      totalFunding:
        dashboardData.projects?.total_funding || "0",

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

  // Merge citations_by_year into by_year so TrendChart gets {year, count, citations}
  const realTrendData = (() => {
    const byYear = dashboardData?.publications?.by_year || [];
    const citMap = {};
    (dashboardData?.publications?.citations_by_year || []).forEach((d) => {
      citMap[d.year] = d.count;
    });
    return byYear.map((d) => ({
      year: d.year,
      count: d.count,
      citations: citMap[d.year] ?? null,
    }));
  })();

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
        {/* Dashboard Header */}
        <div style={{ position: "relative", marginBottom: 24 }}>
          <h1 style={{ fontSize: "clamp(22px, 2.8vw, 30px)", fontWeight: 700, color: "#fff", margin: 0, lineHeight: 1.2 }}>
            Dashboards & Analytics
          </h1>
          <p style={{ color: "rgba(255,255,255,0.48)", fontSize: 13, margin: "6px 0 0" }}>
            Real-time institutional research performance and impact tracking.
          </p>
          <div style={{
            position: "absolute", top: 4, right: 0,
            display: "flex", alignItems: "center", gap: 7,
            background: "rgba(20,220,160,0.08)",
            border: "1px solid rgba(20,220,160,0.28)",
            borderRadius: 999, padding: "5px 14px",
          }}>
            <div className="live-dot" />
            <span style={{ fontSize: 11, color: "#14dca0", fontWeight: 600, letterSpacing: "0.07em" }}>LIVE METRICS</span>
          </div>
        </div>

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

        /* Donut animations */
        @keyframes donutSpinIn {
          from { transform: scale(0.55) rotate(-80deg); opacity: 0; }
          to   { transform: scale(1)   rotate(0deg);   opacity: 1; }
        }
        @keyframes fadeUp {
          from { transform: translateY(8px); opacity: 0; }
          to   { transform: translateY(0);   opacity: 1; }
        }
        .donut-anim { animation: donutSpinIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .donut-center-anim { animation: fadeUp 0.4s ease 0.55s both; }
        .legend-item-anim { animation: fadeUp 0.35s ease both; opacity: 0; }

        /* Stat card entrance */
        @keyframes cardFadeIn {
          from { transform: translateY(10px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .stat-card-anim {
          animation: cardFadeIn 0.45s ease both;
          opacity: 0;
        }
        .stat-card-anim:nth-child(1) { animation-delay: 0.05s; }
        .stat-card-anim:nth-child(2) { animation-delay: 0.11s; }
        .stat-card-anim:nth-child(3) { animation-delay: 0.17s; }
        .stat-card-anim:nth-child(4) { animation-delay: 0.23s; }
        .stat-card-anim:nth-child(5) { animation-delay: 0.29s; }

        /* LIVE dot pulse */
        .live-dot {
          width: 7px; height: 7px; border-radius: 50%; background: #14dca0;
          animation: livePulse 2s ease-in-out infinite;
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(20,220,160,0.5); }
          50%       { opacity: 0.8; box-shadow: 0 0 0 5px rgba(20,220,160,0); }
        }
      `}</style>
    </div>
  );
}