export function DonutChart({ data = [], size = 110, innerFill = "transparent", innerRatio = 0.27 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return null;

  let cum = 0;
  const cx = size / 2, cy = size / 2;
  const r  = size * 0.44;
  const ir = size * innerRatio;

  const slices = data.map((d) => {
    const start = (cum / total) * 360;
    const angle = (d.value / total) * 360;
    cum += d.value;

    const startRad = (start - 90) * (Math.PI / 180);
    const endRad   = (start + angle - 90) * (Math.PI / 180);

    const x1 = cx + r  * Math.cos(startRad), y1 = cy + r  * Math.sin(startRad);
    const x2 = cx + r  * Math.cos(endRad),   y2 = cy + r  * Math.sin(endRad);
    const ix1 = cx + ir * Math.cos(startRad), iy1 = cy + ir * Math.sin(startRad);
    const ix2 = cx + ir * Math.cos(endRad),   iy2 = cy + ir * Math.sin(endRad);
    const large = angle > 180 ? 1 : 0;

    return {
      ...d,
      path: `M${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} L${ix2},${iy2} A${ir},${ir} 0 ${large},0 ${ix1},${iy1} Z`,
    };
  });

  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      {slices.map((s, i) => (
        <path key={i} d={s.path} fill={s.color} opacity={0.92}>
          <title>{s.label}: {s.value}</title>
        </path>
      ))}
      <circle cx={cx} cy={cy} r={ir - 1} fill={innerFill} />
    </svg>
  );
}

export default DonutChart;