import { useEffect, useState } from "preact/hooks";
import { TypeWritter } from "./type-writer";
import { ExternalLink, Moon, Sun } from "lucide-preact";
import type { Prefs } from "../prefs";

export function Header({ prefs }: { prefs: Prefs }) {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () =>
      setTime(
        new Date().toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      );
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const { lang, setLang, theme, toggleTheme } = prefs;
  const next = lang === "fr" ? "en" : "fr";

  return (
    <header class="bar">
      <div class="bar-in">
        <a
          class="brand"
          target="_blank"
          rel="noopener"
          href="https://github.com/ctlinker"
        >
          <TypeWritter flavor="gibbrish" speed={20} content="ctlinker://portfolio" />
          <ExternalLink size={12} />
        </a>

        <div class="bar-right animate__animated animate__lightSpeedInRight">
          <span class="clock">{time}</span>
          <button
            type="button"
            class="tog"
            onClick={() => setLang(next)}
            aria-label={lang === "fr" ? "English" : "Français"}
          >
            <span class={lang === "fr" ? "on" : ""}>FR</span>
            <span class="sep">|</span>
            <span class={lang === "en" ? "on" : ""}>EN</span>
          </button>
          <button
            type="button"
            class="tog"
            onClick={toggleTheme}
            aria-label={lang === "fr" ? "Changer de thème" : "Toggle theme"}
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <span class="dot" />
        </div>
      </div>
    </header>
  );
}
