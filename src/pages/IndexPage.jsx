import { useEffect } from "react";
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
          <span style={{ color: "#fff", fontWeight: 600 }}>
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
   Institutional Table
──────────────────────────────────────────────────────────────── */
function InstitutionalTable({ colleges }) {
  return (
    <div style={glassCard}>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: COLORS.crimson }}>
              {[
                "Sr.No",
                "College",
                "Total Pubs",
                "Indexed Pubs",
                "Total Citations",
                "Avg Impact Factor",
                "Q1|Q2|Q3|Q4|None",
              ].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "12px",
                    color: "#fff",
                    fontSize: 12,
                    textAlign: "left",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {colleges.map((c) => {
              const { q1, q2, q3, q4, none } = c.quartiles;
              return (
                <tr key={c.id}>
                  <td style={{ padding: 12 }}>{c.id}</td>
                  <td style={{ padding: 12 }}>{c.name}</td>
                  <td style={{ padding: 12 }}>
                    {c.totalPublications}
                  </td>
                  <td style={{ padding: 12 }}>
                    {c.indexedBreakdown.total}
                  </td>
                  <td style={{ padding: 12 }}>
                    {c.totalCitations}
                  </td>
                  <td style={{ padding: 12 }}>
                    {c.avgImpactFactor}
                  </td>
                  <td style={{ padding: 12 }}>
                    {q1}|{q2}|{q3}|{q4}|{none}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
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
        average: 0,
        cumulative: 0,
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
            dashboardData.research_indices
              ?.h_index || 0,
        },
      ],

      i10Index: [
        {
          label: "i10-index",
          value:
            dashboardData.research_indices
              ?.i10_index || 0,
        },
      ],

      top1Percentile:
        dashboardData.awards?.total || 0,

      top10Percentile:
        dashboardData.ipr?.granted || 0,
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

        <h2
          style={{
            fontFamily: FONT.serif,
            fontSize: "22px",
            color: "#fff",
            margin: "20px 0 10px",
          }}
        >
          Institutional Publication Overview
        </h2>

        <InstitutionalTable colleges={colleges} />
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