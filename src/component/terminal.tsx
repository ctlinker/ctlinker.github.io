import { useCallback, useEffect, useRef, useState } from "preact/hooks";
import { register } from "../cmd";
import type { Cell, Command, Ctx, Line } from "../cmd/_type";
import { ui } from "../i18n";
import type { Prefs } from "../prefs";
import { Chips } from "./chips";
import { GameOverlay } from "./game-overlay";
import { Heatmap } from "./heatmap";
import { Mountain } from "./mountain";
import { Photobook } from "./photobook";
import { TypeWritter } from "./type-writer";

type Entry = { id: number; echo?: string; items: Line[]; animate: boolean; typeEcho?: boolean };

const cellText = (c: Cell) => (typeof c === "string" ? c : c.text);

/** Plain-text version of a line, for the screen-reader live region. */
const flat = (l: Line): string => {
  if (typeof l === "string") return l;
  switch (l.t) {
    case "text":
    case "link":
      return l.text;
    case "table":
      return l.rows.map((r) => r.map(cellText).join(": ")).join(". ");
    case "chart":
      return l.bars.map((b) => `${b.label}: ${b.text}`).join(". ");
    case "mountain":
      return l.peaks.map((p) => `${p.label} (${p.tier}): ${p.note}`).join(". ");
    case "heatmap":
      return `github heatmap for ${l.user}`;
    case "art":
      return l.rows.map((r) => [r.key, r.val].filter(Boolean).join(" ")).join(". ");
    default:
      return "";
  }
};

const isTyped = (l: Line) => typeof l === "string" || l.t === "text" || l.t === "link";

function Cellv({ c }: { c: Cell }) {
  return typeof c === "string" ? (
    <>{c}</>
  ) : (
    <a href={c.href} target="_blank" rel="noopener">
      {c.text}
    </a>
  );
}

