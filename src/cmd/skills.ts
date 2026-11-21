import { INFOS } from "../infos";
import type { Command, CommandContext, CommandResult } from "./_type";

export const skillsCmd: Command = {
  name: "skills",
  aliases: ["stack", "lang", "languages", "techno", "tech"],
  description: {
    en: "languages, frameworks & tools",
    fr: "langages, frameworks et outils",
  },
  execute: (_args: string[], ctx: CommandContext): CommandResult => {
    const skills = INFOS.content[ctx.lang].skills;
    return [...skills];
  },
};
