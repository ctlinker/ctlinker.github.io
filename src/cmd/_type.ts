import type { I18n, Lang, UI } from "../i18n";

export type Cell = string | { text: string; href: string };
export type ArtRow = { art: string; key?: string; val?: string };

/** One renderable unit of command output. A bare string is a plain typed line. */
export type Line =
  | string
  | { t: "text"; text: string; cls?: string }
  | { t: "link"; text: string; href: string }
  | { t: "table"; head?: string[]; rows: Cell[][] }
  | { t: "art"; rows: ArtRow[] }
  | { t: "chart"; title?: string; unit: string; bars: { label: string; value: number; text: string }[] }
  | { t: "mountain"; tiers: string[]; peaks: { label: string; altitude: number; tier: string; note: string }[] }
  | { t: "heatmap"; user: string }
  | { t: "confirm"; yes: string; no: string };

/** Everything a command may need from the host terminal. */
export type Ctx = {
  lang: Lang;
  ui: UI;
  /** The name/alias the user actually typed. */
  invoked: string;
  /** Unnormalized argument substring after the command name. */
  rawArgs: string;
  setLang: (l: Lang) => void;
  toggleTheme: () => string;
  cycleAccent: () => string;
  clear: () => void;
  /** Opens a full-screen mini-game. */
  launch: (game: "pong" | "spaceshooter") => void;
  /** Reloads the page after command output finishes. */
  reboot: () => void;
  commands: Command[];
};

export type Command = {
  name: string;
  aliases: string[];
  description: I18n;
  /** Localised display name (chips, completion). Defaults to `name`. */
  label?: I18n;
  /** Hidden commands are runnable but not listed (easter eggs). */
  hidden?: boolean;
  function: (args: string[], ctx: Ctx) => Line[];
};

export const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();

export class CommandRegister {
  commands: Command[] = [];

  register(command: Command) {
    this.commands.push(command);
    return this;
  }

  private keys(c: Command) {
    return [c.name, ...c.aliases, c.label?.en, c.label?.fr]
      .filter((x): x is string => !!x)
      .map(normalize);
  }

  /** Resolve raw input (may contain args, may be a two-word label like "a propos"). */
  find(raw: string): { command: Command; args: string[]; rawArgs: string; invoked: string } | null {
    const trimmed = raw.trim();
    const rawTokens = trimmed.split(/\s+/).filter(Boolean);
    const tokens = normalize(trimmed).split(/\s+/).filter(Boolean);
    for (const n of [2, 1]) {
      if (tokens.length < n) continue;
      const head = tokens.slice(0, n).join(" ");
      const command = this.commands.find((c) => this.keys(c).includes(head));
      if (command) {
        return {
          command,
          args: tokens.slice(n),
          rawArgs: rawTokens.slice(n).join(" "),
          invoked: head,
        };
      }
    }
    return null;
  }

  /** Returns null when the command is unknown. */
  run(raw: string, ctx: Omit<Ctx, "invoked" | "rawArgs" | "commands">): Line[] | null {
    const hit = this.find(raw);
    if (!hit) return null;
    return hit.command.function(hit.args, {
      ...ctx,
      invoked: hit.invoked,
      rawArgs: hit.rawArgs,
      commands: this.commands,
    });
  }

  label(c: Command, lang: Lang) {
    return c.label?.[lang] ?? c.name;
  }

  /** Visible command labels beginning with `prefix` (Tab completion). */
  complete(prefix: string, lang: Lang): string[] {
    const p = normalize(prefix);
    if (!p) return [];
    return this.commands
      .filter((c) => !c.hidden)
      .map((c) => this.label(c, lang))
      .filter((l) => normalize(l).startsWith(p));
  }
}
