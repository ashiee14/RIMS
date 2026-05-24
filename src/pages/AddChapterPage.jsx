import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";
import { createChapter } from "../services/api";

const {
  crimson: CRIMSON,
  textMuted: TEXT_MUTED,
} = COLORS;

const AddChapterPage = () => {
  const navigate = useNavigate();

  const { bookId } = useParams();

  const [formData, setFormData] = useState({
    title: "",
    chapter_number: "",
    content: "",
  });

  useEffect(() => {
    const root = document.getElementById("root");

    root.classList.add("aurora-root");

    return () =>
      root.classList.remove("aurora-root");
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createChapter(bookId, formData);

      alert("Chapter created successfully!");

      navigate(-1);

    } catch (error) {
      console.error(error);

      alert("Failed to create chapter");
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
        <h1 style={{ color: CRIMSON }}>
          Add Chapter
        </h1>

        <p style={{ color: TEXT_MUTED }}>
          Create a chapter for this book.
        </p>

        <form
          onSubmit={handleSubmit}
          className="form-card"
        >
          <input
            type="text"
            name="title"
            placeholder="Chapter Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="chapter_number"
            placeholder="Chapter Number"
            value={formData.chapter_number}
            onChange={handleChange}
          />

          <textarea
            name="content"
            placeholder="Chapter Content"
            value={formData.content}
            onChange={handleChange}
            rows={8}
          />

          <button type="submit">
            Save Chapter
          </button>
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
        .form-card textarea {
          padding: 12px;
          border-radius: 8px;
          border: none;
          outline: none;
        }

        .form-card button {
          padding: 12px;
          border: none;
          border-radius: 8px;
          background: ${CRIMSON};
          color: white;
          font-weight: bold;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default AddChapterPage;