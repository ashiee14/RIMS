import { useState } from "react";

export function DonutChart({
  data          = [],
  size          = 110,
  height,                  // alias for size (IndexPage uses height=)
  innerFill     = "rgba(12,8,24,0.85)",
  innerRatio    = 0.27,
  centerValue,
  centerLabel   = "",
  showLegend    = false,
  defaultHidden = [],
}) {
  const sz = height ?? size;

  const [activeIdx, setActiveIdx] = useState(null);
  const [hidden,    setHidden]    = useState(() => new Set(defaultHidden));

  const visible = data.filter((d) => !hidden.has(d.label) && d.value > 0);
  const total   = centerValue ?? data.reduce((s, d) => s + d.value, 0);

  const toggle = (label) => {
    setHidden((prev) => {
      const next = new Set(prev);
      next.has(label) ? next.delete(label) : next.add(label);
      return next;
    });
    setActiveIdx(null);
  };

  if (!data.length || total === 0) return null;

  const cx = sz / 2, cy = sz / 2;
  const r  = sz * 0.44;
  const ir = sz * innerRatio;

  const visTotal = visible.reduce((s, x) => s + x.value, 0);
  let cum = 0;
  const slices = visible.map((d, i) => {
    const start    = (cum / visTotal) * 360;
    const angle    = (d.value / visTotal) * 360;
    cum += d.value;

    const startRad = (start - 90) * (Math.PI / 180);
    const endRad   = (start + angle - 90) * (Math.PI / 180);
    const large    = angle > 180 ? 1 : 0;

    const x1  = cx + r  * Math.cos(startRad), y1  = cy + r  * Math.sin(startRad);
    const x2  = cx + r  * Math.cos(endRad),   y2  = cy + r  * Math.sin(endRad);
    const ix1 = cx + ir * Math.cos(startRad), iy1 = cy + ir * Math.sin(startRad);
    const ix2 = cx + ir * Math.cos(endRad),   iy2 = cy + ir * Math.sin(endRad);

    return {
      ...d,
      path: `M${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} L${ix2},${iy2} A${ir},${ir} 0 ${large},0 ${ix1},${iy1} Z`,
      i,
    };
  });

  return (
    <div>
      {/* Donut */}
      <div style={{ position: "relative", width: sz, height: sz, margin: "0 auto" }}>
        <svg width={sz} height={sz} style={{ display: "block" }}>
          {slices.map((s) => (
            <path
              key={s.label}
              d={s.path}
              fill={s.color}
              opacity={activeIdx == null || activeIdx === s.i ? 0.92 : 0.45}
              style={{ cursor: "pointer", transition: "opacity 0.2s ease" }}
              onMouseEnter={() => setActiveIdx(s.i)}
              onMouseLeave={() => setActiveIdx(null)}
              onClick={() => toggle(s.label)}
            >
              <title>{s.label}: {s.value.toLocaleString()}</title>
            </path>
          ))}
          <circle cx={cx} cy={cy} r={ir - 1} fill={innerFill} />
        </svg>

        {/* Center text */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center", pointerEvents: "none",
        }}>
          <div style={{ fontSize: sz * 0.17, fontWeight: 800, color: "#fff", lineHeight: 1 }}>
            {activeIdx != null
              ? visible[activeIdx]?.value.toLocaleString()
              : total.toLocaleString()}
          </div>
          {centerLabel && (
            <div style={{
              fontSize: sz * 0.09, color: "rgba(255,255,255,0.4)",
              marginTop: 2, letterSpacing: "0.06em", textTransform: "uppercase",
            }}>
              {activeIdx != null ? visible[activeIdx]?.label : centerLabel}
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      {showLegend && data.length > 0 && (
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6px 8px",
          marginTop: 12,
          paddingTop: 12,
          borderTop: "1px solid rgba(255,255,255,0.07)",
        }}>
          {data.map((d) => {
            const off = hidden.has(d.label);
            const pct = total > 0 ? Math.round((d.value / total) * 100) : 0;
            return (
              <button
                key={d.label}
                onClick={() => toggle(d.label)}
                style={{
                  gridColumn: d.label === "None" ? "1 / -1" : "auto",
                  display: "flex", alignItems: "center", gap: 6,
                  background: "none", border: "none", cursor: "pointer",
                  padding: "4px 6px", borderRadius: 6, textAlign: "left",
                  opacity: off ? 0.38 : 1,
                  transition: "opacity 0.2s ease, background 0.2s ease",
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
              >
                <div style={{
                  width: 8, height: 8, borderRadius: 2, flexShrink: 0,
                  background: off ? "#444" : d.color,
                  boxShadow: off ? "none" : `0 0 5px ${d.color}77`,
                  transition: "background 0.2s, box-shadow 0.2s",
                }} />
                <span style={{ fontSize: 11, flexShrink: 0, color: off ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.62)" }}>
                  {d.label}
                </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#fff", marginLeft: "auto" }}>
                  {d.value.toLocaleString()}
                </span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.36)", flexShrink: 0, marginLeft: 4 }}>
                  {pct}%
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default DonutChart;
