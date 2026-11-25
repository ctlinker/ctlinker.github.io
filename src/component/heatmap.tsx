import { useEffect, useState } from "preact/hooks";
import type { Lang } from "../i18n";

export type Day = { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 };
type ApiRes = { total?: { lastYear?: number }; contributions?: Day[] };

const CACHE_TTL = 60 * 60 * 1000; // 1 hour

const readCache = (user: string): { total: number; days: Day[] } | null => {
  try {
    const raw = sessionStorage.getItem(`gh-hm:${user}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { ts: number; total: number; days: Day[] };
    if (Date.now() - parsed.ts < CACHE_TTL && Array.isArray(parsed.days)) return parsed;
  } catch {}
  return null;
};

const writeCache = (user: string, total: number, days: Day[]) => {
  try {
    sessionStorage.setItem(`gh-hm:${user}`, JSON.stringify({ ts: Date.now(), total, days }));
  } catch {}
};

const MONTHS: Record<Lang, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  fr: ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"],
};

const copy: Record<Lang, Record<string, string>> = {
  en: {
    loading: "fetching github contributions…",
    err: "could not load contributions —",
    total: "contributions in the last year",
    less: "Less",
    more: "More",
    one: "contribution",
    many: "contributions",
    none: "no contributions",
  },
  fr: {
    loading: "récupération des contributions github…",
    err: "impossible de charger les contributions —",
    total: "contributions sur la dernière année",
    less: "Moins",
    more: "Plus",
    one: "contribution",
    many: "contributions",
    none: "aucune contribution",
  },
};

export function Heatmap({ user, lang, animate }: { user: string; lang: Lang; animate: boolean }) {
  const [data, setData] = useState<{ total: number; days: Day[] } | null>(() => readCache(user));
  const [err, setErr] = useState(false);
  const [active, setActive] = useState<Day | null>(null);
  const t = copy[lang];

  useEffect(() => {
    if (data) return;
    const ac = new AbortController();
    fetch(`https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(user)}?y=last`, {
      signal: ac.signal,
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((json: ApiRes) => {
        const days = json.contributions ?? [];
        const total = json.total?.lastYear ?? days.reduce((s, d) => s + d.count, 0);
        writeCache(user, total, days);
        setData({ total, days });
      })
      .catch((e) => {
        if (e?.name !== "AbortError") setErr(true);
      });
    return () => ac.abort();
  }, [user]);

  if (err) {
    return (
      <div class="l dim">
        {t.err}{" "}
        <a href={`https://github.com/${user}`} target="_blank" rel="noopener">
          github.com/{user}
        </a>
      </div>
    );
  }

  if (!data) return <div class="l dim">{t.loading}</div>;

  // Pad start so day 0 aligns with its weekday (0 = Sun .. 6 = Sat)
  const firstDow = data.days.length ? new Date(data.days[0].date + "T00:00:00Z").getUTCDay() : 0;
  const cells: (Day | null)[] = [...Array(firstDow).fill(null), ...data.days];
  const weeks = Math.ceil(cells.length / 7);

  // Month labels positioned at the week column where the 1st of a month appears (or first week)
  const monthLabels: { week: number; label: string }[] = [];
  let lastMonth = -1;
  for (let w = 0; w < weeks; w++) {
    const day = cells.slice(w * 7, w * 7 + 7).find((d): d is Day => d !== null);
    if (!day) continue;
    const m = Number(day.date.slice(5, 7)) - 1;
    if (m !== lastMonth) {
      if (w === 0 || w - (monthLabels[monthLabels.length - 1]?.week ?? -9) >= 3) {
        monthLabels.push({ week: w, label: MONTHS[lang][m] });
      }
      lastMonth = m;
    }
  }

  const tip = (d: Day) =>
    `${d.date} · ${d.count === 0 ? t.none : `${d.count} ${d.count === 1 ? t.one : t.many}`}`;

  return (
    <figure class="hm" aria-label={`${data.total} ${t.total}`}>
      <div class="hm-head">
        <span>
          <strong class="hm-num">{data.total}</strong> {t.total}
        </span>
        <a href={`https://github.com/${user}`} target="_blank" rel="noopener">
          @{user}
        </a>
      </div>

      <div class="hm-scroll">
        <div class="hm-months" style={{ gridTemplateColumns: `repeat(${weeks}, 12px)` }}>
          {monthLabels.map((m) => (
            <span key={`${m.week}-${m.label}`} style={{ gridColumnStart: m.week + 1 }}>
              {m.label}
            </span>
          ))}
        </div>
        <div class="hm-grid" style={{ gridTemplateColumns: `repeat(${weeks}, 12px)` }}>
          {cells.map((d, i) => {
            if (!d) return <span key={`pad-${i}`} class="hm-pad" />;
            const week = Math.floor(i / 7);
            const label = tip(d);
            return (
              <button
                key={d.date}
                type="button"
                class={`hm-cell lv-${d.level}${animate ? " anim" : ""}`}
                style={animate ? { animationDelay: `${week * 16}ms` } : undefined}
                title={label}
                aria-label={label}
                onMouseEnter={() => setActive(d)}
                onFocus={() => setActive(d)}
                onClick={() => setActive(d)}
              />
            );
          })}
        </div>
      </div>

      <div class="hm-foot">
        <span class="dim">{active ? tip(active) : "\u00a0"}</span>
        <span class="hm-leg">
          {t.less}
          {[0, 1, 2, 3, 4].map((lv) => (
            <i key={lv} class={`hm-cell lv-${lv}`} />
          ))}
          {t.more}
        </span>
      </div>
    </figure>
  );
}
