import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Aurora from "../components/Aurora";
import Pagination from "../components/Pagination";
import { COLORS, FONT } from "../styles/theme";

const {
  crimson: CRIMSON,
  teal: TEAL,
  border: BORDER,
  textMuted: TEXT_MUTED,
  cardBg: CARD_BG,
} = COLORS;

const API_BASE = import.meta.env.VITE_API_URL;

const UsersPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const res = await axios.get(`${API_BASE}/users/`, {
        headers: { Authorization: `Bearer ${token}` },
        params: { page: currentPage },
      });
      setUsers(res.data.results || []);
      setTotalPages(res.data.total_pages || 1);
      setTotalCount(res.data.count || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100%", overflow: "hidden" }}>
      <Aurora
        colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
        amplitude={1}
        blend={0.5}
      />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto", padding: "clamp(16px, 3vw, 28px)", color: "#fff" }}>
        <h1 style={{
          color: "#fff",
          textShadow: "0 2px 2px CRIMSON",
          fontFamily: FONT?.serif,
          fontSize: "clamp(28px, 4vw, 40px)",
          fontWeight: 400,
          marginBottom: 6,
        }}>
          Researchers
        </h1>
        <p style={{ color: TEXT_MUTED, marginBottom: 28 }}>
          {loading ? "Loading..." : `${totalCount.toLocaleString()} registered researchers`}
        </p>

        {loading ? (
          <p style={{ color: TEXT_MUTED }}>Loading researchers...</p>
        ) : users.length === 0 ? (
          <p style={{ color: TEXT_MUTED }}>No researchers found.</p>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 240px))",
            gap: 16,
            justifyContent: "center",
          }}>
            {users.map((user) => {
              const cleanName = [user.first_name, user.last_name]
                .filter(p => p && p.toLowerCase() !== "unknown")
                .join(" ")
                .toUpperCase();
              const initials = [user.first_name, user.last_name]
                .filter(p => p && p.toLowerCase() !== "unknown")
                .map(p => p[0].toUpperCase())
                .join("");
              return (
              <div
                key={user.id}
                onClick={() => navigate(`/users/${user.id}`)}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: `1px solid ${BORDER}`,
                  borderRadius: 14,
                  padding: 20,
                  cursor: "pointer",
                  transition: "border-color 0.2s, transform 0.15s",
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 160,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = TEAL;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = BORDER;
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 10,
                  background: `linear-gradient(135deg, ${CRIMSON}, ${TEAL})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 16,
                  marginBottom: 12,
                  flexShrink: 0,
                }}>
                  {initials}
                </div>

                <h3 style={{ margin: 0, marginBottom: 4, fontSize: 14, color: "#fff", letterSpacing: "0.04em", lineHeight: 1.3 }}>
                  {cleanName}
                </h3>

                <div style={{ color: TEAL, fontSize: 12, marginBottom: 4 }}>
                  {user.designation || user.role?.charAt(0).toUpperCase() + user.role?.slice(1) || "Faculty"}
                </div>

                {user.department?.name && (
                  <div style={{ color: TEXT_MUTED, fontSize: 11, marginBottom: 4 }}>
                    {user.department.name}
                  </div>
                )}

                <div style={{ flex: 1 }} />

                {user.publications_count > 0 && (
                  <div style={{
                    marginTop: 8,
                    display: "inline-block",
                    background: "rgba(167,139,250,0.12)",
                    border: "1px solid rgba(167,139,250,0.25)",
                    borderRadius: 6,
                    padding: "3px 8px",
                    fontSize: 11,
                    color: "#a78bfa",
                  }}>
                    {user.publications_count} publications
                  </div>
                )}
              </div>
              );
            })}

          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(p) => { setCurrentPage(p); window.scrollTo(0, 0); }}
        />
      </div>
    </div>
  );
};

export default UsersPage;
