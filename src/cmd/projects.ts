import { INFOS } from "../infos";
import type { Command, CommandContext, CommandResult } from "./_type";

export const projectsCmd: Command = {
  name: "projects",
  aliases: ["work", "projets", "portfolio"],
  description: {
    en: "featured open-source work",
    fr: "projets open-source principaux",
  },
  execute: (_args: string[], ctx: CommandContext): CommandResult => {
    const projects = INFOS.content[ctx.lang].projects;
    return [projects];
  },
};
