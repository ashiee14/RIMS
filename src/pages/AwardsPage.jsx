import { useEffect, useState } from "react";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";

const {
  crimson: CRIMSON,
  textMuted: TEXT_MUTED,
} = COLORS;

const AwardsPage = () => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("aurora-root");

    return () => root.classList.remove("aurora-root");
  }, []);

  useEffect(() => {
        const loadAwards = async () => {
      try {
        const token = localStorage.getItem("access");

        console.log("TOKEN:", token);

        const response = await fetch("/api/awards/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        console.log("AWARDS STATUS:", response.status);
        console.log("AWARDS DATA:", data);

        const awardsArray = Array.isArray(data)
          ? data
          : data.results || [];

        setAwards(awardsArray);

      } catch (error) {
        console.error("Error fetching awards:", error);
        setAwards([]);
      } finally {
        setLoading(false);
      }
    };

    loadAwards();
  }, []);

  return (
    <div className="aurora-page">
      <Aurora
        colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
        amplitude={1}
        blend={0.5}
      />

      <div className="aurora-content">
        <h1 style={{ color: CRIMSON }}>Awards</h1>

        <p style={{ color: TEXT_MUTED }}>
          Recognitions and achievements received.
        </p>

        {loading ? (
          <p>Loading awards...</p>
        ) : awards.length === 0 ? (
          <p>No awards found.</p>
        ) : (
          awards.map((award) => (
            <div key={award.id} className="aurora-card">
              <h3>{award.title}</h3>

              <p>
                <strong>Awarding Agency:</strong>{" "}
                {award.awarding_agency}
              </p>

              <p>
                <strong>Award Date:</strong>{" "}
                {award.award_date}
              </p>

              {award.recipient && (
                <p>
                  <strong>Recipient:</strong>{" "}
                  {award.recipient.full_name}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      <style>{`
        .aurora-page {
          position: relative;
          min-height: 100vh;
          overflow: hidden;
        }

        .aurora-content {
          position: relative;
          z-index: 1;
          max-width: 1000px;
          margin: 0 auto;
          padding: 28px;
          color: #fff;
        }

        .aurora-card {
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          padding: 16px;
          margin-top: 12px;
        }
      `}</style>
    </div>
  );
};

export default AwardsPage;