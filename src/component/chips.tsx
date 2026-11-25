import type { Command } from "../cmd/_type";
import type { Lang } from "../i18n";

type Props = {
  commands: Command[];
  lang: Lang;
  onRun: (command: Command) => void;
};

/** Touch-friendly shortcut bar: one button per visible command. */
export function Chips({ commands, lang, onRun }: Props) {
  return (
    <nav class="chips" aria-label="commands">
      {commands
        .filter((c) => !c.hidden)
        .map((c) => (
          <button type="button" key={c.name} onClick={() => onRun(c)}>
            {c.label?.[lang] ?? c.name}
          </button>
        ))}
    </nav>
  );
}
