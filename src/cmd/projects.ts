import infos from "../infos";
import type { Command } from "./_type";

export const projects: Command = {
  name: "projects",
  aliases: ["work", "projets"],
  label: { en: "projects", fr: "projets" },
  description: { en: "things I build", fr: "ce que je construis" },
  function: (_args, { lang, ui }) => [
    {
      t: "table",
      head: [ui.cols.project, ui.cols.desc],
      rows: infos.projects.map((p) => [{ text: p.name, href: p.url }, p.desc[lang]]),
    },
  ],
};
