import { useEffect, useRef, useState } from "preact/hooks";
import { INFOS, type Locale, type TableContent } from "../infos";
import { findCommand, COMMAND_LIST } from "../cmd";
import type { CommandContext, OutputItem } from "../cmd/_type";
import { Chips } from "./chips";

type PhotobookTool = readonly [string, string, string];

type TerminalEntry = {
  id: string;
  command: string;
  output: OutputItem[];
  isPromptPending?: boolean;
};

type TerminalProps = {
  lang: Locale;
  setLang: (lang: Locale) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  accent: string;
  cycleAccent: () => string;
};

export function Terminal({
  lang,
  setLang,
  theme,
  toggleTheme,
  accent,
  cycleAccent,
}: TerminalProps) {
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [inputVal, setInputVal] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isPhotobookPlaying, setIsPhotobookPlaying] = useState(false);
  const [photobookTools, setPhotobookTools] = useState<readonly PhotobookTool[]>([]);
  const [photobookIndex, setPhotobookIndex] = useState(0);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const cmdContext: CommandContext = {
    lang,
    setLang,
    theme,
    toggleTheme,
    accent,
    cycleAccent,
    triggerPhotobook: () => {
      // Photobook confirmation prompt is handled via terminal entry
    },
  };

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Run initial fastfetch on mount
  useEffect(() => {
    const isFirstVisit = typeof window !== "undefined" && !sessionStorage.getItem("seen");
    if (typeof window !== "undefined") {
      sessionStorage.setItem("seen", "1");
    }

    const bootLines: string[] = isFirstVisit
      ? [
          "[ ok ] mounting /home/ctlinker",
          "[ ok ] loading profile & environment",
          "[ ok ] starting /bin/portfolio-cli",
          "",
        ]
      : [];

    const fastfetch = findCommand("fastfetch");
    const initialOutput = fastfetch ? (fastfetch.execute([], cmdContext) as OutputItem[]) : [];

    setEntries([
      {
        id: "boot",
        command: "fastfetch",
        output: [...bootLines, ...initialOutput],
      },
    ]);

    inputRef.current?.focus();
  }, []);

  // Update entries when language changes if needed
  useEffect(() => {
    inputRef.current?.focus();
  }, [lang]);

  useEffect(() => {
    scrollToBottom();
  }, [entries, isPhotobookPlaying]);

  const startPhotobook = async () => {
    try {
      if (photobookTools.length === 0) {
        const mod = await import("../data/photobook");
        setPhotobookTools(mod.PHOTOBOOK_TOOLS);
      }
      setIsPhotobookPlaying(true);
      setPhotobookIndex(0);
    } catch (e) {
      console.error("Failed to load photobook data", e);
    }
  };

  // Handle photobook playback interval
  useEffect(() => {
    if (!isPhotobookPlaying || photobookTools.length === 0) return;

    const interval = setInterval(() => {
      setPhotobookIndex((prev) => (prev + 1) % photobookTools.length);
    }, 380);

    const handleStop = () => {
      setIsPhotobookPlaying(false);
      setEntries((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          command: "photobook",
          output: [INFOS.i18n[lang].pbStopped],
        },
      ]);
      inputRef.current?.focus();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      handleStop();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isPhotobookPlaying, lang]);

  const executeCommand = async (rawCmd: string) => {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    // Add to history
    setHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(/\s+/);
    const cmdName = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (cmdName === "clear" || cmdName === "cls" || cmdName === "effacer") {
      setEntries([]);
      setInputVal("");
      return;
    }

    const commandObj = findCommand(cmdName);

    if (commandObj) {
      if (commandObj.name === "photobook") {
        setEntries((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            command: trimmed,
            output: [...INFOS.i18n[lang].pbWarning],
            isPromptPending: true,
          },
        ]);
        setInputVal("");
        return;
      }

      const result = await commandObj.execute(args, cmdContext);
      setEntries((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          command: trimmed,
          output: result,
        },
      ]);
    } else {
      // Check for pending photobook answers (y / n / o)
      const lastEntry = entries[entries.length - 1];
      if (lastEntry?.isPromptPending) {
        if (cmdName === "y" || cmdName === "yes" || cmdName === "o" || cmdName === "oui") {
          startPhotobook();
          setInputVal("");
          return;
        } else {
          setEntries((prev) => [
            ...prev,
            {
              id: String(Date.now()),
              command: trimmed,
              output: [INFOS.i18n[lang].pbCancelled],
            },
          ]);
          setInputVal("");
          return;
        }
      }

      // Not found
      setEntries((prev) => [
        ...prev,
        {
          id: String(Date.now()),
          command: trimmed,
          output: [
            `${INFOS.i18n[lang].notFound}${trimmed}`,
            INFOS.i18n[lang].helpHint,
          ],
        },
      ]);
    }

    setInputVal("");
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      executeCommand(inputVal);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length === 0) return;
      const nextIndex = historyIndex === -1 ? history.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setInputVal(history[nextIndex]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex === -1) return;
      const nextIndex = historyIndex + 1;
      if (nextIndex >= history.length) {
        setHistoryIndex(-1);
        setInputVal("");
      } else {
        setHistoryIndex(nextIndex);
        setInputVal(history[nextIndex]);
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (!inputVal.trim()) return;
      const current = inputVal.toLowerCase();
      const match = COMMAND_LIST.map((c) => c.name).find((name) => name.startsWith(current));
      if (match) {
        setInputVal(match);
      }
    }
  };

  const renderOutputItem = (item: OutputItem, idx: number) => {
    if (typeof item === "string") {
      if (item === "") return <div key={idx} className="h-2" />;
      const isDim = item.startsWith("[ ok ]");
      return (
        <div
          key={idx}
          className={`leading-relaxed whitespace-pre-wrap ${
            isDim ? "text-[var(--dim)] text-xs font-mono" : "text-[var(--fg)]"
          }`}
        >
          {item}
        </div>
      );
    }

    if (Array.isArray(item)) {
      const [label, url] = item;
      return (
        <div key={idx} className="my-1">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-[var(--acc)] hover:underline"
          >
            {label}
          </a>
        </div>
      );
    }

    if ("t" in item) {
      if (item.t === "art") {
        return (
          <pre
            key={idx}
            className="font-mono text-xs sm:text-sm leading-tight text-[var(--acc)] bg-[var(--bg)] my-2 p-3 rounded-xs border border-[var(--line)] overflow-x-auto select-text"
          >
            {item.content}
          </pre>
        );
      }

      if (item.t === "table") {
        const table = item as TableContent;
        return (
          <div key={idx} className="my-3 overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse font-mono">
              {table.head && (
                <thead>
                  <tr className="border-b border-[var(--line)] text-[var(--dim)]">
                    {table.head.map((th, hIdx) => (
                      <th key={hIdx} className="py-1.5 pr-4 font-medium uppercase tracking-wider text-[11px]">
                        {th}
                      </th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody>
                {table.rows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="border-b border-[var(--line)]/50 hover:bg-[var(--line)]/20 transition-colors"
                  >
                    {row.map((cell, cIdx) => {
                      const isFirstCol = cIdx === 0;
                      if (Array.isArray(cell)) {
                        return (
                          <td key={cIdx} className="py-2 pr-4 align-top font-medium">
                            <a
                              href={cell[1]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[var(--acc)] hover:underline"
                            >
                              {cell[0]}
                            </a>
                          </td>
                        );
                      }
                      return (
                        <td
                          key={cIdx}
                          className={`py-2 pr-4 align-top ${
                            isFirstCol ? "font-semibold text-[var(--acc)] whitespace-nowrap" : "text-[var(--fg)]"
                          }`}
                        >
                          {cell}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      }
    }

    return null;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 flex flex-col flex-1 min-h-[calc(100vh-44px)] font-mono">
      {/* Terminal log output */}
      <div className="flex-1 space-y-4 pb-4">
        {entries.map((entry) => (
          <div key={entry.id} className="space-y-1">
            {/* Command line */}
            <div className="flex items-center gap-2 text-sm sm:text-base font-semibold">
              <span className="prompt-symbol select-none">&gt;</span>
              <span className="text-[var(--fg)]">{entry.command}</span>
            </div>

            {/* Output */}
            <div className="pl-4 border-l border-[var(--line)]/60 space-y-1">
              {entry.output.map((out, outIdx) => renderOutputItem(out, outIdx))}

              {/* Photobook interactive buttons */}
              {entry.isPromptPending && (
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      startPhotobook();
                    }}
                    className="px-3 py-1 bg-[var(--acc)] text-[var(--bg)] font-semibold text-xs rounded-xs hover:opacity-90 transition-opacity cursor-pointer"
                  >
                    ▶ {INFOS.i18n[lang].play}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEntries((prev) => [
                        ...prev,
                        {
                          id: String(Date.now()),
                          command: "cancel",
                          output: [INFOS.i18n[lang].pbCancelled],
                        },
                      ]);
                    }}
                    className="px-3 py-1 border border-[var(--line)] text-[var(--fg)] text-xs rounded-xs hover:border-[var(--dim)] transition-colors cursor-pointer"
                  >
                    {INFOS.i18n[lang].cancel}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        <div ref={bottomRef} />
      </div>

      {/* Input prompt bar */}
      <div className="sticky bottom-0 bg-[var(--bg)]/95 backdrop-blur-xs pt-2 pb-3 border-t border-[var(--line)]">
        <div className="flex items-center gap-2 py-1 px-2 rounded-xs border border-[var(--line)] focus-within:border-[var(--acc)] focus-within:ring-1 focus-within:ring-[var(--acc)] transition-all">
          <span className="prompt-symbol font-bold select-none text-base sm:text-lg">&gt;</span>
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onInput={(e) => setInputVal((e.target as HTMLInputElement).value)}
            onKeyDown={handleKeyDown}
            placeholder={INFOS.i18n[lang].placeholder}
            className="flex-1 bg-transparent border-none outline-none text-[var(--fg)] text-sm sm:text-base font-mono placeholder-[var(--dim)]/60 caret-[var(--acc)]"
            autoComplete="off"
            autoCapitalize="off"
            spellcheck={false}
          />
        </div>

        {/* Quick action chips */}
        <Chips lang={lang} onSelect={executeCommand} />
      </div>

      {/* Photobook Fullscreen Overlay */}
      {isPhotobookPlaying && photobookTools.length > 0 && (
        <div
          className="pb-modal"
          onClick={() => setIsPhotobookPlaying(false)}
          title="Click to stop"
        >
          <img
            src={photobookTools[photobookIndex][2]}
            alt={photobookTools[photobookIndex][0]}
          />
          <div className="text-center space-y-1">
            <div className="pb-caption text-base font-mono">
              [{photobookIndex + 1}/{photobookTools.length}] {photobookTools[photobookIndex][0]}
            </div>
            <div className="pb-hint">{INFOS.i18n[lang].pbHint}</div>
          </div>
        </div>
      )}
    </div>
  );
}
