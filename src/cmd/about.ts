import { INFOS } from "../infos";
import type { Command, CommandContext, CommandResult } from "./_type";

export const aboutCmd: Command = {
  name: "about",
  aliases: ["whoami", "apropos", "a propos", "bio"],
  description: {
    en: "personal bio and background",
    fr: "bio et présentation personnelle",
  },
  execute: (_args: string[], ctx: CommandContext): CommandResult => {
    const data = INFOS.content[ctx.lang];
    return [
      ...data.about,
      "",
      data.activity,
    ];
  },
};
