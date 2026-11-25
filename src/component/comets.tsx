import { useEffect, useRef } from "preact/hooks";

type Comet = { x: number; y: number; v: number; len: number; w: number; life: number };

/**
 * Occasional comets streaking down-right at 45°.
 * Head/tail use the --acc → --acc2 gradient, so they follow the accent.
 */
export function Comets({ ...props }: Record<string, unknown>) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");

    let W = 0;
    let H = 0;
    let c1 = "34,201,126";
    let c2 = "96,165,250";
    let k = 1;
    let raf = 0;
    let last = 0;
    let next = 600;
    const comets: Comet[] = [];

    const rgb = (v: string) => {
      let h = v.trim().replace("#", "");
      if (h.length === 3) h = h.replace(/./g, "$&$&");
      return h.length === 6 ? [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(",") : null;
    };
    const colours = () => {
      const cs = getComputedStyle(document.documentElement);
      c1 = rgb(cs.getPropertyValue("--acc")) ?? c1;
      c2 = rgb(cs.getPropertyValue("--acc2")) ?? c2;
      k = cs.colorScheme.includes("light") ? 1.4 : 1;
    };
    const resize = () => {
      W = canvas.clientWidth;
      H = canvas.clientHeight;
      const d = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * d);
      canvas.height = Math.round(H * d);
      ctx.setTransform(d, 0, 0, d, 0, 0);
    };

    const spawn = () => {
      // start on the top edge or the left edge so the whole path crosses the screen
      const fromTop = Math.random() < W / (W + H);
      const len = 90 + Math.random() * 130;
      comets.push({
        x: fromTop ? Math.random() * W : -len,
        y: fromTop ? -len : Math.random() * H * 0.7,
        v: 5 + Math.random() * 4,
        len,
        w: 1 + Math.random() * 1.2,
        life: 1,
      });
    };

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (document.hidden || reduced.matches) return;
      const dt = Math.min((t - last) / 16.7, 3);
      last = t;
      next -= dt * 16.7;
      if (next <= 0 && comets.length < 3) {
        spawn();
        next = 1800 + Math.random() * 3800;
      }
      ctx.clearRect(0, 0, W, H);
      for (let i = comets.length - 1; i >= 0; i--) {
        const c = comets[i];
        const s = c.v * dt * Math.SQRT1_2; // 45°: equal x/y step
        c.x += s;
        c.y += s;
        if (c.x - c.len > W || c.y - c.len > H) {
          comets.splice(i, 1);
          continue;
        }
        const tx = c.x - c.len * Math.SQRT1_2;
        const ty = c.y - c.len * Math.SQRT1_2;
        const g = ctx.createLinearGradient(tx, ty, c.x, c.y);
        g.addColorStop(0, `rgba(${c2},0)`);
        g.addColorStop(1, `rgba(${c1},${(0.75 * k).toFixed(2)})`);
        ctx.strokeStyle = g;
        ctx.lineWidth = c.w;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(c.x, c.y);
        ctx.stroke();
        ctx.fillStyle = `rgba(${c1},${Math.min(1, 0.95 * k).toFixed(2)})`;
        ctx.shadowColor = `rgba(${c1},0.9)`;
        ctx.shadowBlur = 10;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.w + 0.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    colours();
    resize();
    raf = requestAnimationFrame(tick);
    const ro = new MutationObserver(colours);
    ro.observe(document.documentElement, { attributes: true });
    addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      removeEventListener("resize", resize);
    };
  }, []);

  return <canvas aria-hidden="true" {...props} ref={ref} />;
}
