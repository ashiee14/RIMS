import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";

const {
  crimson: CRIMSON,
  textMuted: TEXT_MUTED,
} = COLORS;

const BookDetailsPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [book, setBook] = useState(null);

  const [chapters, setChapters] = useState([]);

  


  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBook = async () => {
      try {
        const token =
          localStorage.getItem("access_token");

        const response = await fetch(
          `/api/books/${id}/`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();

        console.log("BOOK DETAILS:", data);

        setBook(data);

        setChapters(data.chapters || []);

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id]);

  


  if (loading) {
    return <p>Loading...</p>;
  }

  if (!book) {
    return <p>Book not found.</p>;
  }

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

        <button
          onClick={() => navigate(-1)}
          className="back-btn"
        >
          ← Back
        </button>

        <h1 style={{ color: CRIMSON }}>
          {book.title}
        </h1>

        <p style={{ color: TEXT_MUTED }}>
          Publisher: {book.publisher}
        </p>

        <p>ISBN: {book.isbn || "N/A"}</p>

        <p>Year: {book.year}</p>

        <p>Pages: {book.pages || "N/A"}</p>

        <button
          onClick={() =>
            navigate(`/books/${book.id}/add-chapter`)
          }
          className="add-btn"
        >
          Add Chapter
        </button>

        <h2 style={{ marginTop: 30 }}>
          Chapters
        </h2>

        {chapters.length === 0 ? (
          <p>No chapters found.</p>
        ) : (
          <div className="chapters-grid">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="chapter-card"
                >
                <h3>{chapter.title}</h3>

                <p>
                    Chapter No: {chapter.chapter_no}
                </p>

                <p>
                    Pages: {chapter.start_page} - {chapter.end_page}
                </p>

                </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .aurora-page {
          min-height: 100vh;
          position: relative;
        }

        .aurora-content {
          position: relative;
          z-index: 1;
          max-width: 1000px;
          margin: auto;
          padding: 30px;
          color: white;
        }

        .chapters-grid {
          display: grid;
          gap: 20px;
          margin-top: 20px;
        }

        .chapter-card {
          background: rgba(255,255,255,0.12);
          padding: 20px;
          border-radius: 12px;
        }

        .add-btn,
        .back-btn {
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          color: white;
          font-weight: bold;
          margin-top: 12px;
        }

        .add-btn {
          background: ${CRIMSON};
        }


        .back-btn {
          background: #444;
          margin-bottom: 20px;
        }

        .btn-row {
          display: flex;
          justify-content: center;
          gap: 10px;
        }
      `}</style>
    </div>
  );
};

export default BookDetailsPage;