import infos from "../infos";
import type { Command } from "./_type";

export const about: Command = {
  name: "about",
  aliases: ["whoami", "me"],
  label: { en: "about", fr: "à propos" },
  description: { en: "short bio", fr: "courte présentation" },
  function: (_args, { lang, invoked }) => {
    if (invoked === "whoami") return [infos.me.handle + " — " + infos.me.tagline[lang]];
    return [
      { t: "text", text: `${infos.me.handle} — ${infos.me.tagline[lang]}`, cls: "h" },
      "",
      infos.me.description[lang] + ".",
      { t: "text", text: `status: ${infos.me.status[lang]}`, cls: "dim" },
    ];
  },
};
