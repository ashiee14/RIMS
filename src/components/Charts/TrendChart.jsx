import { COLORS } from "../../styles/theme";

export function TrendChart({ data = [] }) {
  if (!data.length) return null;

  const W = 500;
  const H = 180;

  const pad = {
    t: 30,
    b: 30,
    l: 55,
    r: 30,
  };

  // Publication counts
  const maxVal = Math.max(
    ...data.map((d) => d.count),
    1
  );

  const maxY =
    Math.ceil(maxVal / 100) * 100 || 100;

  const xOffset =15;

  const xPos = (i) =>
    pad.l +
    xOffset +
    (i / (data.length - 1)) *
      (W - pad.l - pad.r - xOffset);

  const yPos = (v) =>
    pad.t +
    (1 - v / maxY) *
      (H - pad.t - pad.b);
  
  const barWidth =
    (W - pad.l - pad.r) /
    (data.length + 1) *0.5;

  const yTicks = Array.from(
    { length: 5 },
    (_, i) => Math.round((i / 4) * maxY)
  );

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{
        width: "100%",
        minHeight: "260px",
        display: "block",
      }}
    >
      {/*grid lines */}
      {yTicks.map((v) => (
        <line
          key={v}
          x1={pad.l}
          y1={yPos(v)}
          x2={W - pad.r}
          y2={yPos(v)}
          stroke="rgba(255,255,255,0.15)"
          strokeWidth="1"
        />
      ))}

      {/* Y Axis */}
        <line
          x1={pad.l}
          y1={pad.t}
          x2={pad.l}
          y2={H - pad.b}
          stroke="rgba(255,255,255,0.4)"
        />

        {/* X Axis */}
        <line
          x1={pad.l}
          y1={H - pad.b}
          x2={W - pad.r}
          y2={H - pad.b}
          stroke="rgba(255,255,255,0.4)"
        />


      {/* Bars */}
      {data.map((d, i) => (
        <g key={i}>
          <rect
            x={xPos(i) - barWidth / 2}
            y={yPos(d.count)}
            width={barWidth}
            height={
              H -
              pad.b -
              yPos(d.count)
            }
            fill={COLORS.crimson}
            opacity={0.8}
            rx={3}
          />

          {/* Value above bar */}
          <text
            x={xPos(i)}
            y={Math.max(yPos(d.count) - 8, 18)}
            textAnchor="middle"
            fontSize="10"
            fill="#fff"
          >
            {d.count}
          </text>
        </g>
      ))}

      {/* X-axis labels */}
      {data.map((d, i) => (
        <text
          key={i}
          x={xPos(i)}
          y={H - 8}
          textAnchor="middle"
          fontSize="10"
          fill={COLORS.textHint}
        >
          {d.year}
        </text>
      ))}

      {/* Y-axis labels */}
      {yTicks.map((v) => (
        <text
          key={v}
          x={pad.l - 4}
          y={yPos(v) + 3}
          textAnchor="end"
          fontSize="10"
          fill={COLORS.textHint}
        >
          {v}
        </text>
      ))}
    </svg>
  );
}

export default TrendChart;