import { useEffect, useState } from "react";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";

const {
  crimson: CRIMSON,
  border: BORDER,
  textMuted: TEXT_MUTED,
  cardBg: CARD_BG,
} = COLORS;

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: 10,
  borderRadius: 8,
  border: "1px solid #ccc",
};

const BooksChaptersPage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBookId, setEditingBookId] = useState(null);

  const [fields, setFields] = useState({
  title: "",
  publisher: "",
  isbn: "",
  year: "",
  pages: "",
});

const updateField = (key, value) => {
  setFields((prev) => ({
    ...prev,
    [key]: value,
  }));
};
  
  useEffect(() => {
  const loadBooks = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const response = await fetch("/api/books/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      console.log("BOOKS STATUS:", response.status);
      console.log("BOOKS DATA:", data);

      const booksArray = Array.isArray(data)
        ? data
        : data.results || [];

      setBooks(booksArray);

    } catch (error) {
      console.error("BOOKS ERROR:", error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  loadBooks();
}, []);


const handleSaveBook = async () => {
  try {
    console.log("SAVE BOOK CLICKED");

    const token = localStorage.getItem("access_token");

    const payload = {
      title: fields.title,
      publisher: fields.publisher,
      isbn: fields.isbn,
      year: Number(fields.year),
      pages: fields.pages ? Number(fields.pages) : null,
    };

    console.log("BOOK PAYLOAD:", payload);

    const response = await fetch("/api/books/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log("CREATE BOOK STATUS:", response.status);
    console.log("CREATE BOOK DATA:", data);

    if (response.ok) {
      alert("Book created successfully!");

      setBooks((prev) => [data, ...prev]);

      setFields({
        title: "",
        publisher: "",
        isbn: "",
        year: "",
        pages: "",
      });
    } else {
      alert("Failed to create book");
    }

  } catch (error) {
    console.error("CREATE BOOK ERROR:", error);
  }
};

const handleDeleteBook = async (id) => {
  try {
    const token = localStorage.getItem("access_token");

    console.log("DELETING BOOK:", id);

    const response = await fetch(`/api/books/${id}/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("DELETE STATUS:", response.status);

    if (response.status === 204) {
      alert("Book deleted!");

      setBooks((prev) =>
        prev.filter((book) => book.id !== id)
      );
    } else {
      const data = await response.json();
      console.log("DELETE ERROR:", data);

      alert("Failed to delete book");
    }

  } catch (error) {
    console.error("DELETE BOOK ERROR:", error);
  }
};

const handleEditBook = (book) => {
  setEditingBookId(book.id);

  setFields({
    title: book.title || "",
    publisher: book.publisher || "",
    isbn: book.isbn || "",
    year: book.year || "",
    pages: book.pages || "",
  });
};

const handleUpdateBook = async () => {
  try {
    const token = localStorage.getItem("access_token");

    const payload = {
      title: fields.title,
      publisher: fields.publisher,
      isbn: fields.isbn,
      year: Number(fields.year),
      pages: fields.pages ? Number(fields.pages) : null,
    };

    console.log("UPDATING BOOK:", payload);

    const response = await fetch(
      `/api/books/${editingBookId}/`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const data = await response.json();

    console.log("UPDATE STATUS:", response.status);
    console.log("UPDATE DATA:", data);

    if (response.ok) {
      alert("Book updated!");

      setBooks((prev) =>
        prev.map((book) =>
          book.id === editingBookId ? data : book
        )
      );

      setEditingBookId(null);

      setFields({
        title: "",
        publisher: "",
        isbn: "",
        year: "",
        pages: "",
      });

    } else {
      alert("Failed to update book");
    }

  } catch (error) {
    console.error("UPDATE ERROR:", error);
  }
};



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

<div className="form-card">
  <h3>Add Book</h3>

  <input
    type="text"
    placeholder="Book Title"
    value={fields.title}
    onChange={(e) => updateField("title", e.target.value)}
    style={inputStyle}
  />

  <input
    type="text"
    placeholder="Publisher"
    value={fields.publisher}
    onChange={(e) => updateField("publisher", e.target.value)}
    style={inputStyle}
  />

  <input
    type="text"
    placeholder="ISBN"
    value={fields.isbn}
    onChange={(e) => updateField("isbn", e.target.value)}
    style={inputStyle}
  />

  <input
    type="number"
    placeholder="Year"
    value={fields.year}
    onChange={(e) => updateField("year", e.target.value)}
    style={inputStyle}
  />

  <input
    type="number"
    placeholder="Pages"
    value={fields.pages}
    onChange={(e) => updateField("pages", e.target.value)}
    style={inputStyle}
  />

<button
  onClick={
    editingBookId
      ? handleUpdateBook
      : handleSaveBook
  }
  className="action-btn save-btn"
>


    {editingBookId ? "Update Book" : "Save Book"}
  </button>
</div>
        {loading ? (
        <p>Loading books...</p>
      ) : books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <div className="books-grid">
  {books.map((book) => (
    <div
      key={book.id}
      className="book-card"
    >
            <h3>{book.title}</h3>
            <p><strong>Publisher:</strong> {book.publisher}</p>
            <p><strong>ISBN:</strong> {book.isbn || "N/A"}</p>
            <p><strong>Year:</strong> {book.year}</p>
            <p><strong>Pages:</strong> {book.pages || "N/A"}</p>

            <div className="btn-row">
  <button
    onClick={() => handleEditBook(book)}
    className="action-btn edit-btn"
  >
    Edit
  </button>

  <button
    onClick={() => handleDeleteBook(book.id)}
    className="action-btn delete-btn"
  >
    Delete
  </button>
</div>
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

  .books-grid {
    display: grid;
    grid-template-columns: repeat(
      auto-fit,
      minmax(260px, 1fr)
    );
    gap: 20px;
  }

  .book-card {
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

  .book-card:hover {
    transform: translateY(-5px);

    box-shadow:
      0 8px 20px
      rgba(0, 0, 0, 0.25);
  }

  .book-card h3 {
    margin-bottom: 12px;
    font-size: 20px;
  }

  .book-card p {
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

  .form-card input::placeholder {
    color: #666;
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
    margin-right: 10px;
  }

  .delete-btn {
    background: #2635dc;
  }

  .btn-row {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: 16px;
    flex-wrap: wrap;
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

export default BooksChaptersPage;