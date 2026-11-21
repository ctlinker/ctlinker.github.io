import type { Locale, TableContent } from "../infos";

export type OutputItem =
  | string
  | [string, string] // [label, url]
  | TableContent
  | { t: "art"; content: string };

export type CommandResult = OutputItem[];

export type CommandContext = {
  lang: Locale;
  setLang: (lang: Locale) => void;
  theme: "light" | "dark";
  toggleTheme: () => void;
  accent: string;
  cycleAccent: () => string;
  triggerPhotobook: () => void;
};

export type Command = {
  name: string;
  aliases: string[];
  description: Record<Locale, string>;
  execute: (args: string[], ctx: CommandContext) => CommandResult | Promise<CommandResult>;
};
