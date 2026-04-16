import { COLORS } from "../../styles/theme";
export function MiniBarChart({ data = [], color = COLORS.crimson, height = 60 }) {
  const maxVal = Math.max(...data.map((d) => d.value), 1);
  const barH   = height - 16; // leave room for labels

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
          <div
            title={`${d.label}: ${d.value.toLocaleString()}`}
            style={{
              width: "100%", background: color,
              borderRadius: "3px 3px 0 0",
              height: `${(d.value / maxVal) * barH}px`,
              opacity: i === data.length - 1 ? 1 : 0.55,
              transition: "height 0.3s ease",
            }}
          />
          <div style={{ fontSize: 10, color: COLORS.textHint, whiteSpace: "nowrap" }}>{d.label}</div>
        </div>
      ))}
    </div>
  );
}