import { useEffect, useId, useRef } from "preact/hooks";
import { JSX } from "preact";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
};

type ParticuleCanvasProps = {
  /** Number of particles to render */
  count?: number;
  /** Desired particle size (max radius) */
  maxSize?: number;
  /** Animation speed multiplier (higher = faster) */
  speed?: number;
  /** Optional color palette */
  colors?: string[];
} & Record<string, any>;

/**
 * A lightweight particle canvas that uses requestAnimationFrame for smooth animation.
 * Particles bounce off the canvas edges and have random velocities and colors.
 */
export function ParticuleCanvas({
  count = 75,
  maxSize = 2,
  speed = 1,
  colors = ["#080B16", "#2563EB", "#8B5CF6", "#C4B5FD", "#E2E8F0"],
  ...props
}: ParticuleCanvasProps) {
  const targetId = useId();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(NaN);

  // Initialise canvas size and particles
  useEffect(() => {
    const canvas = document.getElementById(
      targetId,
    ) as HTMLCanvasElement | null;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const createParticle = (): Particle => {
      const size = Math.random() * maxSize + 1;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    particlesRef.current = Array.from({ length: count }, createParticle);

    const render = () => {
      ctx.fillStyle = "rgba(0,0,0,0.1)"; // slight trail effect
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((p) => {
        // move particle
        p.x += p.vx;
        p.y += p.vy;

        // bounce off edges
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationRef.current!);
      window.removeEventListener("resize", resize);
    };
  }, [targetId, count, maxSize, speed, colors]);

  return <canvas {...props} id={targetId} ref={canvasRef} />;
}
