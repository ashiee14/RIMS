import { Link } from "react-router-dom";
import { COLORS } from "../styles/theme";

const { crimson: CRIMSON, border: BORDER, cardBg: CARD_BG } = COLORS;

const AdminPanel = () => {
  return (
    <div style={{ padding: "28px", maxWidth: 1000, margin: "0 auto" }}>
      <h1
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: 28,
          marginBottom: 20,
        }}
      >
        Admin Panel
      </h1>

      <div
        style={{
          background: CARD_BG,
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          padding: 20,
        }}
      >
        <h3>User Management</h3>
        <p>Add and manage system users.</p>

        <Link
          to="/admin/add-user"
          style={{
            display: "inline-block",
            marginTop: 10,
            background: CRIMSON,
            color: "#fff",
            padding: "10px 18px",
            borderRadius: 8,
            textDecoration: "none",
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          + Add User
        </Link>
      </div>
    </div>
  );
};

export default AdminPanel;