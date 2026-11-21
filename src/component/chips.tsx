import { INFOS, type Locale } from "../infos";

type ChipsProps = {
  lang: Locale;
  onSelect: (cmd: string) => void;
  disabled?: boolean;
};

export function Chips({ lang, onSelect, disabled = false }: ChipsProps) {
  const i18n = INFOS.i18n[lang];
  const items = [
    { cmd: "about", label: i18n.labels.about },
    { cmd: "fastfetch", label: i18n.labels.fastfetch },
    { cmd: "skills", label: i18n.labels.skills },
    { cmd: "projects", label: i18n.labels.projects },
    { cmd: "contact", label: i18n.labels.contact },
    { cmd: "photobook", label: i18n.labels.photobook },
    { cmd: "help", label: i18n.labels.help },
    { cmd: "theme", label: i18n.labels.theme },
    { cmd: "clear", label: i18n.labels.clear },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2 pt-3 pb-1 border-t border-[var(--line)]">
      <span className="text-xs text-[var(--dim)] mr-1 hidden sm:inline select-none">
        {lang === "fr" ? "Accès rapide :" : "Quick actions:"}
      </span>
      {items.map((it) => (
        <button
          key={it.cmd}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(it.cmd)}
          className="px-2.5 py-1 text-xs font-mono rounded-xs border border-[var(--line)] bg-[var(--bg)] text-[var(--fg)] hover:border-[var(--acc)] hover:text-[var(--acc)] active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none"
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
