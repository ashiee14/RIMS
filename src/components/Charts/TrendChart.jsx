import { COLORS } from "../../styles/theme";

export function TrendChart({ data = [] }) {
  if (!data.length) return null;

  const W = 500, H = 180;
  const pad = { t: 10, b: 30, l: 40, r: 10 };

  const allVals = data.flatMap((d) => [d.indexedPubs, d.crossrefCitations, d.scopusCitations]);
  const maxVal  = Math.max(...allVals, 1);
  const maxY    = Math.ceil(maxVal / 100) * 100 || 100;

  const xPos = (i) => pad.l + (i / (data.length - 1)) * (W - pad.l - pad.r);
  const yPos = (v) => pad.t + (1 - v / maxY) * (H - pad.t - pad.b);
  const bw   = (W - pad.l - pad.r) / (data.length + 1);

  const pts1 = data.map((d, i) => `${xPos(i)},${yPos(d.crossrefCitations)}`).join(" ");
  const pts2 = data.map((d, i) => `${xPos(i)},${yPos(d.scopusCitations)}`).join(" ");

  const yTicks = Array.from({ length: 5 }, (_, i) => Math.round((i / 4) * maxY));

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto" }}>
      {/* Bars */}
      {data.map((d, i) => (
        <rect
          key={i}
          x={xPos(i) - bw / 2}
          y={yPos(d.indexedPubs)}
          width={bw}
          height={H - pad.b - yPos(d.indexedPubs)}
          fill={COLORS.crimson}
          opacity={0.7}
          rx={2}
        >
          <title>{d.year}: {d.indexedPubs} indexed pubs</title>
        </rect>
      ))}

      {/* Crossref line */}
      <polyline points={pts1} fill="none" stroke={COLORS.teal} strokeWidth="2" strokeLinejoin="round"/>

      {/* Scopus line */}
      <polyline points={pts2} fill="none" stroke={COLORS.gold} strokeWidth="2" strokeLinejoin="round"/>

      {/* X-axis labels */}
      {data.map((d, i) => (
        <text key={i} x={xPos(i)} y={H - 8} textAnchor="middle" fontSize="10" fill={COLORS.textHint}>
          {d.year}
        </text>
      ))}

      {/* Y-axis labels */}
      {yTicks.map((v) => (
        <text key={v} x={pad.l - 4} y={yPos(v) + 3} textAnchor="end" fontSize="10" fill={COLORS.textHint}>
          {v}
        </text>
      ))}
    </svg>
  );
}

export default TrendChart;