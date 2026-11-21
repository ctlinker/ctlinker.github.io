import { useEffect, useState } from "preact/hooks";
import { TypeWritter } from "./type-writer";
import { ExternalLink, Sun, Moon } from "lucide-preact";
import type { Locale } from "../infos";

type HeaderProps = {
  lang: Locale;
  onToggleLang: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
};

export function Header({ lang, onToggleLang, theme, onToggleTheme }: HeaderProps) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString("en-GB", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="flex items-center justify-between w-full h-11 px-4 sm:px-6 border-b border-[var(--line)] bg-[var(--bg)]/90 backdrop-blur-xs text-xs select-none sticky top-0 z-40 transition-colors">
      <div className="flex items-center gap-3">
        <a
          href="https://github.com/ctlinker"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 font-semibold text-[var(--fg)] hover:text-[var(--acc)] no-underline transition-colors"
          title="GitHub @ctlinker"
        >
          <TypeWritter
            flavor="gibbrish"
            speed={25}
            content="ctlinker://portfolio"
          />
          <ExternalLink size={12} className="opacity-70" />
        </a>
      </div>

      <div className="flex items-center gap-3 sm:gap-4 text-[var(--dim)]">
        <button
          type="button"
          onClick={onToggleLang}
          className="px-2 py-0.5 rounded-sm border border-[var(--line)] hover:border-[var(--acc)] hover:text-[var(--acc)] transition-colors cursor-pointer text-xs font-mono font-medium"
          aria-label={lang === "fr" ? "Switch to English" : "Passer en Français"}
        >
          {lang === "fr" ? "EN" : "FR"}
        </button>

        <button
          type="button"
          onClick={onToggleTheme}
          className="flex items-center gap-1 px-2 py-0.5 rounded-sm border border-[var(--line)] hover:border-[var(--acc)] hover:text-[var(--acc)] transition-colors cursor-pointer text-xs font-mono"
          aria-label="Toggle Theme"
          title="Toggle Light / Dark mode"
        >
          {theme === "dark" ? <Sun size={12} /> : <Moon size={12} />}
          <span className="hidden sm:inline">{theme === "dark" ? "light" : "dark"}</span>
        </button>

        <div className="flex items-center gap-2 font-mono tabular-nums text-[11px] sm:text-xs">
          <span>{time}</span>
          <span
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: "var(--acc)" }}
            title="System online"
          />
        </div>
      </div>
    </header>
  );
}
