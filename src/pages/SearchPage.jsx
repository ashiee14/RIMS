import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Aurora from "../components/Aurora";
import { COLORS, FONT } from "../styles/theme";
import { searchPublications } from "../services/api";

const {
  crimson: CRIMSON,
  teal: TEAL,
  textMuted: TEXT_MUTED,
  textHint: TEXT_HINT,
} = COLORS;

const QUARTILE_COLORS = { Q1: "#B22222", Q2: "#1D6B5E", Q3: "#C8941A", Q4: "#4A90D9" };

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

const PubCard = ({ pub, onClick }) => (
  <div
    onClick={onClick}
    onMouseEnter={e => {
      e.currentTarget.style.background = "rgba(255,255,255,0.14)";
      e.currentTarget.style.transform = "translateY(-1px)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = "rgba(255,255,255,0.08)";
      e.currentTarget.style.transform = "none";
    }}
    style={{
      background: "rgba(255,255,255,0.08)",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 12,
      padding: "16px 20px",
      cursor: "pointer",
      transition: "background 0.15s, transform 0.15s",
    }}
  >
    <h3 style={{
      margin: "0 0 6px",
      color: "#fff",
      fontSize: 15,
      fontWeight: 600,
      fontFamily: FONT.sans,
      lineHeight: 1.45,
    }}>
      {pub.title}
    </h3>
    <p style={{ margin: "0 0 10px", color: TEXT_MUTED, fontSize: 13, lineHeight: 1.4 }}>
      {pub.author_names?.join(", ")}
      {pub.year ? ` · ${pub.year}` : ""}
      {pub.journal ? ` · ${pub.journal}` : ""}
    </p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {pub.quartile && (
        <span style={{
          background: QUARTILE_COLORS[pub.quartile] ?? "#555",
          color: "#fff",
          borderRadius: 4,
          padding: "2px 8px",
          fontSize: 11,
          fontWeight: 700,
        }}>
          {pub.quartile}
        </span>
      )}
      {pub.impact_factor && (
        <span style={{
          background: "rgba(255,255,255,0.1)",
          color: TEXT_MUTED,
          borderRadius: 4,
          padding: "2px 8px",
          fontSize: 11,
        }}>
          IF {pub.impact_factor}
        </span>
      )}
      {pub.publication_type && (
        <span style={{
          background: "rgba(255,255,255,0.07)",
          color: TEXT_HINT,
          borderRadius: 4,
          padding: "2px 8px",
          fontSize: 11,
          textTransform: "capitalize",
        }}>
          {pub.publication_type}
        </span>
      )}
    </div>
  </div>
);

