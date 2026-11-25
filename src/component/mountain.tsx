import { useState } from "preact/hooks";

export type Peak = { label: string; altitude: number; tier: string; note: string };

/**
 * Animated SVG mountain ridge: x = language, y = proficiency altitude (1..4).
 */
export function Mountain({
  tiers,
  peaks,
  animate,
}: {
  tiers: string[];
  peaks: Peak[];
  animate: boolean;
}) {
  const [active, setActive] = useState<Peak | null>(peaks[0] ?? null);

  const W = 820;
  const H = 220;
  const padL = 108;
  const padR = 28;
  const padT = 34;
  const padB = 34;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const maxAlt = Math.max(4, tiers.length);

  const pts = peaks.map((p, i) => {
    const x = padL + (peaks.length > 1 ? (i / (peaks.length - 1)) * plotW : plotW / 2);
    const y = padT + plotH - (p.altitude / maxAlt) * plotH;
    return { ...p, x, y };
  });

  // Build an angular mountain ridge with small foothills at the edges
  const base = padT + plotH;
  const ridgePoints = [
    `${padL - 12},${base}`,
    ...pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`),
    `${W - padR + 12},${base}`,
  ];
  const ridgeD = `M ${ridgePoints.join(" L ")}`;
  const areaD = `${ridgeD} L ${W - padR + 12},${base} L ${padL - 12},${base} Z`;

  return (
    <figure class="mtn" aria-label={peaks.map((p) => `${p.label}: ${p.tier}`).join(", ")}>
      <div class="mtn-scroll">
        <svg viewBox={`0 0 ${W} ${H}`} class="mtn-svg" role="img">
          <defs>
            <linearGradient id="mtn-stroke" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="var(--acc)" />
              <stop offset="100%" stop-color="var(--acc2)" />
            </linearGradient>
            <linearGradient id="mtn-area" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="var(--acc)" stop-opacity="0.32" />
              <stop offset="100%" stop-color="var(--acc2)" stop-opacity="0.02" />
            </linearGradient>
          </defs>

          {tiers.map((label, idx) => {
            const alt = idx + 1;
            const y = padT + plotH - (alt / maxAlt) * plotH;
            return (
              <g key={label}>
                <line x1={padL - 12} y1={y} x2={W - padR + 12} y2={y} class="mtn-grid" />
                <text x={padL - 18} y={y + 4} text-anchor="end" class="mtn-tier">
                  {label}
                </text>
              </g>
            );
          })}

          <path d={areaD} fill="url(#mtn-area)" class={animate ? "mtn-area anim" : "mtn-area"} />
          <path
            d={ridgeD}
            fill="none"
            stroke="url(#mtn-stroke)"
            stroke-width="2.5"
            stroke-linejoin="round"
            pathLength={1000}
            class={animate ? "mtn-ridge anim" : "mtn-ridge"}
          />

          {pts.map((p, i) => {
            const isSel = active?.label === p.label;
            return (
              <g
                key={p.label}
                class="mtn-pt"
                tabIndex={0}
                role="button"
                aria-label={`${p.label} (${p.tier}): ${p.note}`}
                onMouseEnter={() => setActive(p)}
                onFocus={() => setActive(p)}
                onClick={() => setActive(p)}
              >
                <title>{`${p.label} · ${p.tier} — ${p.note}`}</title>
                <line x1={p.x} y1={p.y} x2={p.x} y2={base} class="mtn-drop" />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isSel ? 6 : 4.5}
                  class={animate ? "mtn-dot anim" : "mtn-dot"}
                  style={animate ? { animationDelay: `${i * 75 + 250}ms` } : undefined}
                />
                <text
                  x={p.x}
                  y={p.y - 12}
                  text-anchor="middle"
                  class={isSel ? "mtn-lbl on" : "mtn-lbl"}
                  style={animate ? { animationDelay: `${i * 75 + 320}ms` } : undefined}
                >
                  {p.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {active && (
        <div class="mtn-info">
          <span class="mtn-name">{active.label}</span>
          <span class="dim"> · {active.tier} — {active.note}</span>
        </div>
      )}
    </figure>
  );
}
