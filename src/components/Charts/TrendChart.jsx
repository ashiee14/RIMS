import { useState } from "react";

export function TrendChart({ data = [] }) {
  const [tooltip, setTooltip] = useState(null);

  if (!data.length) return null;

  const W   = 560;
  const H   = 220;
  const pad = { t: 20, b: 44, l: 44, r: 52 };
  const chartW = W - pad.l - pad.r;
  const chartH = H - pad.t - pad.b;

  const maxPubs = Math.max(...data.map((d) => d.count), 1);
  const maxPubY = Math.ceil(maxPubs / 100) * 100 || 100;

  const hasCitations = data.some((d) => d.citations != null && d.citations > 0);
  const maxCitRaw = hasCitations ? Math.max(...data.map((d) => d.citations ?? 0), 1) : 1;
  const maxCitY   = Math.ceil(maxCitRaw / 1000) * 1000 || 1000;

  // Slot-based x positioning — each bar gets its own slot, centered inside it
  const slotW    = chartW / data.length;
  const xPos     = (i) => pad.l + slotW * i + slotW / 2;
  const yPub     = (v) => pad.t + (1 - v / maxPubY)  * chartH;
  const yCit     = (v) => pad.t + (1 - v / maxCitY)  * chartH;
  const barWidth = slotW * 0.54;

  const pubTicks = Array.from({ length: 5 }, (_, i) => Math.round((i / 4) * maxPubY));
  const citTicks = hasCitations
    ? Array.from({ length: 5 }, (_, i) => Math.round((i / 4) * maxCitY)).filter((v) => v > 0)
    : [];

  const fmtK = (v) => v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v);

  function smoothPath(pts) {
    return pts
      .map((p, i, a) => {
        if (i === 0) return `M ${p.x},${p.y}`;
        const prev = a[i - 1];
        const cpx  = (p.x - prev.x) * 0.45;
        return `C ${prev.x + cpx},${prev.y} ${p.x - cpx},${p.y} ${p.x},${p.y}`;
      })
      .join(" ");
  }

  const citPts  = hasCitations ? data.map((d, i) => ({ x: xPos(i), y: yCit(d.citations ?? 0) })) : [];
  const citLine = citPts.length > 1 ? smoothPath(citPts) : "";
  const citArea = citPts.length > 1
    ? `${citLine} L ${citPts[citPts.length - 1].x},${H - pad.b} L ${citPts[0].x},${H - pad.b} Z`
    : "";

  const TT_W = hasCitations ? 152 : 120;
  const TT_H = hasCitations ? 62  : 44;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: "100%", height: "100%", minHeight: "200px", display: "block" }}
      onMouseLeave={() => setTooltip(null)}
    >
      <defs>
        <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#38bdf8" stopOpacity="0.92" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="barGradHov" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#7dd3fc" stopOpacity="1"    />
          <stop offset="100%" stopColor="#818cf8" stopOpacity="0.75" />
        </linearGradient>
        <linearGradient id="citAreaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#2dd4bf" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0"    />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {pubTicks.map((v) => (
        <line key={v} x1={pad.l} y1={yPub(v)} x2={W - pad.r} y2={yPub(v)}
          stroke="rgba(255,255,255,0.07)" strokeWidth="1"
          strokeDasharray={v === 0 ? "none" : "3 5"} />
      ))}

      {/* Left + baseline axes */}
      <line x1={pad.l} y1={pad.t}     x2={pad.l}     y2={H - pad.b} stroke="rgba(255,255,255,0.15)" />
      <line x1={pad.l} y1={H - pad.b} x2={W - pad.r} y2={H - pad.b} stroke="rgba(255,255,255,0.15)" />

      {/* Right axis (citations) */}
      {hasCitations && (
        <line x1={W - pad.r} y1={pad.t} x2={W - pad.r} y2={H - pad.b} stroke="rgba(45,212,191,0.22)" />
      )}

      {/* Left Y-axis labels */}
      {pubTicks.map((v) => (
        <text key={v} x={pad.l - 6} y={yPub(v) + 4} textAnchor="end" fontSize="9" fill="rgba(255,255,255,0.35)">
          {v}
        </text>
      ))}

      {/* Right Y-axis labels (citations) */}
      {citTicks.map((v) => (
        <text key={v} x={W - pad.r + 6} y={yCit(v) + 4} textAnchor="start" fontSize="9" fill="rgba(45,212,191,0.5)">
          {fmtK(v)}
        </text>
      ))}

      {/* Bars */}
      {data.map((d, i) => {
        const bh    = Math.max(H - pad.b - yPub(d.count), 2);
        const by    = yPub(d.count);
        const isHov = tooltip?.i === i;
        const delay = `${i * 0.07}s`;
        return (
          <g key={i}>
            <rect
              x={xPos(i) - barWidth / 2} y={by}
              width={barWidth} height={bh}
              fill={isHov ? "url(#barGradHov)" : "url(#barGrad)"}
              rx={3}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setTooltip({ i, year: d.year, count: d.count, citations: d.citations ?? null })}
            >
              <animate attributeName="y"      from={H - pad.b} to={by} dur="0.6s" begin={delay} fill="freeze" calcMode="spline" keySplines="0.22 1 0.36 1" keyTimes="0;1" />
              <animate attributeName="height" from="0"         to={bh} dur="0.6s" begin={delay} fill="freeze" calcMode="spline" keySplines="0.22 1 0.36 1" keyTimes="0;1" />
            </rect>
            {isHov && (
              <text x={xPos(i)} y={Math.max(by - 6, 14)} textAnchor="middle" fontSize="9.5" fill="#fff"
                style={{ pointerEvents: "none" }}>
                {d.count}
              </text>
            )}
          </g>
        );
      })}

      {/* Citation area fill */}
      {citArea && <path d={citArea} fill="url(#citAreaGrad)" style={{ pointerEvents: "none" }} />}

      {/* Citation trend line */}
      {citLine && (
        <path d={citLine} stroke="#2dd4bf" strokeWidth="2.2" fill="none"
          strokeLinecap="round" strokeLinejoin="round"
          pathLength="1" strokeDasharray="1" strokeDashoffset="1"
          style={{ pointerEvents: "none" }}>
          <animate attributeName="stroke-dashoffset" from="1" to="0" dur="1.2s" begin="0.35s" fill="freeze"
            calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1" />
        </path>
      )}

      {/* Citation dots */}
      {citPts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="4"
          fill="#2dd4bf" stroke="rgba(12,8,24,0.85)" strokeWidth="1.5"
          style={{ pointerEvents: "none" }}>
          <animate attributeName="opacity" from="0" to="1" dur="0.25s" begin={`${0.8 + i * 0.07}s`} fill="freeze" />
          <animate attributeName="r"       from="0" to="4"   dur="0.25s" begin={`${0.8 + i * 0.07}s`} fill="freeze" />
        </circle>
      ))}

      {/* X-axis year labels */}
      {data.map((d, i) => (
        <text key={i} x={xPos(i)} y={H - pad.b + 13} textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.38)">
          {d.year}
        </text>
      ))}

      {/* Legend */}
      <g transform={`translate(${pad.l}, ${H - 10})`}>
        <rect x="0" y="-8" width="10" height="10" fill="#38bdf8" rx="2" opacity="0.85" />
        <text x="14" y="0" fontSize="9.5" fill="rgba(255,255,255,0.5)">Publications</text>
        {hasCitations && (
          <>
            <line x1="102" y1="-3" x2="116" y2="-3" stroke="#2dd4bf" strokeWidth="2" />
            <circle cx="109" cy="-3" r="3" fill="#2dd4bf" />
            <text x="122" y="0" fontSize="9.5" fill="rgba(45,212,191,0.65)">Citations (right axis)</text>
          </>
        )}
      </g>

      {/* Hover tooltip */}
      {tooltip && (() => {
        const bx  = xPos(tooltip.i);
        const tx  = Math.max(pad.l, Math.min(bx - TT_W / 2, W - pad.r - TT_W));
        const ty  = pad.t + 4;
        return (
          <g style={{ pointerEvents: "none" }}>
            <rect x={tx} y={ty} width={TT_W} height={TT_H} rx="8"
              fill="rgba(8,6,24,0.96)" stroke="rgba(139,92,246,0.35)" strokeWidth="1" />
            <text x={tx + 14} y={ty + 18} fontSize="12" fontWeight="600" fill="#fff">
              {tooltip.year}
            </text>
            <circle cx={tx + 14} cy={ty + 33} r="4" fill="#38bdf8" />
            <text x={tx + 24} y={ty + 37} fontSize="10.5" fill="rgba(255,255,255,0.7)">Publications</text>
            <text x={tx + TT_W - 12} y={ty + 37} textAnchor="end" fontSize="11" fontWeight="700" fill="#fff">
              {tooltip.count}
            </text>
            {tooltip.citations != null && (
              <>
                <circle cx={tx + 14} cy={ty + 51} r="4" fill="#2dd4bf" />
                <text x={tx + 24} y={ty + 55} fontSize="10.5" fill="rgba(255,255,255,0.7)">Citations</text>
                <text x={tx + TT_W - 12} y={ty + 55} textAnchor="end" fontSize="11" fontWeight="700" fill="#fff">
                  {tooltip.citations.toLocaleString()}
                </text>
              </>
            )}
          </g>
        );
      })()}
    </svg>
  );
}

export default TrendChart;
