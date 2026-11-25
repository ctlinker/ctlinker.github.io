import infos from "../infos";
import type { Command } from "./_type";

export const contact: Command = {
  name: "contact",
  aliases: ["email", "mail"],
  label: { en: "contact", fr: "contact" },
  description: { en: "email and GitHub", fr: "courriel et GitHub" },
  function: (_args, { lang, ui }) => [
    ui.sayHello,
    {
      t: "table",
      rows: [
        ["email", { text: infos.me.email, href: `mailto:${infos.me.email}` }],
        ["github", { text: infos.me.github.replace("https://", ""), href: infos.me.github }],
        [lang === "fr" ? "statut" : "status", infos.me.status[lang]],
      ],
    },
  ],
};
