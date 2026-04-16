import { useEffect } from "react";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";

const {
  crimson: CRIMSON,
  border: BORDER,
  textMuted: TEXT_MUTED,
  cardBg: CARD_BG,
} = COLORS;

const books = [
  {
    title: "Artificial Intelligence in Healthcare",
    publisher: "Springer",
    year: "2024",
  },
];

const BooksChaptersPage = () => {
  useEffect(() => {
    const root = document.getElementById("root");
    root.classList.add("aurora-root");
    return () => root.classList.remove("aurora-root");
  }, []);

  return (
    <div className="aurora-page">
      <Aurora
        colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
        amplitude={1}
        blend={0.5}
      />

      <div className="aurora-content" style={{ maxWidth: 1000 }}>
        <h1 style={{ color: CRIMSON }}>Books & Chapters</h1>
        <p style={{ color: TEXT_MUTED }}>
          Published books and book chapters.
        </p>

        {books.map((book, index) => (
          <div
            key={index}
            style={{
              background: CARD_BG,
              border: `1px solid ${BORDER}`,
              borderRadius: 12,
              padding: 16,
              marginTop: 12,
            }}
          >
            <h3>{book.title}</h3>
            <p><strong>Publisher:</strong> {book.publisher}</p>
            <p><strong>Year:</strong> {book.year}</p>
          </div>
        ))}
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
          margin: 0 auto;
          padding: 28px;
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default BooksChaptersPage;