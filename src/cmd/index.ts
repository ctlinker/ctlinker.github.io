import { INFOS, type Locale } from "../infos";
import type { Command, CommandContext, CommandResult } from "./_type";
import { aboutCmd } from "./about";
import { contactCmd } from "./contact";
import { fastfetchCmd } from "./fastfetch";
import { projectsCmd } from "./projects";
import { skillsCmd } from "./skills";

export const helpCmd: Command = {
  name: "help",
  aliases: ["?", "aide", "h"],
  description: {
    en: "show available commands",
    fr: "affiche les commandes disponibles",
  },
  execute: (_args: string[], ctx: CommandContext): CommandResult => {
    const i18n = INFOS.i18n[ctx.lang];
    const rows = COMMAND_LIST.map((cmd) => {
      const label = i18n.labels[cmd.name as keyof typeof i18n.labels] || cmd.name;
      const desc = cmd.description[ctx.lang];
      return [label, desc];
    });

    return [
      i18n.help,
      {
        t: "table" as const,
        head: [ctx.lang === "en" ? "Command" : "Commande", ctx.lang === "en" ? "Description" : "Description"],
        rows,
      },
    ];
  },
};

export const themeCmd: Command = {
  name: "theme",
  aliases: ["mode", "dark", "light"],
  description: {
    en: "toggle light / dark mode",
    fr: "basculer mode clair / sombre",
  },
  execute: (_args: string[], ctx: CommandContext): CommandResult => {
    ctx.toggleTheme();
    const next = ctx.theme === "dark" ? "light" : "dark";
    return [`${INFOS.i18n[ctx.lang].themeChanged}${next}`];
  },
};

export const accentCmd: Command = {
  name: "accent",
  aliases: ["color", "couleur"],
  description: {
    en: "cycle color palette (green, blue, cyan, purple)",
    fr: "changer la couleur d'accent (vert, bleu, cyan, violet)",
  },
  execute: (_args: string[], ctx: CommandContext): CommandResult => {
    const nextAccent = ctx.cycleAccent();
    return [`${INFOS.i18n[ctx.lang].accentChanged}${nextAccent}`];
  },
};

export const langCmd: Command = {
  name: "lang",
  aliases: ["en", "fr", "language", "langue"],
  description: {
    en: "switch language (FR / EN)",
    fr: "changer de langue (FR / EN)",
  },
  execute: (args: string[], ctx: CommandContext): CommandResult => {
    let target: Locale = ctx.lang === "en" ? "fr" : "en";
    if (args[0]) {
      const a = args[0].toLowerCase();
      if (a === "fr" || a === "francais" || a === "français") target = "fr";
      else if (a === "en" || a === "english") target = "en";
    }
    ctx.setLang(target);
    return [INFOS.i18n[target].langChanged];
  },
};

export const sudoCmd: Command = {
  name: "sudo",
  aliases: ["su", "admin", "root"],
  description: {
    en: "privilege escalation easter egg",
    fr: "easter egg élévation de privilèges",
  },
  execute: (_args: string[], ctx: CommandContext): CommandResult => {
    return [...INFOS.i18n[ctx.lang].sudo];
  },
};

export const photobookCmd: Command = {
  name: "photobook",
  aliases: ["photos", "photo", "pb"],
  description: {
    en: "interactive image showcase sequence",
    fr: "séquence visuelle interactive",
  },
  execute: (_args: string[], ctx: CommandContext): CommandResult => {
    ctx.triggerPhotobook();
    return [...INFOS.i18n[ctx.lang].pbWarning];
  },
};

export const clearCmd: Command = {
  name: "clear",
  aliases: ["cls", "effacer"],
  description: {
    en: "clear terminal output",
    fr: "effacer l'écran du terminal",
  },
  execute: (): CommandResult => {
    return [];
  },
};

export const COMMAND_LIST: Command[] = [
  helpCmd,
  aboutCmd,
  fastfetchCmd,
  skillsCmd,
  projectsCmd,
  contactCmd,
  photobookCmd,
  themeCmd,
  accentCmd,
  langCmd,
  clearCmd,
  sudoCmd,
];

const commandMap = new Map<string, Command>();

for (const cmd of COMMAND_LIST) {
  commandMap.set(cmd.name.toLowerCase(), cmd);
  for (const alias of cmd.aliases) {
    commandMap.set(alias.toLowerCase(), cmd);
  }
}

export function findCommand(name: string): Command | undefined {
  const normalized = name.trim().toLowerCase();
  // Check exact / alias map
  if (commandMap.has(normalized)) {
    return commandMap.get(normalized);
  }
  // Check configured aliases from INFOS
  const mapped = INFOS.aliases[normalized];
  if (mapped && commandMap.has(mapped)) {
    return commandMap.get(mapped);
  }
  return undefined;
}
