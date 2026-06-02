import { useEffect, useState } from "react";
import Aurora from "../components/Aurora";
import { COLORS, FONT } from "../styles/theme";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Pagination from "../components/Pagination";

const {
  crimson: CRIMSON,
  textMuted: TEXT_MUTED,
} = COLORS;

const AwardsPage = () => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();
  const { role } = useAuth();
  const isViewer = role === "viewer";

  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("aurora-root");

    return () => root.classList.remove("aurora-root");
  }, []);

  useEffect(() => {
        const loadAwards = async () => {
      try {
        const token = localStorage.getItem("access_token");

        console.log("TOKEN:", token);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/awards/?page=${currentPage}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        setAwards(Array.isArray(data) ? data : data.results || []);
        setTotalPages(data?.total_pages || 1);

      } catch (error) {
        console.error("Error fetching awards:", error);
        setAwards([]);
      } finally {
        setLoading(false);
      }
    };

    loadAwards();
  }, [currentPage]);

  return (
    <div className="aurora-page">
      <Aurora
        colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
        amplitude={1}
        blend={0.5}
      />

      <div className="aurora-content">
        <h1 style={{ color: "#fff",
                    textShadow: "0 2px 2px CRIMSON",
                    fontFamily: FONT?.serif,
                    fontSize: "clamp(28px, 4vw, 40px)",}}>Awards</h1>

        <p style={{ color: TEXT_MUTED }}>
          Recognitions and achievements received.
        </p>

        {!isViewer && (
          <button
            onClick={() => navigate("/add-awards")}
            className="action-btn save-btn"
            style={{ marginBottom: 24 }}
          >
            Add Award
          </button>
        )}

        {loading ? (
          <p>Loading awards...</p>
        ) : awards.length === 0 ? (
          <p>No awards found.</p>
        ) : (
          <div className="awards-grid">
            {awards.map((award) => (
              <div
                key={award.id}
                className="award-card"
                onClick={() => navigate(`/awards/${award.id}`)}
              >
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
            ))}
          </div>
        )}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={(p) => { setCurrentPage(p); window.scrollTo(0, 0); }} />
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
    max-width: 1100px;
    margin: 0 auto;
    padding: clamp(16px, 3vw, 28px);
    color: #ffffff;
  }

  .awards-grid {
    display: grid;
    grid-template-columns: repeat(
      auto-fit,
      minmax(260px, 1fr)
    );
    gap: 20px;
    margin-top: 20px;
  }


.award-card {
  background: rgba(255, 255, 255, 0.12);

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  border: 1px solid rgba(255, 255, 255, 0.2);

  border-radius: 12px;

  padding: 20px;

  color: #ffffff;

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.award-card:hover {
  transform: translateY(-5px);
  cursor:pointer;
  box-shadow:
    0 8px 20px
    rgb(255, 255, 255);
}

.award-card h3 {
  margin-bottom: 12px;
  font-size: 20px;
}

.award-card p {
  margin: 8px 0;
  color: rgba(255,255,255,0.92);
}

.form-card {
  background: rgba(255, 255, 255, 0.12);

  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);

  border: 1px solid rgba(255,255,255,0.2);

  border-radius: 12px;

  padding: 20px;

  margin-top: 20px;
  margin-bottom: 24px;
}

.form-card input {
  width: 100%;

  padding: 12px;

  margin-top: 10px;

  border-radius: 8px;

  border: none;

  outline: none;

  background: rgba(255,255,255,0.92);

  color: #111;
}

.action-btn {
  margin-top: 12px;

  padding: 10px 18px;

  border: none;

  border-radius: 8px;

  color: #fff;

  cursor: pointer;

  font-weight: bold;

  transition: 0.25s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  opacity: 0.92;
}

.save-btn {
  background: ${CRIMSON};
}

.edit-btn {
  background: #2563eb;
}

.delete-btn {
  background: #2f27d7;
}

.cancel-btn {
  background: #555;
}

.btn-row {
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 16px;
  flex-wrap: wrap;
}


.edit-input {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  border-radius: 8px;
  border: none;
  outline: none;
  background: rgba(255,255,255,0.92);
  color: #111;
}


  /* Aurora Background Safety */
  .aurora-container {
    position: fixed;
    inset: 0;
    z-index: 0;
    pointer-events: none;
  }

  .aurora-layer {
    position: absolute;
    width: 100%;
    height: 100%;
    animation:
      auroraMove 18s infinite
      alternate ease-in-out;
  }

  .aurora-layer-1 {
    animation-delay: 0s;
  }

  .aurora-layer-2 {
    animation-delay: 4s;
  }

  .aurora-layer-3 {
    animation-delay: 8s;
  }

  @keyframes auroraMove {
    0% {
      transform:
        translate(0, 0)
        scale(1);
    }

    50% {
      transform:
        translate(40px, -30px)
        scale(1.1);
    }

    100% {
      transform:
        translate(-30px, 40px)
        scale(1.05);
    }
  }

  @media (max-width: 768px) {
    .aurora-content {
      text-align: center;
    }
  }
`}</style>
    </div>
  </div>
  );
};

export default AwardsPage;