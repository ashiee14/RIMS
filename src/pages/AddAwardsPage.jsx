import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Aurora from "../components/Aurora";
import { COLORS, FONT } from "../styles/theme";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../contexts/AuthContext";

const {
  crimson: CRIMSON,
  border: BORDER,
  text: TEXT,
  textMuted: TEXT_MUTED,
  textHint: TEXT_HINT,
  cardBg: CARD_BG,
  lightBg: LIGHT_BG,
} = COLORS;

const AddAwardsPage = ({ onNav }) => {
  const navigate = useNavigate();
  const { role } = useAuth();
  const isViewer = role === "viewer";

  const [selectedFile, setSelectedFile] = useState(null);

  const [uploading, setUploading] = useState(false);

  const [certificateId, setCertificateId] = useState(null);

  const [previewUrl, setPreviewUrl] = useState("");

  const [fileType, setFileType] = useState("");

  const [fields, setFields] = useState({
    recipient_name: "",
    title: "",
    date: "",
    agency: "",
  });
  

  const update = (k, v) => setFields(p => ({ ...p, [k]: v }));
  
  //added
  const getUserIdFromToken = () => {
      const token = localStorage.getItem("access_token");
      if (!token) return null;

      try {
        const decoded = jwtDecode(token);
        return decoded.user_id || decoded.id;
      } catch (err) {
        console.error("Invalid token:", err);
        return null;
      }
    };

    const [userId, setUserId] = useState(null);

    useEffect(() => {
      const id = getUserIdFromToken();
      setUserId(id);
    }, []);

  useEffect(() => {
    const root = document.getElementById("root");

    root.classList.add("aurora-root");

    return () =>
      root.classList.remove("aurora-root");
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);
  
  const handleCertificateUpload = async () => {
      if (!selectedFile) {
        alert("Please select a certificate image first");
        return;
      }

      try {
        setUploading(true);

        const token = localStorage.getItem("access_token");

        const formData = new FormData();

        formData.append("certificate", selectedFile);

        const response = await fetch(
          "/api/awards/upload-certificate/",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const data = await response.json();

        console.log("UPLOAD RESPONSE:", data);

        if (response.ok) {
          setCertificateId(data.file_upload_id);

          setFields((prev) => ({
            ...prev,
            title: data.title || "",
            agency: data.awarding_agency || "",
            date: data.award_date || "",
            recipient_name: data.recipient_name || "",
          }));

          alert("Certificate uploaded and details extracted!");
        } else {
          alert("Upload failed");
        }
      } catch (error) {
        console.error("UPLOAD ERROR:", error);
        alert("Something went wrong");
      } finally {
        setUploading(false);
      }
    };

  const handleSaveAward = async () => {
  console.log("BUTTON CLICKED");

  try {
    const token = localStorage.getItem("access_token");
    const payload = {
      title: fields.title,
      awarding_agency: fields.agency,
      award_date: fields.date,
      recipient_id: userId,
      certificate_id: certificateId,
    };

    console.log("SENDING:", payload);

    const response = await fetch("/api/awards/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log("CREATE STATUS:", response.status);
    console.log("CREATE DATA:", data);

    if (response.ok) {
      alert("Award created successfully!");
      navigate("/awards");
    } 
    else {
      alert("Failed to create award");
    }

  } catch (error) {
    console.error("CREATE ERROR:", error);
  }
};

  const labelStyle = { fontSize: 13, fontWeight: 500, marginBottom: 6, display: "block", color: TEXT };
  const reqStar = <span style={{ color: CRIMSON }}>*</span>;
  const inputStyle = { width: "100%", padding: "10px 12px", border: `1px solid ${BORDER}`, borderRadius: 8, fontSize: 13, color: TEXT, background: "#fff", outline: "none" };
  
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
      <h1 style={{ color: "#fff",
                  textShadow: "0 2px 2px CRIMSON",
                  fontFamily: FONT?.serif,
                  fontSize: "clamp(28px, 4vw, 40px)", }}>
        Add Award
      </h1>

      <p style={{ color: TEXT_MUTED }}>
        Upload an image or manually create
        a new award entry.
      </p>

      <div className="upload-card">
        <h3 style={{ marginBottom: 16 }}>
          Upload Award Image
        </h3>

        <div className="upload-preview">
          {previewUrl ? (
            fileType.startsWith("image/") ? (
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: 10,
                }}
              />
            ) : (
              <iframe
                src={previewUrl}
                title="PDF Preview"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  borderRadius: 10,
                }}
              />
            )
          ) : (
            <div>
              <div
                style={{
                  fontSize: 34,
                  marginBottom: 6,
                }}
              >
                📜
              </div>

              <div
                style={{
                  fontSize: 12,
                  opacity: 0.8,
                }}
              >
                Certificate Preview
              </div>
            </div>
          )}
        </div>

        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) => {
            const file = e.target.files[0];

            if (file) {
              setSelectedFile(file);
              setPreviewUrl(URL.createObjectURL(file));
              setFileType(file.type);
            }
          }}
          style={{ marginBottom: 14 }}
        />

        {!isViewer && (
          <button
            type="button"
            className="action-btn save-btn"
            onClick={handleCertificateUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        )}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSaveAward();
        }}
        className="form-card"
      >
        <input
          type="text"
          placeholder="Recipient Name"
          value={fields.recipient_name}
          onChange={(e) =>
            update("recipient_name", e.target.value)
          }
        />


        <input
          type="text"
          placeholder="Award Title"
          value={fields.title}
          onChange={(e) =>
            update("title", e.target.value)
          }
        />

        <input
          type="date"
          value={fields.date}
          onChange={(e) =>
            update("date", e.target.value)
          }
        />

        <input
          type="text"
          placeholder="Awarding Agency"
          value={fields.agency}
          onChange={(e) =>
            update("agency", e.target.value)
          }
        />


        <div className="btn-row">
          <button
            type="button"
            className="action-btn delete-btn"
            onClick={() =>
              navigate("/awards")
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="action-btn save-btn"
          >
            Save Award
          </button>
        </div>
      </form>
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
        max-width: 700px;
        margin: auto;
        padding: 30px;
        color: white;
      }

      .upload-card {
        background: rgba(255,255,255,0.12);

        backdrop-filter: blur(12px);

        border-radius: 12px;

        padding: 24px;

        margin-bottom: 24px;

        text-align: center;
      }

      .upload-preview {
        width: 220px;
        height: 130px;

        margin: 0 auto 18px;

        border-radius: 12px;

        border: 2px dashed
          rgba(255,255,255,0.4);

        display: flex;

        align-items: center;
        justify-content: center;

        background:
          rgba(255,255,255,0.08);
      }

      .form-card {
        background: rgba(255,255,255,0.12);

        backdrop-filter: blur(12px);

        border-radius: 12px;

        padding: 24px;

        display: flex;

        flex-direction: column;

        gap: 14px;
      }

      .form-card input,
      .form-card select,
      .form-card textarea {
        padding: 12px;

        border-radius: 8px;

        border: none;

        outline: none;
      }

      .form-card textarea {
        min-height: 100px;
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

      .delete-btn {
        background: #444;
      }

      .btn-row {
        display: flex;

        justify-content: flex-end;

        gap: 10px;

        margin-top: 10px;
      }
    `}</style>
  </div>
);
};


export default AddAwardsPage;