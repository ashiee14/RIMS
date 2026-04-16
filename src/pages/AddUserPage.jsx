import { useState } from "react";
import { COLORS } from "../styles/theme";
import { UserIcon } from "../components/Navbar";

const {
  crimson: CRIMSON,
  teal: TEAL,
  border: BORDER,
  text: TEXT,
  textMuted: TEXT_MUTED,
  textHint: TEXT_HINT,
  lightBg: LIGHT_BG,
  cardBg: CARD_BG,
} = COLORS;

const AddUserPage = () => {
  const [fields, setFields] = useState({
    password: "",
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    access: "Yes",
    superuser: false,
  });

  const update = (k, v) =>
    setFields((p) => ({ ...p, [k]: v }));

  const inputStyle = {
    width: "100%",
    padding: "9px 12px",
    border: `1px solid ${BORDER}`,
    borderRadius: 7,
    fontSize: 13,
    color: TEXT,
    background: "#fff",
    outline: "none",
  };

  return (
    <div style={{ maxWidth: 700, margin: "0 auto", padding: "28px 24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${BORDER}`,
          paddingBottom: 14,
          marginBottom: 10,
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 600 }}>Add User</h2>
        <UserIcon />
      </div>

      <div style={{ fontSize: 12, color: TEXT_MUTED, marginBottom: 20 }}>
        Home / Admin Panel / Add User
      </div>

      {/* Form content remains unchanged */}
    </div>
  );
};

export default AddUserPage;