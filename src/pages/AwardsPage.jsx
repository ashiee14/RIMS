import { useEffect, useState } from "react";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";
import { useNavigate } from "react-router-dom";

const {
  crimson: CRIMSON,
  textMuted: TEXT_MUTED,
} = COLORS;

const AwardsPage = () => {
  const [awards, setAwards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

  const navigate = useNavigate();
  
  const [editForm, setEditForm] = useState({
    title: "",
    awarding_agency: "",
    award_date: "",
    recipient: "",
  });

  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("aurora-root");

    return () => root.classList.remove("aurora-root");
  }, []);

  const handleDeleteAward = async (id) => {
  try {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`/api/awards/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("DELETE STATUS:", response.status);

    if (response.status === 204) {
      setAwards((prev) =>
        prev.filter((award) => award.id !== id)
      );

      alert("Award deleted successfully!");
    } else {
      alert("Failed to delete award");
    }

  } catch (error) {
    console.error("DELETE ERROR:", error);
  }
};

const handleEditClick = (award) => {
  setEditingId(award.id);

  setEditForm({
    title: award.title,
    awarding_agency: award.awarding_agency,
    award_date: award.award_date,
    recipient: award.recipient?.full_name || "",
  });
};

const handleUpdateAward = async (id) => {
  try {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`/api/awards/${id}/`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(editForm),
    });

    const data = await response.json();

    console.log("UPDATE STATUS:", response.status);
    console.log("UPDATE DATA:", data);

    if (response.ok) {
      setAwards((prev) =>
        prev.map((award) =>
          award.id === id ? data : award
        )
      );

      setEditingId(null);

      alert("Award updated successfully!");
    } else {
      alert("Failed to update award");
    }

  } catch (error) {
    console.error("UPDATE ERROR:", error);
  }
};


  useEffect(() => {
        const loadAwards = async () => {
      try {
        const token = localStorage.getItem("access_token");

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

        <button
          onClick={() => navigate("/add-awards")}
          className="action-btn save-btn"
          style={{ marginBottom: 24 }}
        >
          Add Award
        </button>

        {loading ? (
          <p>Loading awards...</p>
        ) : awards.length === 0 ? (
          <p>No awards found.</p>
        ) : (
          <div className="awards-grid">
            {awards.map((award) => (
              <div key={award.id} className="award-card">

                {editingId === award.id ? (
                  <>
                    <input
                      type="text"
                      placeholder="Award Title"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          title: e.target.value,
                        })
                      }
                      className="edit-input"
                    />

                    <input
                      type="text"
                      placeholder="Awarding Agency"
                      value={editForm.awarding_agency}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          awarding_agency: e.target.value,
                        })
                      }
                      className="edit-input"
                    />

                    <input
                      type="date"
                      value={editForm.award_date}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          award_date: e.target.value,
                        })
                      }
                      className="edit-input"
                    />

                    <input
                      type="text"
                      placeholder="Recipient"
                      value={editForm.recipient}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          recipient: e.target.value,
                        })
                      }
                      className="edit-input"
                    />

                    <div className="btn-row">
                      <button
                        onClick={() =>
                          handleUpdateAward(award.id)
                        }
                        className="action-btn edit-btn"
                      >
                        Save
                      </button>

                      <button
                        onClick={() =>
                          setEditingId(null)
                        }
                        className="action-btn cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
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

                    <div className="btn-row">
                      <button
                        onClick={() =>
                          handleEditClick(award)
                        }
                        className="action-btn edit-btn"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() =>
                          handleDeleteAward(award.id)
                        }
                        className="action-btn delete-btn"
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

  box-shadow:
    0 8px 20px
    rgba(0, 0, 0, 0.25);
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