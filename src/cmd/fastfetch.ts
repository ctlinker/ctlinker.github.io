import { INFOS } from "../infos";
import type { Command, CommandContext, CommandResult } from "./_type";

export const fastfetchCmd: Command = {
  name: "fastfetch",
  aliases: ["ff", "fetch", "neofetch"],
  description: {
    en: "display system & stack overview",
    fr: "vue d'ensemble système & stack",
  },
  execute: (_args: string[], ctx: CommandContext): CommandResult => {
    const isEn = ctx.lang === "en";
    const statusText = INFOS.me.status[ctx.lang];

    const lines = [
      INFOS.me.ascii,
      `ctlinker@portfolio`,
      `────────────────────────────────────────────────`,
      `OS       : ctlinker/web (Linux x86_64 emulator)`,
      `Host     : Portfolio Presentation Engine v1.0`,
      `Shell    : /bin/portfolio-cli`,
      `Theme    : Green × Blue (${ctx.theme} mode)`,
      `Accent   : ${ctx.accent}`,
      `Lang     : ${isEn ? "English (EN)" : "Français (FR)"}`,
      `Skills   : TypeScript · Go · C · Rust · Zig · Python`,
      `Stack    : Preact · Vite · Tailwind · Bun · Hono`,
      `AI Dev   : Claude · Gemini · ChatGPT`,
      `Email    : ${INFOS.me.email}`,
      `GitHub   : ${INFOS.me.github}`,
      `Status   : ${statusText}`,
    ];

    return [{ t: "art", content: lines.join("\n") }];
  },
};
