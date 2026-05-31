import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Aurora from "../components/Aurora";
import { COLORS } from "../styles/theme";

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

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("access_token");

      const res = await axios.get(
        `${API_BASE}/users/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setUsers(res.data.results || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ padding: 40 }}>Loading users...</div>;
  }

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      <Aurora
        colorStops={["#8061fc", "#2500b7", "#000000", "#2200a8"]}
        amplitude={1}
        blend={0.5}
      />

      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            color: "#fff",
            marginBottom: 30,
            fontSize: 32,
          }}
        >
          Researchers
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(280px,1fr))",
            gap: 20,
          }}
        >
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => navigate(`/users/${user.id}`)}
              style={{
                background: CARD_BG,
                border: `1px solid ${BORDER}`,
                borderRadius: 14,
                padding: 20,
                cursor: "pointer",
                transition: "0.2s",
              }}
            >
              <div
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 10,
                  background: `linear-gradient(135deg, ${CRIMSON}, ${TEAL})`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 20,
                  marginBottom: 16,
                }}
              >
                {user.first_name?.[0]}
                {user.last_name?.[0]}
              </div>

              <h3
                style={{
                  margin: 0,
                  marginBottom: 6,
                }}
              >
                {user.full_name}
              </h3>

              <div
                style={{
                  color: TEAL,
                  fontSize: 14,
                  marginBottom: 4,
                }}
              >
                {user.designation || "Faculty"}
              </div>

              <div
                style={{
                  color: TEXT_MUTED,
                  fontSize: 13,
                  marginBottom: 10,
                }}
              >
                {user.department?.name}
              </div>

              <div
                style={{
                  color: TEXT_MUTED,
                  fontSize: 12,
                }}
              >
                {user.email}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UsersPage;