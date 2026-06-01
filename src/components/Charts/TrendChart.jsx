export function TrendChart({ data = [] }) {
  if (!data.length) return null;

  const W = 500;
  const H = 180;
  const pad = { t: 30, b: 30, l: 55, r: 20 };

  const maxVal = Math.max(...data.map((d) => d.count), 1);
  const maxY = Math.ceil(maxVal / 100) * 100 || 100;

  const xOffset = 15;
  const xPos = (i) =>
    pad.l + xOffset + (i / (data.length - 1)) * (W - pad.l - pad.r - xOffset);
  const yPos = (v) => pad.t + (1 - v / maxY) * (H - pad.t - pad.b);
  const barWidth = ((W - pad.l - pad.r) / (data.length + 1)) * 0.55;
  const yTicks = Array.from({ length: 5 }, (_, i) => Math.round((i / 4) * maxY));

  const chartH = H - pad.t - pad.b;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", minHeight: "260px", display: "block" }}>
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#38bdf8" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="barGradHover" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#7dd3fc" stopOpacity="1" />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0.9" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {yTicks.map((v) => (
        <line
          key={v}
          x1={pad.l} y1={yPos(v)}
          x2={W - pad.r} y2={yPos(v)}
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="1"
          strokeDasharray={v === 0 ? "none" : "4 4"}
        />
      ))}

      {/* Axes */}
      <line x1={pad.l} y1={pad.t} x2={pad.l} y2={H - pad.b} stroke="rgba(255,255,255,0.18)" />
      <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke="rgba(255,255,255,0.18)" />

      {/* Bars with grow animation */}
      {data.map((d, i) => {
        const bh = Math.max(H - pad.b - yPos(d.count), 2);
        const by = yPos(d.count);
        const delay = `${i * 0.08}s`;
        return (
          <g key={i}>
            <rect
              x={xPos(i) - barWidth / 2}
              y={by}
              width={barWidth}
              height={bh}
              fill="url(#barGrad)"
              rx={3}
            >
              <animate attributeName="y"      from={H - pad.b} to={by} dur="0.65s" begin={delay} fill="freeze" calcMode="spline" keySplines="0.22 1 0.36 1" keyTimes="0;1" />
              <animate attributeName="height" from={0}         to={bh} dur="0.65s" begin={delay} fill="freeze" calcMode="spline" keySplines="0.22 1 0.36 1" keyTimes="0;1" />
              <animate attributeName="opacity" from={0} to={1} dur="0.3s" begin={delay} fill="freeze" />
            </rect>
            {/* Value label */}
            <text
              x={xPos(i)}
              y={Math.max(by - 7, 18)}
              textAnchor="middle"
              fontSize="10"
              fill="rgba(255,255,255,0.75)"
            >
              <animate attributeName="opacity" from={0} to={1} dur="0.3s" begin={`${parseFloat(delay) + 0.5}s`} fill="freeze" />
              {d.count}
            </text>
          </g>
        );
      })}

      {/* X-axis labels */}
      {data.map((d, i) => (
        <text key={i} x={xPos(i)} y={H - 8} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.42)">
          {d.year}
        </text>
      ))}

      {/* Y-axis labels */}
      {yTicks.map((v) => (
        <text key={v} x={pad.l - 6} y={yPos(v) + 4} textAnchor="end" fontSize="10" fill="rgba(255,255,255,0.38)">
          {v}
        </text>
      ))}
    </svg>
  );
}

export default TrendChart;
