import { useEffect, useState } from "react";
import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  const [editForm, setEditForm] = useState({
      title: "",
      publisher: "",
      isbn: "",
      year: "",
      pages: "",
    });
  
useEffect(() => {
  const loadBooks = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("access_token");

      let allBooks = [];

      let nextUrl = "/api/books/";

      while (nextUrl) {
        const response = await fetch(nextUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        console.log("BOOK PAGE:", data);

        allBooks = [
          ...allBooks,
          ...(data.results || []),
        ];

        nextUrl = data.next
          ? data.next.replace(
              "http://",
              "https://"
            )
          : null;
      }

      const sortedBooks = allBooks.sort(
        (a, b) => b.id - a.id
      );

      setBooks(sortedBooks);

    } catch (error) {
      console.error("BOOKS ERROR:", error);

      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  loadBooks();
}, []);



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

  setEditForm({
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
      title: editForm.title,
      publisher: editForm.publisher,
      isbn: editForm.isbn,
      year: Number(editForm.year),
      pages: editForm.pages
        ? Number(editForm.pages)
        : null,
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

      setEditForm({
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

        <button
          onClick={() => navigate("/add-book")}
          className="action-btn save-btn"
          style={{ marginBottom: 24 }}
        >
          Add Book
        </button>

        {loading ? (
        <p>Loading books...</p>
      ) : books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <div className="books-grid">
            {books.map((book) => (
            <div key={book.id} className="book-card">

              {editingBookId === book.id ? (
                <>
                  <input
                    type="text"
                    placeholder="Book Title"
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        title: e.target.value,
                      })
                    }
                    style={inputStyle}
                  />

                  <input
                    type="text"
                    placeholder="Publisher"
                    value={editForm.publisher}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        publisher: e.target.value,
                      })
                    }
                    style={inputStyle}
                  />

                  <input
                    type="text"
                    placeholder="ISBN"
                    value={editForm.isbn}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        isbn: e.target.value,
                      })
                    }
                    style={inputStyle}
                  />

                  <input
                    type="number"
                    placeholder="Year"
                    value={editForm.year}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        year: e.target.value,
                      })
                    }
                    style={inputStyle}
                  />

                  <input
                    type="number"
                    placeholder="Pages"
                    value={editForm.pages}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        pages: e.target.value,
                      })
                    }
                    style={inputStyle}
                  />

                  <div className="btn-row">
                    <button
                      onClick={handleUpdateBook}
                      className="action-btn edit-btn"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingBookId(null)}
                      className="action-btn delete-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3>{book.title}</h3>

                  <p>
                    <strong>Publisher:</strong> {book.publisher}
                  </p>

                  <p>
                    <strong>ISBN:</strong> {book.isbn || "N/A"}
                  </p>

                  <p>
                    <strong>Year:</strong> {book.year}
                  </p>

                  <p>
                    <strong>Pages:</strong> {book.pages || "N/A"}
                  </p>

                  <div className="btn-row">
                    <button
                      onClick={() => navigate(`/books/${book.id}`)}
                      className="action-btn save-btn"
                    >
                      View
                    </button>
                    
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
                </>
              )}

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
          rgb(255, 255, 255);
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