const AuthorCard = ({ author, onClick }) => {
  const name     = author.full_name || `${author.first_name ?? ""} ${author.last_name ?? ""}`.trim() || "—";
  const initials = name.split(" ").map(w => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  const dept     = author.department_name || author.department?.name || "";

  return (
    <div
      onClick={onClick}
      onMouseEnter={e => {
        e.currentTarget.style.background = "rgba(255,255,255,0.14)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "rgba(255,255,255,0.08)";
        e.currentTarget.style.transform = "none";
      }}
      style={{
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 12,
        padding: "20px 16px",
        cursor: "pointer",
        textAlign: "center",
        transition: "background 0.15s, transform 0.15s",
      }}
    >
      {/* Avatar — photo if available, otherwise initials */}
      {author.photo ? (
        <img
          src={author.photo}
          alt={name}
          style={{
            width: 56, height: 56, borderRadius: "50%",
            objectFit: "cover", margin: "0 auto 12px", display: "block",
            border: "2px solid rgba(255,255,255,0.2)",
          }}
        />
      ) : (
        <div style={{
          width: 56, height: 56, borderRadius: "50%",
          background: `linear-gradient(135deg, ${CRIMSON}, ${TEAL})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 12px",
          fontSize: 20, fontWeight: 700, color: "#fff", flexShrink: 0,
        }}>
          {initials}
        </div>
      )}
      <p style={{ margin: "0 0 4px", color: "#fff", fontWeight: 600, fontSize: 14 }}>
        {name}
      </p>
      {author.designation && (
        <p style={{ margin: "0 0 3px", color: TEXT_MUTED, fontSize: 12 }}>
          {author.designation}
        </p>
      )}
      {dept && (
        <p style={{ margin: 0, color: TEXT_HINT, fontSize: 11 }}>
          {dept}
        </p>
      )}
    </div>
  );
};

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [type, setType] = useState(searchParams.get("type") || "publication");
  const [results, setResults] = useState({ authors: [], publications: [] });
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults({ authors: [], publications: [] });
      setLoading(false);
      setSearchParams(trimmed ? { q: trimmed, type } : { type }, { replace: true });
      return;
    }

    setLoading(true);
    setSearchParams({ q: trimmed, type }, { replace: true });

    debounceRef.current = setTimeout(async () => {
      try {
        const data = await searchPublications(trimmed, type);
        setResults(data);
      } catch {
        setResults({ authors: [], publications: [] });
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounceRef.current);
  }, [query, type]);

  const switchType = (newType) => {
    setType(newType);
    setResults({ authors: [], publications: [] });
    inputRef.current?.focus();
  };

  const items = type === "publication" ? results.publications : results.authors;
  const hasQuery = query.trim().length >= 2;

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Aurora
        colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
        amplitude={1}
        blend={0.5}
      />

      <div style={{
        position: "relative",
        zIndex: 1,
        maxWidth: 820,
        margin: "0 auto",
        padding: "clamp(24px, 4vw, 48px) clamp(16px, 3vw, 24px)",
        color: "#fff",
      }}>
        <h1 style={{
          fontFamily: FONT.serif,
          fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 400,
          margin: "0 0 6px",
          color: "#fff",
        }}>
          Search
        </h1>
        <p style={{ color: TEXT_MUTED, margin: "0 0 28px", fontSize: 15 }}>
          Find publications and researchers across RIMS
        </p>

        {/* ── Search bar + toggle ── */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 28 }}>

          {/* Input */}
          <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center" }}>
            <span style={{
              position: "absolute",
              left: 14,
              color: TEXT_HINT,
              pointerEvents: "none",
              display: "flex",
            }}>
              <SearchIcon />
            </span>
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={
                type === "publication"
                  ? "Search by title, topic, or keyword…"
                  : "Search researchers by name or designation…"
              }
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 10,
                padding: "12px 44px 12px 46px",
                color: "#fff",
                fontSize: 15,
                fontFamily: FONT.sans,
                outline: "none",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
                boxSizing: "border-box",
                transition: "border 0.15s, background 0.15s",
              }}
              onFocus={e => {
                e.target.style.border = `1px solid ${TEAL}`;
                e.target.style.background = "rgba(255,255,255,0.13)";
              }}
              onBlur={e => {
                e.target.style.border = "1px solid rgba(255,255,255,0.2)";
                e.target.style.background = "rgba(255,255,255,0.1)";
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                style={{
                  position: "absolute",
                  right: 12,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: TEXT_HINT,
                  display: "flex",
                  padding: 4,
                  borderRadius: 4,
                }}
              >
                <XIcon />
              </button>
            )}
          </div>

          {/* Segmented toggle */}
          <div style={{
            display: "flex",
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 10,
            padding: 3,
            flexShrink: 0,
          }}>
            {["publication", "author"].map(t => (
              <button
                key={t}
                onClick={() => switchType(t)}
                style={{
                  padding: "8px 14px",
                  borderRadius: 7,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                  fontWeight: 500,
                  fontFamily: FONT.sans,
                  transition: "background 0.15s, color 0.15s",
                  background: type === t ? CRIMSON : "transparent",
                  color: type === t ? "#fff" : TEXT_MUTED,
                  whiteSpace: "nowrap",
                }}
              >
                {t === "publication" ? "Publications" : "Authors"}
              </button>
            ))}
          </div>
        </div>

        {/* ── Results ── */}
        {!hasQuery ? (
          <p style={{ color: TEXT_HINT, textAlign: "center", padding: "48px 0", fontSize: 15 }}>
            Type at least 2 characters to search {type === "publication" ? "publications" : "researchers"}
          </p>
        ) : loading ? (
          <p style={{ color: TEXT_MUTED, textAlign: "center", padding: "48px 0", fontSize: 15 }}>
            Searching…
          </p>
        ) : items.length === 0 ? (
          <p style={{ color: TEXT_HINT, textAlign: "center", padding: "48px 0", fontSize: 15 }}>
            No {type === "publication" ? "publications" : "researchers"} found for &ldquo;{query}&rdquo;
          </p>
        ) : type === "publication" ? (
          <>
            <p style={{ color: TEXT_MUTED, fontSize: 13, margin: "0 0 12px" }}>
              {items.length} result{items.length !== 1 ? "s" : ""}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {items.map(pub => (
                <PubCard
                  key={pub.id}
                  pub={pub}
                  onClick={() => navigate(`/publications/${pub.id}`)}
                />
              ))}
            </div>
          </>
        ) : (
          <>
            <p style={{ color: TEXT_MUTED, fontSize: 13, margin: "0 0 12px" }}>
              {items.length} result{items.length !== 1 ? "s" : ""}
            </p>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
              gap: 12,
            }}>
              {items.map(author => (
                <AuthorCard
                  key={author.id}
                  author={author}
                  onClick={() => navigate(`/users/${author.id}`)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
