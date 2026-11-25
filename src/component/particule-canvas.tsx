import { useEffect, useRef } from "preact/hooks";

type Particle = { x: number; y: number; vx: number; vy: number; r: number };

type ParticuleCanvasProps = {
  /** Max number of particles (scaled down on small screens). */
  count?: number;
  /** Desired particle size (max radius) */
  maxSize?: number;
  /** Animation speed multiplier (higher = faster) */
  speed?: number;
  [key: string]: unknown;
};

/**
 * Subtle fixed background: drifting dots joined by faint lines.
 * Colour follows the `--acc` CSS variable, so theme/accent changes apply live.
 */
export function ParticuleCanvas({
  count = 64,
  maxSize = 1,
  speed = 0.28,
  ...props
}: ParticuleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let W = 0;
    let H = 0;
    let rgb = "34,201,126";
    let k = 1; // alpha boost: light backgrounds need stronger strokes
    let raf = 0;
    let last = 0;
    const dots: Particle[] = [];

    const readColour = () => {
      const cs = getComputedStyle(document.documentElement);
      let h = cs.getPropertyValue("--acc").trim().replace("#", "");
      if (h.length === 3) h = h.replace(/./g, "$&$&");
      if (h.length === 6) {
        rgb = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)).join(",");
      }
      k = cs.colorScheme.includes("light") ? 1.6 : 1;
    };

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h || (w === W && h === H)) return;
      const sx = W ? w / W : 1;
      const sy = H ? h / H : 1;
      dots.forEach((d) => {
        d.x *= sx;
        d.y *= sy;
      });
      W = w;
      H = h;
      const dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.max(16, Math.min(count, Math.round((W * H) / 24000)));
      while (dots.length < n)
        dots.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          r: 1 + Math.random() * maxSize,
        });
      dots.length = n;
    };

    const draw = (dt: number) => {
      ctx.clearRect(0, 0, W, H);
      const reach = W < 700 ? 110 : 150;
      if (dt)
        for (const p of dots) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          if (p.x < -20) p.x = W + 20;
          else if (p.x > W + 20) p.x = -20;
          if (p.y < -20) p.y = H + 20;
          else if (p.y > H + 20) p.y = -20;
        }
      ctx.lineWidth = 1;
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < reach * reach) {
            const a = (1 - Math.sqrt(d2) / reach) * 0.16 * k;
            ctx.strokeStyle = `rgba(${rgb},${a.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.fillStyle = `rgba(${rgb},${(0.35 * k).toFixed(2)})`;
      for (const p of dots) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (document.hidden || reduced.matches || t - last < 33) return;
      const dt = Math.min((t - last) / 16.7, 3);
      last = t;
      draw(dt);
    };

    const onResize = () => {
      resize();
      if (reduced.matches) draw(0);
    };
    const observer = new MutationObserver(() => {
      readColour();
      if (reduced.matches) draw(0);
    });

    readColour();
    resize();
    draw(0);
    raf = requestAnimationFrame(tick);
    addEventListener("resize", onResize);
    observer.observe(document.documentElement, { attributes: true });

    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("resize", onResize);
      observer.disconnect();
    };
  }, [count, maxSize, speed]);

  return <canvas aria-hidden="true" {...props} ref={canvasRef} />;
}
