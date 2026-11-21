import { hydrate, prerender as ssr } from "preact-iso";
import { useEffect, useState } from "preact/hooks";
import "./style.css";
import { Header } from "./component/header";
import { Terminal } from "./component/terminal";
import { ParticuleCanvas } from "./component/particule-canvas";
import type { Locale } from "./infos";

const ACCENTS = ["green", "blue", "cyan", "purple"] as const;
type Accent = (typeof ACCENTS)[number];

export function App() {
  const [lang, setLang] = useState<Locale>("en");
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [accent, setAccent] = useState<Accent>("green");

  // Initialize from storage or environment on mount
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("lang") as Locale | null;
      if (savedLang === "en" || savedLang === "fr") {
        setLang(savedLang);
      } else {
        const nav = (navigator.language || "").slice(0, 2);
        if (nav === "fr") setLang("fr");
      }

      const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(prefersDark ? "dark" : "light");
      }

      const savedAccent = localStorage.getItem("accent") as Accent | null;
      if (savedAccent && ACCENTS.includes(savedAccent)) {
        setAccent(savedAccent);
      }
    } catch {
      // Ignore localStorage exceptions in restricted contexts
    }
  }, []);

  // Sync HTML root attributes
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    try {
      localStorage.setItem("lang", lang);
    } catch {}
  }, [lang]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-accent", accent);
    try {
      localStorage.setItem("accent", accent);
    } catch {}
  }, [accent]);

  const handleToggleLang = () => {
    setLang((prev) => (prev === "en" ? "fr" : "en"));
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleCycleAccent = (): string => {
    const currentIndex = ACCENTS.indexOf(accent);
    const next = ACCENTS[(currentIndex + 1) % ACCENTS.length];
    setAccent(next);
    return next;
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[var(--bg)] text-[var(--fg)] selection:bg-[var(--acc)] selection:text-[var(--bg)]">
      {/* Background dynamic particle canvas */}
      <ParticuleCanvas count={70} />

      {/* Terminal window header */}
      <Header
        lang={lang}
        onToggleLang={handleToggleLang}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Terminal Presentation Shell */}
      <main className="flex-1 flex flex-col w-full">
        <Terminal
          lang={lang}
          setLang={setLang}
          theme={theme}
          toggleTheme={handleToggleTheme}
          accent={accent}
          cycleAccent={handleCycleAccent}
        />
      </main>
    </div>
  );
}

if (typeof window !== "undefined") {
  const root = document.getElementById("app");
  if (root) {
    hydrate(<App />, root);
  }
}

export async function prerender(data: Record<string, any>) {
  return await ssr(<App {...data} />);
}
