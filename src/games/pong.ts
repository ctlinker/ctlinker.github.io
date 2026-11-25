import { MONO, fit, gtxt, loop, palette, type Game } from "./util";

const WIN = 5;

export const pong: Game = (canvas, lang) => {
  let { ctx, W, H } = fit(canvas);
  const pal = palette();
  const t = gtxt[lang];
  const PW = 10;
  const M = 28;
  const R = 7;
  const PH = () => Math.max(80, H * 0.2);
  const base = () => Math.max(380, W * 0.5);

  let py = H / 2;
  let ay = H / 2;
  let score = [0, 0];
  let over: string | null = null;
  let overAt = 0;
  let bx = W / 2;
  let by = H / 2;
  let vx = 0;
  let vy = 0;
  let serveIn = 0.8;
  let up = false;
  let down = false;
  let target: number | null = null;

  const serve = (dir: number) => {
    bx = W / 2;
    by = H / 2;
    const a = (Math.random() - 0.5) * 0.8;
    vx = Math.cos(a) * base() * dir;
    vy = Math.sin(a) * base();
    serveIn = 0.8;
  };
  const reset = () => {
    score = [0, 0];
    over = null;
    serve(Math.random() < 0.5 ? 1 : -1);
  };
  reset();

  const hit = (paddleY: number, dir: number, edge: number) => {
    const off = Math.max(-1, Math.min(1, (by - paddleY) / (PH() / 2)));
    const speed = Math.min(Math.hypot(vx, vy) * 1.06, base() * 2.2);
    const ang = off * 0.9;
    vx = Math.cos(ang) * speed * dir;
    vy = Math.sin(ang) * speed;
    bx = edge + dir * R;
  };

  const point = (who: 0 | 1) => {
    score[who]++;
    if (score[who] >= WIN) {
      over = who === 0 ? t.win : t.lose;
      overAt = performance.now();
      vx = vy = 0;
    } else serve(who === 0 ? 1 : -1);
  };

  const frame = (dt: number) => {
    const half = PH() / 2;
    const clampY = (y: number) => Math.max(half, Math.min(H - half, y));
    if (target !== null) py += (target - py) * Math.min(1, dt * 18);
    if (up) py -= base() * 1.3 * dt;
    if (down) py += base() * 1.3 * dt;
    py = clampY(py);

    const goal = vx > 0 ? by : H / 2;
    const max = base() * 0.62 * dt;
    ay = clampY(ay + Math.max(-max, Math.min(max, goal - ay)));

    if (!over) {
      if (serveIn > 0) serveIn -= dt;
      else {
        bx += vx * dt;
        by += vy * dt;
        if (by < R) {
          by = R;
          vy = Math.abs(vy);
        }
        if (by > H - R) {
          by = H - R;
          vy = -Math.abs(vy);
        }
        const px = M + PW;
        const ax = W - M - PW;
        if (vx < 0 && bx - R <= px && bx > M - PW && Math.abs(by - py) <= half + R) hit(py, 1, px);
        if (vx > 0 && bx + R >= ax && bx < W - M + PW && Math.abs(by - ay) <= half + R) hit(ay, -1, ax);
        if (bx < -R) point(1);
        else if (bx > W + R) point(0);
      }
    }

    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = pal.line;
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 12]);
    ctx.beginPath();
    ctx.moveTo(W / 2, 0);
    ctx.lineTo(W / 2, H);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.font = `700 ${Math.min(64, W / 10)}px ${MONO}`;
    ctx.textAlign = "center";
    ctx.fillStyle = pal.dim;
    ctx.fillText(String(score[0]), W / 2 - 60, 70);
    ctx.fillText(String(score[1]), W / 2 + 60, 70);

    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, pal.acc);
    g.addColorStop(1, pal.acc2);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.roundRect(M, py - half, PW, half * 2, 5);
    ctx.roundRect(W - M - PW, ay - half, PW, half * 2, 5);
    ctx.fill();

    ctx.fillStyle = pal.fg;
    ctx.shadowColor = pal.acc;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(bx, by, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    if (over) {
      ctx.fillStyle = pal.acc;
      ctx.font = `700 ${Math.min(44, Math.floor(W / 10))}px ${MONO}`;
      ctx.fillText(over, W / 2, H / 2 - 6);
      ctx.fillStyle = pal.dim;
      ctx.font = `${Math.min(16, Math.floor(W / 22))}px ${MONO}`;
      ctx.fillText(t.restart, W / 2, H / 2 + 28);
    }
  };

  const rel = (e: PointerEvent) => e.clientY - canvas.getBoundingClientRect().top;
  const onKey = (e: KeyboardEvent, on: boolean) => {
    if (["ArrowUp", "w", "W"].includes(e.key)) {
      up = on;
      if (on) target = null;
    } else if (["ArrowDown", "s", "S"].includes(e.key)) {
      down = on;
      if (on) target = null;
    } else if (on && over && (e.key === "Enter" || e.key === " ")) reset();
    else return;
    e.preventDefault();
  };
  const kd = (e: KeyboardEvent) => onKey(e, true);
  const ku = (e: KeyboardEvent) => onKey(e, false);
  const pd = (e: PointerEvent) => {
    target = rel(e);
    if (over && performance.now() - overAt > 400) reset();
  };
  const pm = (e: PointerEvent) => (target = rel(e));
  const rs = () => ({ ctx, W, H } = fit(canvas));

  document.addEventListener("keydown", kd);
  document.addEventListener("keyup", ku);
  canvas.addEventListener("pointerdown", pd);
  canvas.addEventListener("pointermove", pm);
  addEventListener("resize", rs);
  const stop = loop(frame);
  return () => {
    stop();
    document.removeEventListener("keydown", kd);
    document.removeEventListener("keyup", ku);
    canvas.removeEventListener("pointerdown", pd);
    canvas.removeEventListener("pointermove", pm);
    removeEventListener("resize", rs);
  };
};
