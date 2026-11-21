import { useEffect, useId, useRef } from "preact/hooks";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
};

type ParticuleCanvasProps = {
  count?: number;
  maxSize?: number;
  speed?: number;
  className?: string;
} & Record<string, any>;

/**
 * Particle canvas that dynamically extracts and reflects the active --acc and --acc2 theme colors.
 */
export function ParticuleCanvas({
  count = 60,
  maxSize = 2,
  speed = 0.35,
  className = "fixed inset-0 pointer-events-none -z-10",
  ...props
}: ParticuleCanvasProps) {
  const targetId = useId();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let animId = 0;
    let colorAcc = [34, 201, 126]; // default fallback (green)
    let colorAcc2 = [96, 165, 250]; // default fallback (blue)
    let isDark = true;

    const parseHex = (hex: string): [number, number, number] => {
      let h = hex.trim().replace("#", "");
      if (h.length === 3) h = h.replace(/./g, "$&$&");
      if (h.length === 6) {
        return [
          parseInt(h.slice(0, 2), 16) || 0,
          parseInt(h.slice(2, 4), 16) || 0,
          parseInt(h.slice(4, 6), 16) || 0,
        ];
      }
      return [34, 201, 126];
    };

    const updateColors = () => {
      const cs = getComputedStyle(document.documentElement);
      const accHex = cs.getPropertyValue("--acc").trim();
      const acc2Hex = cs.getPropertyValue("--acc2").trim();
      if (accHex) colorAcc = parseHex(accHex);
      if (acc2Hex) colorAcc2 = parseHex(acc2Hex);
      isDark = cs.colorScheme === "dark";
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const targetCount = Math.max(20, Math.min(count, Math.round((width * height) / 22000)));
      while (particles.length < targetCount) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          size: Math.random() * maxSize + 1,
        });
      }
      if (particles.length > targetCount) {
        particles.length = targetCount;
      }
    };

    updateColors();
    resize();

    window.addEventListener("resize", resize);

    const observer = new MutationObserver(() => {
      updateColors();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "data-accent", "style", "class"],
    });

    let frame = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Periodically refresh colors in case transitions take place
      if (++frame % 30 === 0) {
        updateColors();
      }

      const linkDistance = width < 700 ? 90 : 130;
      const k = isDark ? 1 : 1.3;
      const accRgb = `${colorAcc[0]}, ${colorAcc[1]}, ${colorAcc[2]}`;
      const acc2Rgb = `${colorAcc2[0]}, ${colorAcc2[1]}, ${colorAcc2[2]}`;

      // Update particle positions
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;
      }

      // Draw connection lines
      ctx.lineWidth = 0.8;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < linkDistance * linkDistance) {
            const ratio = 1 - Math.sqrt(distSq) / linkDistance;
            const alpha = (ratio * 0.14 * k).toFixed(3);
            ctx.strokeStyle = `rgba(${accRgb}, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      // Draw particle dots (mix of primary accent and secondary accent)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const dotColor = i % 3 === 0 ? acc2Rgb : accRgb;
        ctx.fillStyle = `rgba(${dotColor}, ${(0.45 * k).toFixed(2)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, [count, maxSize, speed]);

  return <canvas id={targetId} ref={canvasRef} className={className} {...props} />;
}
