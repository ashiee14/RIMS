import { useEffect, useState } from "react";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";
import {
  fetchIPRs,
  updateIPR,
  deleteIPR,
} from "../services/api";
import { useNavigate } from "react-router-dom";

const {
  crimson: CRIMSON,
  textMuted: TEXT_MUTED,
} = COLORS;



const IPRPage = () => {
  const [iprs, setIprs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState(null);

const [editForm, setEditForm] = useState({
  title: "",
  ipr_type: "",
  status: "",
  application_no: "",
  filing_date: "",
});

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


const handleEditClick = (ipr) => {
  setEditingId(ipr.id);

  setEditForm({
    title: ipr.title || "",
    ipr_type: ipr.ipr_type || "",
    status: ipr.status || "",
    application_no: ipr.application_no || "",
    filing_date: ipr.filing_date || "",
  });
};

const handleEditChange = (e) => {
  setEditForm((prev) => ({
    ...prev,
    [e.target.name]: e.target.value,
  }));
};

const handleUpdate = async (id) => {
  try {
    const updated = await updateIPR(id, editForm);

    setIprs((prev) =>
      prev.map((ipr) =>
        ipr.id === id ? updated : ipr
      )
    );

    setEditingId(null);

    alert("IPR updated successfully!");

  } catch (error) {
    console.error(error);

    alert("Failed to update IPR");
  }
};

const handleDelete = async (id) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this IPR?"
  );

  if (!confirmDelete) return;

  try {
    await deleteIPR(id);

    setIprs((prev) =>
      prev.filter((ipr) => ipr.id !== id)
    );

    alert("IPR deleted successfully!");

  } catch (error) {
    console.error(error);

    alert("Failed to delete IPR");
  }
};

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
  <div className="ipr-grid">
    {iprs.map((ipr) => (
      <div key={ipr.id} className="aurora-card">

          {editingId === ipr.id ? (
            <>
              <input
                type="text"
                name="title"
                value={editForm.title}
                onChange={handleEditChange}
                placeholder="Title"
              />

              <input
                type="text"
                name="ipr_type"
                value={editForm.ipr_type}
                onChange={handleEditChange}
                placeholder="IPR Type"
              />

              <input
                type="text"
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
                placeholder="Status"
              />

              <input
                type="text"
                name="application_no"
                value={editForm.application_no}
                onChange={handleEditChange}
                placeholder="Application Number"
              />

              <input
                type="date"
                name="filing_date"
                value={editForm.filing_date}
                onChange={handleEditChange}
              />

              <div className="btn-row">
                <button
                  onClick={() => handleUpdate(ipr.id)}
                >
                  Save
                </button>

                <button
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h3>{ipr.title}</h3>

              <p>
                <strong>Type:</strong> {ipr.ipr_type}
              </p>

              <p>
                <strong>Status:</strong> {ipr.status}
              </p>

              <p>
                <strong>Application No:</strong>
                {" "}
                {ipr.application_no}
              </p>

              <p>
                <strong>Filing Date:</strong>
                {" "}
                {ipr.filing_date}
              </p>

              <div className="btn-row">
                <button
                  onClick={() => navigate(`/ipr/${ipr.id}`)}
                  style={{
                    marginTop: 10,
                    padding: "8px 14px",
                    border: "none",
                    borderRadius: 8,
                    background: "#ffffff",
                    color: "#2200a8",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  View
                </button>

                <button
                  onClick={() => handleEditClick(ipr)}
                  style={{
                    marginTop: 10,
                    marginRight: 10,
                    padding: "8px 14px",
                    border: "none",
                    borderRadius: 8,
                    background: "#2563eb",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                          >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(ipr.id)}
                  style={{
                    marginTop: 10,
                    padding: "8px 14px",
                    border: "none",
                    borderRadius: 8,
                    background: "#2c15c5",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </>
          )}

        </div>
           ))}
  </div>
)}
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
    max-width: 1100px;
    margin: 0 auto;
    padding: clamp(16px, 3vw, 28px);
    color: #ffffff;
  }

  .ipr-grid {
    display: grid;
    grid-template-columns: repeat(
      auto-fit,
      minmax(260px, 1fr)
    );
    gap: 20px;
  }

  .aurora-card {
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

  .aurora-card:hover {
    transform: translateY(-5px);
    
    box-shadow:
      0 8px 20px
      rgb(255, 255, 255);
  }

  .aurora-card h3 {
    margin-bottom: 12px;
    font-size: 20px;
  }

  .aurora-card p {
    margin: 8px 0;
    color: rgba(255,255,255,0.92);
  }

  .add-btn {
    margin: 20px 0;

    padding: 12px 18px;

    border: none;
    border-radius: 8px;

    cursor: pointer;

    font-weight: bold;

    background: ${CRIMSON};

    color: #fff;

    transition: 0.25s ease;
  }

  .add-btn:hover {
    opacity: 0.9;
    transform: translateY(-2px);
  }

  .btn-row {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 16px;
    flex-wrap: wrap;
  }

  .btn-row button {
    padding: 10px 14px;

    border: none;

    border-radius: 8px;

    cursor: pointer;

    font-weight: bold;

    color: #fff;

    transition: 0.25s ease;
  }

  .btn-row button:hover {
    transform: translateY(-2px);
    opacity: 0.92;
  }

  .btn-row button:first-child {
    background: #2563eb;
  }

  .btn-row button:last-child {
    background: #2c15c5;
  }

  .aurora-card input {
    width: 100%;

    margin-top: 10px;

    padding: 12px;

    border-radius: 8px;

    border: none;

    outline: none;

    background: rgba(255,255,255,0.92);

    color: #111;
  }

  .aurora-card input::placeholder {
    color: #666;
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

    .btn-row {
      justify-content: center;
    }
  }
`}</style>


    </div>
  );
};

export default IPRPage;