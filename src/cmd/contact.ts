import { INFOS } from "../infos";
import type { Command, CommandContext, CommandResult } from "./_type";

export const contactCmd: Command = {
  name: "contact",
  aliases: ["email", "mail"],
  description: {
    en: "reach out and contact links",
    fr: "coordonnées et liens de contact",
  },
  execute: (_args: string[], ctx: CommandContext): CommandResult => {
    const isEn = ctx.lang === "en";
    const header = isEn
      ? "Say hello or inquire about client projects:"
      : "Dites bonjour ou écrivez pour une mission :";

    const mailto = `mailto:${INFOS.me.email}?subject=${encodeURIComponent(
      isEn ? "Hello from your portfolio" : "Bonjour depuis votre portfolio"
    )}`;

    return [
      header,
      [`→ ${INFOS.me.email}`, mailto],
      "",
      INFOS.content[ctx.lang].contact,
    ];
  },
};
