import { MONO, fit, gtxt, loop, palette, type Game } from "./util";

type Rock = { x: number; y: number; v: number; r: number; hp: number; rot: number; spin: number; shape: number[] };
type Bullet = { x: number; y: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number };

const S = Math.SQRT1_2;

/** Comets fall down-right at 45° (like the background); the player shoots them. */
export const spaceshooter: Game = (canvas, lang) => {
  let { ctx, W, H } = fit(canvas);
  const pal = palette();
  const t = gtxt[lang];
  const shipY = () => H - 70;
  let best = 0;
  try {
    best = Number(localStorage.getItem("ss-best") || 0);
  } catch {}

  let sx = W / 2;
  let tx = W / 2;
  let lives = 3;
  let score = 0;
  let rocks: Rock[] = [];
  let bullets: Bullet[] = [];
  let sparks: Spark[] = [];
  let cool = 0;
  let inv = 0;
  let spawn = 0.6;
  let time = 0;
  let over = false;
  let overAt = 0;
  let firing = false;
  let left = false;
  let right = false;
  let space = false;

  const reset = () => {
    lives = 3;
    score = 0;
    rocks = [];
    bullets = [];
    sparks = [];
    inv = 0;
    spawn = 0.6;
    over = false;
    sx = tx = W / 2;
  };

  const burst = (x: number, y: number, n: number) => {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = 60 + Math.random() * 200;
      sparks.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 0.4 + Math.random() * 0.5 });
    }
  };

  const spawnRock = () => {
    const r = 12 + Math.random() * 20;
    const top = Math.random() < W / (W + H);
    rocks.push({
      x: top ? Math.random() * W * 0.9 : -r,
      y: top ? -r : Math.random() * H * 0.5,
      v: 130 + Math.random() * 110,
      r,
      hp: r > 22 ? 2 : 1,
      rot: 0,
      spin: (Math.random() - 0.5) * 3,
      shape: Array.from({ length: 9 }, () => 0.78 + Math.random() * 0.4),
    });
  };

  const frame = (dt: number) => {
    time += dt;
    const level = 1 + Math.floor(score / 200);
    const speedMul = 1 + (level - 1) * 0.12;

    if (!over) {
      if (left) tx -= 650 * dt;
      if (right) tx += 650 * dt;
      tx = Math.max(24, Math.min(W - 24, tx));
      sx += (tx - sx) * Math.min(1, dt * 14);
      cool -= dt;
      if ((firing || space) && cool <= 0) {
        bullets.push({ x: sx, y: shipY() - 18 });
        cool = 0.17;
      }
      spawn -= dt;
      if (spawn <= 0) {
        spawnRock();
        spawn = Math.max(0.35, 1.1 - level * 0.08) * (0.6 + Math.random() * 0.8);
      }
    }

    for (const b of bullets) b.y -= 900 * dt;
    bullets = bullets.filter((b) => b.y > -20);
    for (const r of rocks) {
      const step = r.v * speedMul * dt * S;
      r.x += step;
      r.y += step;
      r.rot += r.spin * dt;
    }
    rocks = rocks.filter((r) => r.x < W + r.r + 60 && r.y < H + r.r + 60);

    for (const b of bullets) {
      for (const r of rocks) {
        if (r.hp > 0 && Math.hypot(b.x - r.x, b.y - r.y) < r.r + 4) {
          b.y = -100;
          r.hp--;
          burst(b.x, b.y < 0 ? r.y : b.y, 3);
          if (r.hp <= 0) {
            score += r.r > 22 ? 25 : 10;
            burst(r.x, r.y, 14);
          }
          break;
        }
      }
    }
    rocks = rocks.filter((r) => r.hp > 0);

    inv -= dt;
    if (!over && inv <= 0) {
      for (const r of rocks) {
        if (Math.hypot(sx - r.x, shipY() - r.y) < r.r + 12) {
          r.hp = 0;
          lives--;
          inv = 1.6;
          burst(sx, shipY(), 24);
          if (lives <= 0) {
            over = true;
            overAt = performance.now();
            if (score > best) {
              best = score;
              try {
                localStorage.setItem("ss-best", String(best));
              } catch {}
            }
          }
          break;
        }
      }
      rocks = rocks.filter((r) => r.hp > 0);
    }
    for (const p of sparks) {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
    }
    sparks = sparks.filter((p) => p.life > 0);

    // ── draw ──
    ctx.clearRect(0, 0, W, H);
    ctx.lineJoin = "round";
    for (const r of rocks) {
      const tail = r.r * 5;
      const g = ctx.createLinearGradient(r.x - tail * S, r.y - tail * S, r.x, r.y);
      g.addColorStop(0, "transparent");
      g.addColorStop(1, pal.acc2);
      ctx.strokeStyle = g;
      ctx.lineWidth = r.r * 0.9;
      ctx.lineCap = "round";
      ctx.globalAlpha = 0.45;
      ctx.beginPath();
      ctx.moveTo(r.x - tail * S, r.y - tail * S);
      ctx.lineTo(r.x, r.y);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.beginPath();
      r.shape.forEach((m, i) => {
        const a = r.rot + (i / r.shape.length) * Math.PI * 2;
        const px = r.x + Math.cos(a) * r.r * m;
        const py = r.y + Math.sin(a) * r.r * m;
        i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
      });
      ctx.closePath();
      ctx.fillStyle = pal.bg;
      ctx.fill();
      ctx.strokeStyle = pal.acc;
      ctx.lineWidth = r.hp > 1 ? 3 : 1.6;
      ctx.shadowColor = pal.acc;
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    ctx.strokeStyle = pal.acc;
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.shadowColor = pal.acc;
    ctx.shadowBlur = 10;
    for (const b of bullets) {
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x, b.y + 14);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;

    if (!over && !(inv > 0 && Math.floor(time * 14) % 2)) {
      const y = shipY();
      const flame = 8 + Math.random() * 8;
      ctx.fillStyle = pal.acc2;
      ctx.beginPath();
      ctx.moveTo(sx - 6, y + 12);
      ctx.lineTo(sx, y + 12 + flame);
      ctx.lineTo(sx + 6, y + 12);
      ctx.fill();
      const g = ctx.createLinearGradient(sx, y - 18, sx, y + 14);
      g.addColorStop(0, pal.acc);
      g.addColorStop(1, pal.acc2);
      ctx.fillStyle = g;
      ctx.shadowColor = pal.acc;
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.moveTo(sx, y - 18);
      ctx.lineTo(sx + 14, y + 14);
      ctx.lineTo(sx, y + 7);
      ctx.lineTo(sx - 14, y + 14);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    ctx.fillStyle = pal.fg;
    for (const p of sparks) {
      ctx.globalAlpha = Math.min(1, p.life * 2);
      ctx.fillRect(p.x, p.y, 2.5, 2.5);
    }
    ctx.globalAlpha = 1;

    ctx.font = `600 18px ${MONO}`;
    ctx.textAlign = "left";
    ctx.fillStyle = pal.fg;
    ctx.fillText(`${t.score} ${score}`, 20, 38);
    ctx.fillStyle = pal.dim;
    ctx.fillText(`${t.best} ${Math.max(best, score)} · ${t.level} ${level}`, 20, 62);
    ctx.textAlign = "right";
    ctx.fillStyle = pal.acc;
    ctx.fillText("◆".repeat(Math.max(0, lives)), W - 70, 38);

    if (over) {
      ctx.textAlign = "center";
      ctx.fillStyle = pal.acc;
      ctx.font = `700 ${Math.min(44, Math.floor(W / 10))}px ${MONO}`;
      ctx.fillText(t.over, W / 2, H / 2 - 6);
      ctx.fillStyle = pal.fg;
      ctx.font = `${Math.min(18, Math.floor(W / 22))}px ${MONO}`;
      ctx.fillText(`${t.score} ${score} · ${t.best} ${best}`, W / 2, H / 2 + 26);
      ctx.fillStyle = pal.dim;
      ctx.fillText(t.restart, W / 2, H / 2 + 54);
    }
  };

  const relX = (e: PointerEvent) => e.clientX - canvas.getBoundingClientRect().left;
  const onKey = (e: KeyboardEvent, on: boolean) => {
    if (["ArrowLeft", "a", "A"].includes(e.key)) left = on;
    else if (["ArrowRight", "d", "D"].includes(e.key)) right = on;
    else if (e.key === " ") {
      if (on && over) reset();
      else space = on;
    } else if (on && over && (e.key === "Enter" || e.key === "r" || e.key === "R")) reset();
    else return;
    e.preventDefault();
  };
  const kd = (e: KeyboardEvent) => onKey(e, true);
  const ku = (e: KeyboardEvent) => onKey(e, false);
  const pd = (e: PointerEvent) => {
    tx = relX(e);
    if (over) {
      if (performance.now() - overAt > 400) reset();
    } else firing = true;
  };
  const pm = (e: PointerEvent) => (tx = relX(e));
  const pu = () => (firing = false);
  const rs = () => ({ ctx, W, H } = fit(canvas));

  document.addEventListener("keydown", kd);
  document.addEventListener("keyup", ku);
  canvas.addEventListener("pointerdown", pd);
  canvas.addEventListener("pointermove", pm);
  canvas.addEventListener("pointerup", pu);
  canvas.addEventListener("pointercancel", pu);
  canvas.addEventListener("pointerleave", pu);
  addEventListener("resize", rs);
  const stop = loop(frame);
  return () => {
    stop();
    document.removeEventListener("keydown", kd);
    document.removeEventListener("keyup", ku);
    canvas.removeEventListener("pointerdown", pd);
    canvas.removeEventListener("pointermove", pm);
    canvas.removeEventListener("pointerup", pu);
    canvas.removeEventListener("pointercancel", pu);
    canvas.removeEventListener("pointerleave", pu);
    removeEventListener("resize", rs);
  };
};
