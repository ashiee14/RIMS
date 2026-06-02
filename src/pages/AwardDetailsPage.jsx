import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Aurora from "../components/Aurora";
import { COLORS, FONT } from "../styles/theme";

const {
  crimson: CRIMSON,
  textMuted: TEXT_MUTED,
} = COLORS;

const AwardDetailsPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [award, setAward] = useState(null);

  const [loading, setLoading] = useState(true);

  const [editing, setEditing] = useState(false);

  const [editForm, setEditForm] = useState({
    title: "",
    awarding_agency: "",
    award_date: "",
    recipient_id: null,
  });

  useEffect(() => {
    const loadAward = async () => {
      try {
        const token =
          localStorage.getItem("access_token");

        const response = await fetch(
          `/api/awards/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("DETAIL DATA:", data);

        setAward(data);

        setEditForm({
          title: data.title || "",
          awarding_agency:
            data.awarding_agency || "",
          award_date:
            data.award_date || "",
          recipient_id: data.recipient?.id || null,
        });

      } catch (error) {
        console.error(
          "DETAIL ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    loadAward();
  }, [id]);

  const handleDeleteAward =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "access_token"
          );

        const response = await fetch(
          `/api/awards/${id}/`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 204) {
          alert(
            "Award deleted successfully!"
          );

          navigate("/awards");
        } else {
          alert("Delete failed");
        }

      } catch (error) {
        console.error(
          "DELETE ERROR:",
          error
        );
      }
    };

  const handleUpdateAward =
    async () => {
      try {
        const token =
          localStorage.getItem(
            "access_token"
          );

        const response = await fetch(
          `/api/awards/${id}/`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              title: editForm.title,
              awarding_agency: editForm.awarding_agency,
              award_date: editForm.award_date,
              recipient_id: editForm.recipient_id,
            }),
          }
        );

        const data =
          await response.json();

        if (response.ok) {
          setAward(data);

          setEditing(false);

          alert(
            "Award updated successfully!"
          );
        } else {
          alert("Update failed");
        }

      } catch (error) {
        console.error(
          "UPDATE ERROR:",
          error
        );
      }
    };

  return (
    <div className="aurora-page">

      <Aurora
        colorStops={[
          "#8061fc",
          "#2500b7",
          "#000000",
          "#2200a8",
        ]}
        amplitude={1}
        blend={0.5}
      />

      <div className="aurora-content">

        {loading ? (
          <p>Loading...</p>
        ) : !award ? (
          <p>Award not found.</p>
        ) : (
          <div className="details-card">

            <h1 style={{color: "#fff",
                    textShadow: "0 2px 2px CRIMSON",
                    fontFamily: FONT?.serif,
                    fontSize: "clamp(28px, 4vw, 40px)",}}>{award.title}</h1>

            {award.certificate_image && (
              <img
                src={
                  award.certificate_image
                }
                alt="certificate"
                className="award-image"
              />
            )}

            {editing ? (
              <>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      title:
                        e.target.value,
                    })
                  }
                />
                
                
                <input
                  type="text"
                  value={
                    editForm.awarding_agency
                  }
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      awarding_agency:
                        e.target.value,
                    })
                  }
                />

                <input
                  type="date"
                  value={
                    editForm.award_date
                  }
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      award_date:
                        e.target.value,
                    })
                  }
                />

                <input
                  type="text"
                  value={award.recipient?.full_name || ""}
                  disabled
                />

                <div className="btn-row">
                  <button
                    onClick={
                      handleUpdateAward
                    }
                    className="action-btn save-btn"
                  >
                    Save
                  </button>

                  <button
                    onClick={() =>
                      setEditing(false)
                    }
                    className="action-btn cancel-btn"
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>
                  <strong>
                    Awarding Agency:
                  </strong>{" "}
                  {
                    award.awarding_agency
                  }
                </p>

                <p>
                  <strong>
                    Award Date:
                  </strong>{" "}
                  {award.award_date}
                </p>

                {award.recipient && (
                  <p>
                    <strong>
                      Recipient:
                    </strong>{" "}
                    {
                      award.recipient
                        .full_name
                    }
                  </p>
                )}

                <div className="btn-row">

                  <button
                    onClick={() =>
                      setEditing(true)
                    }
                    className="action-btn edit-btn"
                  >
                    Edit
                  </button>

                  <button
                    onClick={
                      handleDeleteAward
                    }
                    className="action-btn delete-btn"
                  >
                    Delete
                  </button>

                  <button
                    onClick={() =>
                      navigate(
                        "/awards"
                      )
                    }
                    className="action-btn cancel-btn"
                  >
                    Back
                  </button>

                </div>
              </>
            )}
          </div>
        )}
      </div>

      <style>{`
        .aurora-page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }

        .aurora-content {
          position: relative;
          z-index: 1;
          max-width: 800px;
          margin: auto;
          padding: 30px;
          color: white;
        }

        .details-card {
          background:
            rgba(255,255,255,0.12);

          backdrop-filter: blur(12px);

          border-radius: 16px;

          padding: 24px;
        }

        .details-card h1 {
          margin-bottom: 24px;
          line-height: 1.3;
          color: ${CRIMSON};
        }

        .award-image {
          width: 100%;

          border-radius: 12px;

          margin: 20px 0;
        }

        input {
          width: 100%;

          padding: 12px;

          margin-top: 12px;

          border-radius: 8px;

          border: none;

          outline: none;
        }

        .btn-row {
          display: flex;

          gap: 10px;
          justify-content: center;
          margin-top: 20px;

          flex-wrap: wrap;
        }

        .action-btn {
          padding: 12px 18px;

          border: none;

          border-radius: 8px;

          color: white;

          font-weight: bold;

          cursor: pointer;
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
      `}</style>
    </div>
  );
};

export default AwardDetailsPage;