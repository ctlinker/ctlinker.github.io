import { useEffect, useRef, useState } from "preact/hooks";
import type { Lang } from "./i18n";

export type Theme = "dark" | "light";
export const ACCENTS = ["green", "blue", "cyan", "purple"] as const;
export type Accent = (typeof ACCENTS)[number];

export type Prefs = {
  /** true once stored preferences were read (client only). */
  ready: boolean;
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: Theme;
  toggleTheme: () => Theme;
  accent: Accent;
  cycleAccent: () => Accent;
};

const read = (k: string) => {
  try {
    return localStorage.getItem(k);
  } catch {
    return null;
  }
};
const write = (k: string, v: string) => {
  try {
    localStorage.setItem(k, v);
  } catch { }
};

export function usePrefs(): Prefs {
  const [ready, setReady] = useState(false);
  const [lang, setLang] = useState<Lang>("en");
  const [theme, setTheme] = useState<Theme>("dark");
  const [accent, setAccent] = useState<Accent>("cyan");
  const cur = useRef({ theme, accent });
  cur.current = { theme, accent };

  useEffect(() => {
    const l = read("lang");
    setLang(l === "fr" || l === "en" ? l : navigator.language?.slice(0, 2) === "fr" ? "fr" : "en");
    const t = read("theme");
    if (t === "light" || t === "dark") setTheme(t);
    const a = read("accent") as Accent | null;
    if (a && ACCENTS.includes(a)) setAccent(a);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    root.lang = lang;
    root.dataset.theme = theme;
    root.dataset.accent = accent;
    write("lang", lang);
    write("theme", theme);
    write("accent", accent);
  }, [ready, lang, theme, accent]);

  return {
    ready,
    lang,
    setLang,
    theme,
    accent,
    toggleTheme: () => {
      const next: Theme = cur.current.theme === "dark" ? "light" : "dark";
      cur.current.theme = next;
      setTheme(next);
      return next;
    },
    cycleAccent: () => {
      const next = ACCENTS[(ACCENTS.indexOf(cur.current.accent) + 1) % ACCENTS.length];
      cur.current.accent = next;
      setAccent(next);
      return next;
    },
  };
}