function Item({
  line,
  lang,
  animate,
  onDone,
  pending,
  onAnswer,
}: {
  line: Line;
  lang: Prefs["lang"];
  animate: boolean;
  onDone: () => void;
  pending: boolean;
  onAnswer: (yes: boolean) => void;
}) {
  const [typing, setTyping] = useState(animate);
  const done = useRef(onDone);
  done.current = onDone;
  const l: Exclude<Line, string> = typeof line === "string" ? { t: "text", text: line } : line;
  const hasText = (l.t === "text" || l.t === "link") && !!l.text;

  // Anything that is not typed character-by-character appears after a short beat.
  useEffect(() => {
    if (!animate || hasText) return;
    const id = setTimeout(() => done.current(), isTyped(l) ? 0 : 90);
    return () => clearTimeout(id);
  }, [animate]);

  const finishTyping = () => {
    setTyping(false);
    done.current();
  };

  if (l.t === "text" || l.t === "link") {
    const inner =
      animate && typing && l.text ? (
        <TypeWritter
          flavor="plain"
          speed={9}
          content={l.text}
          className="cur"
          onDone={finishTyping}
        />
      ) : (
        l.text
      );
    if (l.t === "link")
      return (
        <div class="l">
          <a href={l.href} target="_blank" rel="noopener">
            {inner}
          </a>
        </div>
      );
    return <div class={"l " + (l.cls ?? "")}>{inner}</div>;
  }

  if (l.t === "table") {
    return (
      <div class={"tw " + (animate ? "animate__animated animate__fadeIn" : "")}>
        <table>
          {l.head && (
            <thead>
              <tr>
                {l.head.map((h) => (
                  <th>{h}</th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {l.rows.map((r) => (
              <tr>
                {r.map((c) => (
                  <td>
                    <Cellv c={c} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (l.t === "chart") {
    const max = Math.max(1, Math.ceil(Math.max(...l.bars.map((b) => b.value))));
    const ticks = Array.from({ length: max + 1 }, (_, i) => i);
    return (
      <figure class="chart" aria-label={l.unit}>
        <div class="c-y">
          {ticks.map((t) => (
            <span key={t} style={{ bottom: `${(t / max) * 100}%` }}>
              {t}
            </span>
          ))}
          <em>{l.unit}</em>
        </div>
        <div class="c-plot">
          {ticks.map((t) => (
            <i key={t} class="grid" style={{ bottom: `${(t / max) * 100}%` }} />
          ))}
          {l.bars.map((b, i) => (
            <div class="c-col" key={b.label}>
              <span class="c-val" style={{ animationDelay: `${i * 90 + 500}ms` }}>
                {b.text}
              </span>
              <div
                class="c-bar"
                style={{ height: `${(b.value / max) * 100}%`, animationDelay: `${i * 90}ms` }}
              />
            </div>
          ))}
        </div>
        <div class="c-x">
          {l.bars.map((b) => (
            <span key={b.label}>{b.label}</span>
          ))}
        </div>
      </figure>
    );
  }

  if (l.t === "mountain") {
    return <Mountain tiers={l.tiers} peaks={l.peaks} animate={animate} />;
  }

  if (l.t === "heatmap") {
    return <Heatmap user={l.user} lang={lang} animate={animate} />;
  }

  if (l.t === "art") {
    return (
      <pre class={"art " + (animate ? "animate__animated animate__fadeIn" : "")}>
        {l.rows.map((r) => (
          <div>
            <span class="logo">{r.art}</span>
            {r.key && <span class="k">{r.key}</span>}
            <span class={r.key ? "" : "h"}>{r.val}</span>
          </div>
        ))}
      </pre>
    );
  }

  // confirm
  return pending ? (
    <div class="l">
      <button type="button" class="pbtn" onClick={() => onAnswer(true)}>
        {l.yes}
      </button>
      <button type="button" class="pbtn" onClick={() => onAnswer(false)}>
        {l.no}
      </button>
    </div>
  ) : null;
}

function EntryView({
  entry,
  lang,
  skip,
  pending,
  onDone,
  onAnswer,
}: {
  entry: Entry;
  lang: Prefs["lang"];
  skip: boolean;
  pending: boolean;
  onDone: (id: number) => void;
  onAnswer: (yes: boolean) => void;
}) {
  const total = entry.items.length;
  const [idx, setIdx] = useState(entry.animate ? 0 : total);
  // When the command was not typed by the user (chip click, boot), "type" it first.
  const [echoed, setEchoed] = useState(!(entry.typeEcho && entry.echo));
  const finished = useRef(false);

  useEffect(() => {
    if (skip) {
      setEchoed(true);
      setIdx(total);
    }
  }, [skip]);

  useEffect(() => {
    if (echoed && idx >= total && !finished.current) {
      finished.current = true;
      onDone(entry.id);
    }
  }, [idx, echoed]);

  return (
    <div class="entry">
      {entry.echo !== undefined && (
        <div class="l cmd">
          <span class="prompt">&gt;</span>{" "}
          {echoed ? (
            entry.echo
          ) : (
            <TypeWritter
              flavor="plain"
              speed={40}
              content={entry.echo}
              className="cur"
              onDone={() => setTimeout(() => setEchoed(true), 220)}
            />
          )}
        </div>
      )}
      {(echoed ? entry.items.slice(0, idx + 1) : []).map((line, i) => (
        <Item
          key={i}
          line={line}
          lang={lang}
          animate={i === idx}
          onDone={() => setIdx((n) => (n === i ? i + 1 : n))}
          pending={pending}
          onAnswer={onAnswer}
        />
      ))}
    </div>
  );
}

export function Terminal({ prefs }: { prefs: Prefs }) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [skip, setSkip] = useState(false);
  const [value, setValue] = useState("");
  const [book, setBook] = useState(false);
  const [game, setGame] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [sr, setSr] = useState("");

  const idRef = useRef(0);
  const waiters = useRef(new Map<number, () => void>());
  const lastPush = useRef<Promise<void>>(Promise.resolve());
  const history = useRef<string[]>([]);
  const hi = useRef(0);
  const booted = useRef(false);
  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;
  const pendingRef = useRef<number | null>(null);
  pendingRef.current = pendingId;

  const outRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const busy = activeId !== null;
  const focus = () => {
    if (!matchMedia("(pointer: coarse)").matches) inputRef.current?.focus({ preventScroll: true });
  };

  const push = (items: Line[], echo?: string, animate = true, typeEcho = true) => {
    const p = new Promise<void>((resolve) => {
      const id = ++idRef.current;
      waiters.current.set(id, resolve);
      setSkip(false);
      setEntries((e) => [...e, { id, echo, items, animate, typeEcho }]);
      setActiveId(id);
      if (items.some((i) => typeof i === "object" && i.t === "confirm")) setPendingId(id);
      const text = items.map(flat).filter(Boolean).join(". ");
      if (text) setSr(text);
    });
    lastPush.current = p;
    return p;
  };

  const finish = useCallback((id: number) => {
    waiters.current.get(id)?.();
    waiters.current.delete(id);
    setActiveId((a) => (a === id ? null : a));
  }, []);

  const execute = async (raw: string, typeEcho = true) => {
    const shown = raw.trim();
    if (!shown) return;
    history.current.push(shown);
    hi.current = history.current.length;
    setPendingId(null);

    const p = prefsRef.current;
    let cleared = false;
    let launched: string | null = null;
    let rebooting = false;
    const ctx: Omit<Ctx, "invoked" | "rawArgs" | "commands"> = {
      lang: p.lang,
      ui: ui[p.lang],
      setLang: p.setLang,
      toggleTheme: p.toggleTheme,
      cycleAccent: p.cycleAccent,
      clear: () => {
        cleared = true;
      },
      launch: (g) => {
        launched = g;
      },
      reboot: () => {
        rebooting = true;
      },
    };
    const out = register.run(shown, ctx);
    if (cleared) {
      setEntries([]);
      setSr("");
      return;
    }
    await push(
      out ?? [ui[p.lang].nf + shown, { t: "text", text: ui[p.lang].nfh, cls: "dim" }],
      shown,
      true,
      typeEcho,
    );
    if (rebooting) {
      try {
        localStorage.removeItem("seen");
      } catch {}
      location.reload();
      return;
    }
    if (launched) setGame(launched);
  };

  /** Runs a command; if one is still typing, skips it first. */
  const submit = async (raw: string, typeEcho = true) => {
    if (book || game) return;
    if (activeId !== null) {
      setSkip(true);
      await lastPush.current;
    }
    await execute(raw, typeEcho);
  };

  const answer = async (yes: boolean, typed?: string) => {
    if (pendingRef.current === null) return;
    setPendingId(null);
    const u = ui[prefsRef.current.lang];
    await push([], typed ?? (yes ? "y" : "n"), false, false);
    if (yes) setBook(true);
    else await push([{ t: "text", text: u.cancel, cls: "dim" }]);
  };

  const stopBook = useRef((_: boolean) => {});
  stopBook.current = (stopped: boolean) => {
    if (!book) return;
    setBook(false);
    const u = ui[prefsRef.current.lang];
    push([{ t: "text", text: stopped ? u.stopped : u.end, cls: "dim" }]);
  };

  // Boot: first visit shows a short boot log, then fastfetch runs automatically.
  useEffect(() => {
    if (!prefs.ready || booted.current) return;
    booted.current = true;
    (async () => {
      const u = ui[prefsRef.current.lang];
      let seen = false;
      try {
        seen = localStorage.getItem("seen") === "1";
        localStorage.setItem("seen", "1");
      } catch {}
      if (!seen) for (const l of u.boot) await push([{ t: "text", text: l, cls: "dim" }]);
      await execute("fastfetch", true);
      await execute("heatmap", true);
      await push([{ t: "text", text: u.hello, cls: "dim" }]);
    })();
  }, [prefs.ready]);

  // Keep the newest output in view as it types.
  useEffect(() => {
    const inner = innerRef.current;
    const out = outRef.current;
    if (!inner || !out || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      out.scrollTop = out.scrollHeight;
    });
    ro.observe(inner);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!busy && !book && !game) focus();
  }, [busy, book, game]);

  const onKeyDown = (e: KeyboardEvent) => {
    if (busy) {
      setSkip(true);
      if (e.key !== "Tab") e.preventDefault();
      return;
    }
    const lang = prefsRef.current.lang;
    if (e.key === "Enter") {
      const v = value;
      setValue("");
      if (pendingRef.current !== null) answer(/^(y|yes|o|oui)$/i.test(v.trim()), v.trim() || "n");
      else submit(v);
    } else if (e.key === "Tab") {
      e.preventDefault();
      const [m] = register.complete(value, lang);
      if (m) setValue(m);
    } else if (e.key === "ArrowUp" && history.current.length) {
      e.preventDefault();
      hi.current = Math.max(0, hi.current - 1);
      setValue(history.current[hi.current]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      hi.current = Math.min(history.current.length, hi.current + 1);
      setValue(history.current[hi.current] ?? "");
    }
  };

  const onChip = (c: Command) => {
    setValue("");
    submit(c.label?.[prefsRef.current.lang] ?? c.name, true);
    focus();
  };

  const u = ui[prefs.lang];

  return (
    <div class="term" onClick={() => busy && setSkip(true)}>
      <div id="out" class="out" ref={outRef}>
        <div ref={innerRef}>
          {entries.map((en) => (
            <EntryView
              key={en.id}
              entry={en}
              lang={prefs.lang}
              skip={skip && en.id === activeId}
              pending={pendingId === en.id}
              onDone={finish}
              onAnswer={(yes) => answer(yes)}
            />
          ))}
        </div>
      </div>
      <div class="sr" role="status" aria-live="polite">
        {sr}
      </div>
      <div class="row">
        <span class="prompt">&gt;</span>
        <input
          ref={inputRef}
          value={value}
          onInput={(e) => setValue((e.target as HTMLInputElement).value)}
          onKeyDown={onKeyDown}
          disabled={book || !!game}
          autoComplete="off"
          autoCapitalize="off"
          spellcheck={false}
          aria-label="Command"
          placeholder={u.ph}
        />
      </div>
      <Chips commands={register.commands} lang={prefs.lang} onRun={onChip} />
      {game && (
        <GameOverlay
          game={game}
          lang={prefs.lang}
          hint={u.hints[game as keyof typeof u.hints]}
          onExit={() => setGame(null)}
        />
      )}
      {book && <Photobook hint={u.hint} onStop={(s) => stopBook.current(s)} />}
    </div>
  );
}
