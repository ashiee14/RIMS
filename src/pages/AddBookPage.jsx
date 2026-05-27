import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";
import { addBook } from "../services/api";//added

const {
  crimson: CRIMSON,
  textMuted: TEXT_MUTED,
} = COLORS;

const AddBookPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      title: "",
      publisher: "",
      isbn: "",
      year: "",
      pages: "",
    });

  useEffect(() => {
    const root =
      document.getElementById("root");

    root.classList.add("aurora-root");

    return () =>
      root.classList.remove(
        "aurora-root"
      );
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        year: formData.year ? Number(formData.year) : null,   
        pages: formData.pages
          ? Number(formData.pages)
          : null,
      };

      await addBook(payload);

      alert("Book created successfully!");

      navigate("/books-chapters");

    } catch (error) {
      console.error(error);

      alert("Failed to create book");
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
          Add Book
        </h1>

        <p style={{ color: TEXT_MUTED }}>
          Create a new book entry.
        </p>

        <form
          onSubmit={handleSubmit}
          className="form-card"
        >
          <input
            type="text"
            name="title"
            placeholder="Book Title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="publisher"
            placeholder="Publisher"
            value={formData.publisher}
            onChange={handleChange}
          />

          <input
            type="text"
            name="isbn"
            placeholder="ISBN"
            value={formData.isbn}
            onChange={handleChange}
          />

          <input
            type="number"
            name="year"
            placeholder="Year"
            value={formData.year}
            onChange={handleChange}
          />

          <input
            type="number"
            name="pages"
            placeholder="Pages"
            value={formData.pages}
            onChange={handleChange}
          />

          <button type="submit">
            Save Book
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

        .form-card input {
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

export default AddBookPage;