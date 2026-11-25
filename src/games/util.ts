import type { Lang } from "../i18n";

export type Game = (canvas: HTMLCanvasElement, lang: Lang) => () => void;

export const palette = () => {
  const cs = getComputedStyle(document.documentElement);
  const g = (k: string) => cs.getPropertyValue(k).trim();
  return { acc: g("--acc"), acc2: g("--acc2"), fg: g("--fg"), dim: g("--dim"), bg: g("--bg"), line: g("--line") };
};
export type Palette = ReturnType<typeof palette>;

/** Sizes the backing store to the CSS size (HiDPI aware) and returns logical W/H. */
export function fit(canvas: HTMLCanvasElement) {
  const d = Math.min(devicePixelRatio || 1, 2);
  const W = canvas.clientWidth;
  const H = canvas.clientHeight;
  canvas.width = Math.round(W * d);
  canvas.height = Math.round(H * d);
  const ctx = canvas.getContext("2d")!;
  ctx.setTransform(d, 0, 0, d, 0, 0);
  return { ctx, W, H };
}

export function loop(frame: (dt: number) => void) {
  let raf = 0;
  let last = performance.now();
  const tick = (now: number) => {
    raf = requestAnimationFrame(tick);
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    frame(dt);
  };
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}

export const gtxt: Record<Lang, Record<string, string>> = {
  en: { win: "you win", lose: "you lose", over: "game over", restart: "enter / tap to play again", score: "score", best: "best", level: "lvl" },
  fr: { win: "vous gagnez", lose: "vous perdez", over: "partie terminée", restart: "entrée / toucher pour rejouer", score: "score", best: "record", level: "niv" },
};

export const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, monospace';
