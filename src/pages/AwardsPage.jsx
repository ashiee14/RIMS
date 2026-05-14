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

  const [editingId, setEditingId] = useState(null);
const [editForm, setEditForm] = useState({
  title: "",
  awarding_agency: "",
  award_date: "",
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

        {loading ? (
          <p>Loading awards...</p>
        ) : awards.length === 0 ? (
          <p>No awards found.</p>
        ) : (
          awards.map((award) => (
            <div key={award.id} className="aurora-card">
              {editingId === award.id ? (
              <input
                value={editForm.title}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    title: e.target.value,
                  })
                }
                style={{
                  width: "100%",
                  padding: "8px",
                  marginBottom: "10px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            ) : (
              <h3>{award.title}</h3>
            )}

              <p>
                <strong>Awarding Agency:</strong>{" "}
                {editingId === award.id ? (
                    <input
                      value={editForm.awarding_agency}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          awarding_agency: e.target.value,
                        })
                      }
                      style={{
                        padding: "6px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        marginLeft: "6px",
                      }}
                    />
                  ) : (
                    award.awarding_agency
                  )}
              </p>

              <p>
                <strong>Award Date:</strong>{" "}
                {editingId === award.id ? (
                  <input
                    type="date"
                    value={editForm.award_date}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        award_date: e.target.value,
                      })
                    }
                    style={{
                      padding: "6px",
                      borderRadius: "6px",
                      border: "1px solid #ccc",
                      marginLeft: "6px",
                    }}
                  />
                ) : (
                  award.award_date
                )}
              </p>

              {award.recipient && (
                <p>
                  <strong>Recipient:</strong>{" "}
                  {award.recipient.full_name}
                </p>
              )}


              {editingId === award.id ? (
                <button
                  onClick={() => handleUpdateAward(award.id)}
                  style={{
                    marginTop: 12,
                    marginRight: 10,
                    background: "#1890ff",
                    color: "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Save
                </button>
              ) : (
                <button
                  onClick={() => handleEditClick(award)}
                  style={{
                    marginTop: 12,
                    marginRight: 10,
                    background: "#1d65e1",
                    color: "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
              )}

              <button
                  onClick={() => handleDeleteAward(award.id)}
                  style={{
                    marginTop: 12,
                    background: "#261ce9",
                    color: "#fff",
                    border: "none",
                    padding: "8px 14px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    alignContent: "right",
                  }}
                >
                  Delete Award
                </button>
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