import { useEffect, useState } from "preact/hooks";
import { photobook } from "../photobook";

type Props = { hint: string; onStop: (stopped: boolean) => void };

const cardFor = (initials: string) => {
  const cs = getComputedStyle(document.documentElement);
  const g = (k: string) => cs.getPropertyValue(k).trim();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><rect width="400" height="300" fill="${g("--line")}"/><text x="200" y="165" text-anchor="middle" font-size="96" font-family="monospace" font-weight="700" fill="${g("--acc")}">${initials}</text></svg>`;
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
};

const src = (p: (typeof photobook)[number]) =>
  p.file ? `${import.meta.env.BASE_URL}photobook/${p.file}` : cardFor(p.initials);

/** Full-screen slideshow (~3 images / second, no strobing). Any key or click stops it. */
export function Photobook({ hint, onStop }: Props) {
  const [i, setI] = useState(0);

  useEffect(() => {
    photobook.forEach((p) => {
      new Image().src = src(p);
    });
    const ms = matchMedia("(prefers-reduced-motion: reduce)").matches ? 1500 : 340;
    let n = 0;
    let ended = false;
    const finish = (stopped: boolean) => {
      if (ended) return;
      ended = true;
      onStop(stopped);
    };
    const timer = setInterval(() => {
      n++;
      if (n >= photobook.length) {
        clearInterval(timer);
        finish(false);
      } else setI(n);
    }, ms);
    const stop = () => finish(true);
    // let the key press that confirmed playback pass before listening
    const arm = setTimeout(() => document.addEventListener("keydown", stop), 150);
    return () => {
      clearInterval(timer);
      clearTimeout(arm);
      document.removeEventListener("keydown", stop);
    };
  }, []);

  const p = photobook[i];
  return (
    <div class="pb" onClick={() => onStop(true)} role="dialog" aria-label="photobook">
      <img alt="" src={src(p)} />
      <div class="cap">{p.name}</div>
      <div class="hint">{hint}</div>
    </div>
  );
}
