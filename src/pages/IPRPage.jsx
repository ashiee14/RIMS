import { useEffect, useState } from "react";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";
import { fetchIPRs } from "../services/api";
import { useNavigate } from "react-router-dom";

const {
  crimson: CRIMSON,
  textMuted: TEXT_MUTED,
} = COLORS;



const IPRPage = () => {
  const [iprs, setIprs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("aurora-root");
    return () => root.classList.remove("aurora-root");
  }, []);

  useEffect(() => {
  const loadIPRs = async () => {
    try {
      setLoading(true);

      let allIPRs = [];
      let nextUrl = "https://rims-api.prerna.sh/api/ipr/";

      while (nextUrl) {
  const response = await fetch(nextUrl, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

  const data = await response.json();

  console.log("PAGE DATA:", data);

  allIPRs = [...allIPRs, ...data.results];

  // Force HTTPS
  nextUrl = data.next
    ? data.next.replace("http://", "https://")
    : null;
}

      const sortedIPRs = allIPRs.sort(
        (a, b) => b.id - a.id
      );

      setIprs(sortedIPRs);

    } catch (error) {
      console.error("Error fetching IPRs:", error);
      setIprs([]);
    } finally {
      setLoading(false);
    }
  };

  loadIPRs();
}, []);


  return (
    <div className="aurora-page">
      <Aurora colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]} amplitude={1} blend={0.5} />
      <div className="aurora-content">
        <h1 style={{ color: CRIMSON }}>Intellectual Property Rights (IPR)</h1>
        <p style={{ color: TEXT_MUTED }}>Patents, copyrights, and trademarks.</p>

        <button
          onClick={() => navigate("/add-ipr")}
          className="add-btn"
        >
          Add IPR
        </button>


        {loading ? (
  <p>Loading IPR records...</p>
) : iprs.length === 0 ? (
  <p>No IPR records found.</p>
) : (
  iprs.map((ipr) => (
    <div key={ipr.id} className="aurora-card">
      <h3>{ipr.title}</h3>

      <p>
        <strong>Type:</strong> {ipr.ipr_type}
      </p>

      <p>
        <strong>Status:</strong> {ipr.status}
      </p>

      <p>
        <strong>Application No:</strong>{" "}
        {ipr.application_no}
      </p>

      <p>
        <strong>Filing Date:</strong>{" "}
        {ipr.filing_date}
      </p>
    </div>
  ))
)}
      </div>

      <style>{`
        .aurora-page { position: relative; min-height: 100vh; overflow: hidden; }
        .aurora-content { position: relative; z-index: 1; max-width: 1000px; margin: 0 auto; padding: 28px; color: #fff; }
        .aurora-card {
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: 16px;
          margin-top: 12px;
        }
          .add-btn {
            margin: 16px 0;
            padding: 12px 18px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
          }
      `}</style>
    </div>
  );
};

export default IPRPage;