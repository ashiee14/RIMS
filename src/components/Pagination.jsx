const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (!totalPages || totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    const delta = 2;
    const left = Math.max(1, currentPage - delta);
    const right = Math.min(totalPages, currentPage + delta);

    if (left > 1) { pages.push(1); if (left > 2) pages.push("..."); }
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages) { if (right < totalPages - 1) pages.push("..."); pages.push(totalPages); }
    return pages;
  };

  const btnStyle = (active) => ({
    padding: "6px 12px",
    borderRadius: 8,
    border: active ? "1px solid rgba(255,255,255,0.6)" : "1px solid rgba(255,255,255,0.15)",
    background: active ? "rgba(255,255,255,0.15)" : "transparent",
    color: "#fff",
    fontSize: 13,
    cursor: "pointer",
    fontWeight: active ? 600 : 400,
    opacity: 1,
    minWidth: 36,
  });

  const arrowStyle = (disabled) => ({
    ...btnStyle(false),
    opacity: disabled ? 0.3 : 1,
    cursor: disabled ? "not-allowed" : "pointer",
  });

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, padding: "28px 0 16px" }}>
      <button style={arrowStyle(currentPage === 1)} disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>←</button>
      {getPages().map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} style={{ color: "rgba(255,255,255,0.4)", padding: "0 4px" }}>…</span>
        ) : (
          <button key={p} style={btnStyle(p === currentPage)} onClick={() => onPageChange(p)}>{p}</button>
        )
      )}
      <button style={arrowStyle(currentPage === totalPages)} disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>→</button>
    </div>
  );
};

export default Pagination;
