import { useEffect, useState } from "react";

import { useParams, useNavigate } from "react-router-dom";

import Aurora from "../components/Aurora";

import { COLORS } from "../styles/theme";

import { fetchChapterById } from "../services/api";

const {
  crimson: CRIMSON,
  textMuted: TEXT_MUTED,
} = COLORS;

const ChapterDetailsPage = () => {

  const { id } = useParams();

  const navigate = useNavigate();

  const [chapter, setChapter] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const loadChapter = async () => {

      try {

        const data =
          await fetchChapterById(id);

        console.log(
          "CHAPTER DETAILS:",
          data
        );

        setChapter(data);

      } catch (error) {

        console.error(
          "CHAPTER FETCH ERROR:",
          error
        );

      } finally {

        setLoading(false);
      }
    };

    loadChapter();

  }, [id]);

  if (loading) {
    return <p>Loading chapter...</p>;
  }

  if (!chapter) {
    return <p>Chapter not found.</p>;
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
        onClick={() => navigate(`/books/${chapter.book_id || ""}`)}
        className="back-btn"
        >
        ← Back
        </button>

        <h1 style={{ color: CRIMSON }}>
          {chapter.title}
        </h1>

        <p style={{ color: TEXT_MUTED }}>
          Chapter Number:
          {" "}
          {chapter.chapter_number}
        </p>

        <p>
          Start Page:
          {" "}
          {chapter.start_page || "N/A"}
        </p>

        <p>
          End Page:
          {" "}
          {chapter.end_page || "N/A"}
        </p>

        <div className="content-box">
          <h3>Content</h3>

          <p>
            {chapter.content || "No content available."}
          </p>
        </div>

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
          max-width: 900px;
          margin: auto;
          padding: 30px;
          color: white;
        }

        .back-btn {
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          color: white;
          font-weight: bold;
          background: #444;
          margin-bottom: 20px;
        }

        .content-box {
          margin-top: 30px;

          background: rgba(255,255,255,0.12);

          backdrop-filter: blur(12px);

          border-radius: 12px;

          padding: 20px;
        }

      `}</style>

    </div>
  );
};

export default ChapterDetailsPage;