// src/components/Navbar.jsx
import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { COLORS } from "../styles/theme";
import { useAuth } from "../contexts/AuthContext";

const {
  crimson: CRIMSON,
  teal: TEAL,
  border: BORDER,
  text: TEXT,
} = COLORS;

/* ─── Icons ─────────────────────────────────────────── */

export const Logo = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
      fill={CRIMSON}
      opacity="0.15"
    />
    <path
      d="M12 6v12M6 12h12M8.5 8.5l7 7M15.5 8.5l-7 7"
      stroke={CRIMSON}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const ChevronDown = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export const UserIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <path d="M12 11a4 4 0 100-8 4 4 0 000 8z" />
  </svg>
);

/* ─── Dropdown Component ────────────────────────────── */

const Dropdown = ({ label, icon, items, color = "outline", align="left" }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const styles = {
    outline: {
      background: "rgba(255,255,255,0.15)",
      border: `1px solid ${BORDER}`,
      color: TEXT,
    },
    crimson: {
      background: CRIMSON,
      border: `1px solid ${CRIMSON}`,
      color: "#fff",
    },
    teal: {
      background: TEAL,
      border: `1px solid ${TEAL}`,
      color: "#fff",
    },
    dark: {
      background: "#111",
      border: "1px solid #111",
      color: "#fff",
    },
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "7px 13px",
          borderRadius: 8,
          fontSize: 13,
          fontWeight: 500,
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          cursor: "pointer",
          ...styles[color],
        }}
      >
        {icon}
        {label}
        <ChevronDown />
      </button>

      {open && (
        <div
        style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: align === "right" ? "auto" : 0,
            right: align === "right" ? 0 : "auto",
            zIndex: 999,
            background: "rgba(255,255,255,0.95)",
            border: `1px solid ${BORDER}`,
            borderRadius: 10,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
            minWidth: 180,
            overflow: "hidden",
        }}
        >
          {items.map((item, i) =>
            item.path ? (
              <Link
                key={i}
                to={item.path}
                onClick={() => setOpen(false)}
                style={{
                  display: "block",
                  padding: "10px 16px",
                  fontSize: 13,
                  textDecoration: "none",
                  color: TEXT,
                  borderBottom:
                    i < items.length - 1
                      ? `1px solid ${BORDER}`
                      : "none",
                }}
              >
                {item.icon} {item.label}
              </Link>
            ) : (
              <div
                key={i}
                onClick={() => {
                  item.onClick?.();
                  setOpen(false);
                }}
                style={{
                  padding: "10px 16px",
                  fontSize: 13,
                  cursor: "pointer",
                  borderBottom:
                    i < items.length - 1
                      ? `1px solid ${BORDER}`
                      : "none",
                }}
              >
                {item.icon} {item.label}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

/* ─── Navbar Component ─────────────────────────────── */

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const isViewer = role === "viewer";
  const navigate = useNavigate();
  const toolItems = [
  { label: "SDG Tagger", path: "/sdg-tagger" },
  { label: "Journal Checker", path: "/journal-checker" },
  { label: "Research Analytics", path: "/research-analytics" },
  { label: "More Features", path: "/more-features" },
];

  const viewItems = [
  { label: "Publications", path: "/publications" },
  { label: "Awards", path: "/awards" },
  { label: "IPR", path: "/ipr" },
  { label: "Books/Chapters", path: "/books-chapters" },
  { label: "Research Projects", path: "/research" },
  { label: "Events", path: "/events" },
];

  const addItems = [
    { label: "Add Publication", path: "/add-publication" },
    { label: "Add IPR", path: "/add-ipr" },
    { label: "Add Award", path: "/add-awards" },
    { label: "Add Event", path: "/add-event" },
    { label: "Add Book/Chapter", path: "/add-book" },
    { label: "Add Research Project", path: "/add-research-project" },
  ];

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 20px",
        height: 60,
        background: "rgba(255, 255, 255, 0.15)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.2)",
      }}
    >
      {/* Logo */}
      <Link
        to="/dashboard"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          textDecoration: "none",
        }}
      >
        <Logo size={26} />
        <span
          style={{
            fontWeight: 700,
            fontSize: 15,
            color: CRIMSON,
          }}
        >
          RIMS
        </span>
      </Link>

      <div style={{ flex: 1 }} />

      {/* Dropdowns */}
      <Dropdown label="Research Tools" color="teal" items={toolItems} />
      <Dropdown label="View Research" items={viewItems} />
      {!isViewer && <Dropdown label="Add Research" color="crimson" items={addItems} />}
      <Dropdown
        label={user?.name || "User"}
        color="dark"
        align="right"
        icon={<UserIcon />}
        items={[
            { label: "My Profile", path: "/user-profile" },
            ...(!isViewer ? [{ label: "Admin Panel", path: "/admin" }] : []),
            { label: "Sign Out", onClick: () => { logout(); navigate('/'); } },
        ]}
        />
    </nav>
  );
}