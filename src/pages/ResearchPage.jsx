import { useState, useEffect } from "react";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";

const {
  crimson: CRIMSON,
  teal: TEAL,
  border: BORDER,
  text: TEXT,
  textMuted: TEXT_MUTED,
  lightBg: LIGHT_BG,
  cardBg: CARD_BG,
} = COLORS;

const ResearchPage = ({ onNav }) => {
  const [timeFilter, setTimeFilter] = useState("current");

  // Adds aurora styling to the root
  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("aurora-root");
    return () => root.classList.remove("aurora-root");
  }, []);

  const rows = [
    { id: 1, faculty: "Babasaheb Jadhav", dept: "Global Business School", name: "A Study On The Role Of Fintech: A Pathway To Financial Inclusion For Low Income Households", type: "National", duration: "--", date: "28 Jan 2025", funded: true, funds: 1, fundedBy: "Non-Government", org: "Dr. D.Y. Patil Vidyapeeth", status: "Ongoing" },
    { id: 2, faculty: "Hetal Rathod", dept: "Community Medicine", name: "Serosurvey For Kyasanur Forest Disease (KFD) In Western Ghats, India, 2024", type: "National", duration: "--", date: "3 Jun 2025", funded: true, funds: 23.21, fundedBy: "Government", org: "ICMR", status: "Ongoing" },
    { id: 3, faculty: "Amit Paliwal", dept: "Shalya Tantra", name: "A Comparative, Randomized Clinical Trial To Evaluate The Efficacy & Safety Of Ural-BPH Capsule In Adult Patients With Uncomplicated Benign Prostatic Hyperplasia (BPH).", type: "National", duration: "--", date: "10 Feb 2025", funded: true, funds: 2.23, fundedBy: "Non-Government", org: "Mprax Healthcare Pvt Ltd", status: "Ongoing" },
    { id: 4, faculty: "Debjani Guha", dept: "Global Business School", name: "Implications Of Artificial Intelligence On Talent Acquisition.", type: "National", duration: "--", date: "29 Sept 2022", funded: true, funds: 0.035, fundedBy: "Non-Government", org: "Dr.D.Y.Patil Vidyapeeth, Pune", status: "Ongoing" },
    { id: 5, faculty: "Zafar Azeem", dept: "Physiotherapy", name: "Test-Retest Reliability And Validity Of TecnobodyTM D-Wall In Assessing Range Of Motion During Forward And Backward Lunge In Healthy Individuals", type: "National", duration: "--", date: "1 Aug 2025", funded: true, funds: 2.52, fundedBy: "Non-Government", org: "DPU", status: "Ongoing" },
  ];

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

          <div style={{ display: "flex", gap: 6 }}>
            {["Current Year", "Last Year", "Last 3 Years", "All"].map((l) => (
              <button
                key={l}
                onClick={() => setTimeFilter(l)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 7,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  background: timeFilter === l ? CRIMSON : "#fff",
                  color: timeFilter === l ? "#fff" : TEXT,
                  border: `1px solid ${
                    timeFilter === l ? CRIMSON : BORDER
                  }`,
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <div
          style={{
            background: CARD_BG,
            border: `1px solid ${BORDER}`,
            borderRadius: 12,
            overflow: "hidden",
          }}
        >
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
                {rows.map((r) => (
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
                      --
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
                        Funded
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

        .aurora-container {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        @media (max-width: 768px) {
          .research-content {
            padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default ResearchPage;