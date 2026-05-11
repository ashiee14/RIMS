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
      const token = localStorage.getItem("access");

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

    const token = localStorage.getItem("access");

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
    const token = localStorage.getItem("access");

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
    const token = localStorage.getItem("access");

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

<div
  style={{
    background: CARD_BG,
    border: `1px solid ${BORDER}`,
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 20,
  }}
>
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
    style={{
      marginTop: 12,
      padding: "10px 18px",
      border: "none",
      borderRadius: 8,
      background: CRIMSON,
      color: "#fff",
      cursor: "pointer",
    }}
  >
    {editingBookId ? "Update Book" : "Save Book"}s
  </button>
</div>
        {loading ? (
        <p>Loading books...</p>
      ) : books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        books.map((book) => (
          <div
            key={book.id}
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
            <p><strong>ISBN:</strong> {book.isbn || "N/A"}</p>
            <p><strong>Year:</strong> {book.year}</p>
            <p><strong>Pages:</strong> {book.pages || "N/A"}</p>

            <button
  onClick={() => handleEditBook(book)}
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
  onClick={() => handleDeleteBook(book.id)}
  style={{
    marginTop: 10,
    padding: "8px 14px",
    border: "none",
    borderRadius: 8,
    background: "#2635dc",
    color: "#fff",
    cursor: "pointer",
  }}
>
  Delete
</button>
          </div>
        )))}
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