import React, { useState, useEffect } from "react";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";
import { Logo, ChevronDown } from "../components/Navbar";

const {
  crimson: CRIMSON,
  border: BORDER,
  text: TEXT,
  textMuted: TEXT_MUTED,
  textHint: TEXT_HINT,
  cardBg: CARD_BG,
  lightBg: LIGHT_BG,
} = COLORS;

const PublicationsPage = () => {
  const [selectedYear, setSelectedYear] = useState("current");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("aurora-root");
    return () => root.classList.remove("aurora-root");
  }, []);

  const pubs = [
    {
      id: 1,
      title:
        "Ethanolic Extract of Vitis vinifera (Black grapes) Skin as a Safer Alternative to Hematoxylin and Eosin Stain",
      authors: "Rahul Mohandas, Subhashree Mohapatra*",
      journal:
        "Type: Article  Vol: 15  Issue: 1  Page: —  Published: 1 Dec 2025",
      pdfAvail: false,
    },
    {
      id: 2,
      title:
        "Elevated NT-proBNP in a Patient with Grade I Renal Cell Carcinoma undergoing Axitinib Therapy: A Case Report",
      authors:
        "Abhijit Pratap, Pradnya Phalak, Anjali Garg, Deepali Jain",
      journal:
        "JOURNAL OF CLINICAL AND DIAGNOSTIC RESEARCH  Type: —  Vol: N/A  Issue: N/A  Published: 1 Dec 2025",
      pdfAvail: true,
    },
    {
      id: 3,
      title:
        "Prevalence and predictors of asthma among Indian women: a machine learning-based analysis of NFHS-5 data",
      authors:
        "Vini Mehta, Anil Pardeshi, Rayhan Rahman, Illias Sheikh, Ankita Mathur",
      journal:
        "BMC Public Health  Type: —  Vol: 25  Issue: 1  Published: 7 Nov 2025",
      pdfAvail: true,
    },
  ];

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
    {
      label: "Quartiles",
      items: [
        "Quartile 1 (420)",
        "Quartile 2 (335)",
        "Quartile 3 (237)",
        "Quartile 4 (208)",
      ],
    },
  ];

  return (
    <div className="aurora-page">
      <Aurora
        colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
        amplitude={1}
        blend={0.5}
      />

      <div className="aurora-content">
        <div className="pub-container">
          {/* Sidebar */}
          <div className="sidebar">
            <div className="sidebar-header">
              <span>Filters</span>
            </div>

            {filters.map((f, i) => (
              <div key={i} className="filter-section">
                <div className="filter-title">
                  <span>{f.label}</span>
                  <ChevronDown size={12} />
                </div>

                {f.items.map((item, j) => (
                  <label key={j} className="filter-item">
                    <input
                      type="checkbox"
                      defaultChecked={j === 0}
                      style={{ accentColor: CRIMSON }}
                    />
                    {item}
                  </label>
                ))}
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="content">
            <div className="results">
              <strong>1732</strong>{" "}
              <span>Publications/Proceedings found</span>
            </div>

            {pubs.map((p) => (
              <div key={p.id} className="pub-card">
                {p.pdfAvail && (
                  <div className="pdf-badge">PDF Available</div>
                )}
                <h3 style={{ color: CRIMSON }}>{p.title}</h3>
                <p style={{ color: TEXT_MUTED }}>
                  Authors: {p.authors}
                </p>
                <p style={{ color: TEXT_HINT }}>{p.journal}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .aurora-page {
          position: relative;
          min-height: 100vh;
          width: 100%;
          overflow: hidden;
        }
        .aurora-content {
          position: relative;
          z-index: 1;
          color: #ffffff;
        }
        .pub-container {
          display: flex;
          height: calc(100vh - 54px);
          overflow: hidden;
        }
        .sidebar {
          width: 240px;
          background: none;
          border-right: 1px solid ${BORDER};
          overflow-y: auto;
          padding: 16px 0;
        }
        .sidebar-header {
          padding: 0 16px 12px;
          font-size: 12px;
          font-weight: 600;
          color: ${TEXT_MUTED};
          text-transform: uppercase;
        }
        .filter-section {
          border-top: 1px solid ${BORDER};
          padding: 10px 16px;
        }
        .filter-title {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          font-size: 13px;
        }
        .filter-item {
          display: flex;
          gap: 7px;
          font-size: 12px;
          color: ${TEXT_MUTED};
          margin-bottom: 5px;
          cursor: pointer;
        }
        .content {
          flex: 1;
          overflow-y: auto;
          padding: 20px 24px;
        }
        .results {
          margin-bottom: 18px;
          color: #fff;
        }
        .pub-card {
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: 16px;
          margin-bottom: 14px;
          position: relative;
        }
        .pdf-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: #1D6B5E;
          color: #fff;
          font-size: 9px;
          padding: 4px 8px;
          border-radius: 0 12px 0 8px;
        }
      `}</style>
    </div>
  );
};

export default PublicationsPage;