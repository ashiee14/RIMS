import { useState, useEffect } from "react";

const ViewerToast = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => {
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
    };
    window.addEventListener("rims:403", handler);
    return () => window.removeEventListener("rims:403", handler);
  }, []);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: "50%",
        transform: "translateX(-50%)",
        background: "#1e1e2e",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 500,
        zIndex: 99999,
        boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
        border: "1px solid rgba(255,255,255,0.12)",
        whiteSpace: "nowrap",
        pointerEvents: "none",
      }}
    >
      Your account is view-only. Link your ORCID to access this feature.
    </div>
  );
};

export default ViewerToast;
