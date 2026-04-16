import { COLORS } from "../../styles/theme";

export function DonutLegend({ data = [], fontSize = 10 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {data.map((d) => (
        <div key={d.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: d.color, flexShrink: 0 }} />
          <span style={{ fontSize, color: COLORS.textMuted }}>{d.label}:</span>
          <span style={{ fontSize, fontWeight: 600 }}>{d.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
}

export default DonutLegend;