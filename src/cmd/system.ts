import infos from "../infos";
import type { Command } from "./_type";

export const help: Command = {
  name: "help",
  aliases: ["?"],
  label: { en: "help", fr: "aide" },
  description: { en: "list available commands", fr: "lister les commandes" },
  function: (_args, { lang, ui, commands }) => [
    { t: "text", text: ui.help, cls: "h" },
    {
      t: "table",
      rows: commands
        .filter((c) => !c.hidden)
        .map((c) => [c.label?.[lang] ?? c.name, c.description[lang]]),
    },
    { t: "text", text: ui.helpHint, cls: "dim" },
  ],
};

export const theme: Command = {
  name: "theme",
  aliases: [],
  label: { en: "theme", fr: "thème" },
  description: { en: "toggle light / dark", fr: "basculer clair / sombre" },
  function: (_a, { toggleTheme, ui }) => [ui.themeok + toggleTheme()],
};

export const accent: Command = {
  name: "accent",
  aliases: [],
  label: { en: "accent", fr: "accent" },
  description: { en: "cycle green → blue → cyan → purple", fr: "alterner vert → bleu → cyan → violet" },
  function: (_a, { cycleAccent, ui }) => [ui.accent + cycleAccent()],
};

export const clear: Command = {
  name: "clear",
  aliases: ["cls"],
  label: { en: "clear", fr: "effacer" },
  description: { en: "clear the terminal", fr: "effacer le terminal" },
  function: (_a, { clear }) => {
    clear();
    return [];
  },
};

export const lang: Command = {
  name: "lang",
  aliases: ["fr", "en", "langue", "francais", "english"],
  label: { en: "lang", fr: "langue" },
  description: { en: "switch language (fr / en)", fr: "changer de langue (fr / en)" },
  function: (args, ctx) => {
    const word = args[0] ?? ctx.invoked;
    const next = ["fr", "francais"].includes(word) ? "fr" : ["en", "english"].includes(word) ? "en" : ctx.lang === "fr" ? "en" : "fr";
    ctx.setLang(next);
    return [next === "fr" ? "langue : français" : "language: English"];
  },
};

export const sudo: Command = {
  name: "sudo",
  aliases: [],
  hidden: true,
  description: { en: "?", fr: "?" },
  function: (_a, { ui }) => ui.sudo,
};

export const reboot: Command = {
  name: "reboot",
  aliases: ["restart"],
  hidden: true,
  description: { en: "reboot the shell", fr: "redémarrer le shell" },
  function: (_a, { ui, reboot }) => {
    reboot();
    return ui.reboot.map((text) => ({ t: "text", text, cls: "dim" }));
  },
};

export const echo: Command = {
  name: "echo",
  aliases: [],
  hidden: true,
  description: { en: "print text to the terminal", fr: "afficher du texte dans le terminal" },
  function: (_a, { rawArgs }) => [rawArgs.replace(/^(['"])(.*)\1$/, "$2")],
};

const wrap = (text: string, max = 40): string[] => {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (!words.length) return [""];
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if (!cur) cur = w;
    else if (cur.length + 1 + w.length <= max) cur += " " + w;
    else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
};

const say = (text: string, sprite: string[]) => {
  const lines = wrap(text.replace(/^(['"])(.*)\1$/, "$2"));
  const w = Math.max(...lines.map((l) => l.length));
  const top = " " + "_".repeat(w + 2);
  const bot = " " + "-".repeat(w + 2);
  const body =
    lines.length === 1
      ? [`< ${lines[0].padEnd(w)} >`]
      : lines.map((l, i) => {
          const [open, close] =
            i === 0 ? ["/", "\\"] : i === lines.length - 1 ? ["\\", "/"] : ["|", "|"];
          return `${open} ${l.padEnd(w)} ${close}`;
        });
  return [{ t: "art" as const, rows: [top, ...body, bot, ...sprite].map((art) => ({ art })) }];
};

const COW = [
  "        \\   ^__^",
  "         \\  (oo)\\_______",
  "            (__)\\       )\\/\\",
  "                ||----w |",
  "                ||     ||",
];

const TUX = [
  "   \\",
  "    \\",
  "        .--.",
  "       |o_o |",
  "       |:_/ |",
  "      //   \\ \\",
  "     (|     | )",
  "    /'\\_   _/`\\",
  "    \\___)=(___/",
];

export const cowsay: Command = {
  name: "cowsay",
  aliases: ["cow"],
  hidden: true,
  description: { en: "cow says something", fr: "la vache parle" },
  function: (_a, { rawArgs, lang }) => say(rawArgs || (lang === "fr" ? "meuh." : "moo."), COW),
};

export const tuxsay: Command = {
  name: "tuxsay",
  aliases: ["tux"],
  hidden: true,
  description: { en: "Tux says something", fr: "Tux parle" },
  function: (_a, { rawArgs }) => say(rawArgs || "arch btw.", TUX),
};

const listBin = (commands: Command[], lang: "en" | "fr") => [
  { t: "text" as const, text: "/usr/bin:", cls: "h" },
  {
    t: "table" as const,
    rows: commands.map((c) => [`/usr/bin/${c.name}`, c.description[lang]]),
  },
];

export const ls: Command = {
  name: "ls",
  aliases: ["dir", "ll"],
  hidden: true,
  description: { en: "list /usr/bin binaries", fr: "lister les binaires de /usr/bin" },
  function: (_a, { commands, lang }) => listBin(commands, lang),
};

export const cd: Command = {
  name: "cd",
  aliases: ["pwd"],
  hidden: true,
  description: { en: "change directory", fr: "changer de répertoire" },
  function: (args, { commands, lang, invoked }) => {
    if (invoked === "pwd") return [{ t: "text", text: "/home/ctlinker", cls: "dim" }];
    const dest = args[0] ?? "~";
    if (dest === "/usr/bin" || dest === "/bin" || dest === "usr/bin" || dest === "bin") {
      return listBin(commands, lang);
    }
    if (dest === "~" || dest === "/" || dest === ".." || dest === "/home/ctlinker") {
      return [{ t: "text", text: "/home/ctlinker", cls: "dim" }];
    }
    return [
      {
        t: "text",
        text:
          lang === "fr"
            ? `cd: aucun fichier ou dossier : ${dest} (essayez /usr/bin)`
            : `cd: no such file or directory: ${dest} (try /usr/bin)`,
        cls: "dim",
      },
    ];
  },
};

export const pong: Command = {
  name: "pong",
  aliases: [],
  description: { en: "classic pong against the machine", fr: "pong classique contre la machine" },
  function: (_a, { ui, launch }) => {
    launch("pong");
    return [{ t: "text", text: "pong — " + ui.hints.pong, cls: "dim" }];
  },
};

export const spaceshooter: Command = {
  name: "spaceshooter",
  aliases: ["shooter", "space shooter", "space"],
  description: { en: "shoot the comets before they hit you", fr: "détruisez les comètes avant l’impact" },
  function: (_a, { ui, launch }) => {
    launch("spaceshooter");
    return [{ t: "text", text: "spaceshooter — " + ui.hints.spaceshooter, cls: "dim" }];
  },
};

export const heatmap: Command = {
  name: "heatmap",
  aliases: ["git", "github", "contrib", "contributions"],
  description: { en: "GitHub contribution heatmap (last year)", fr: "calendrier des contributions GitHub (1 an)" },
  function: () => [{ t: "heatmap", user: infos.me.handle }],
};

export const photobook: Command = {
  name: "photobook",
  aliases: ["photo", "photos"],
  label: { en: "photobook", fr: "photos" },
  description: { en: "tools I use, as a fast slideshow (flashing warning)", fr: "mes outils en diaporama rapide (avertissement clignotement)" },
  function: (_a, { ui }) => [...ui.pb, { t: "confirm", yes: ui.play, no: ui.no }],
};
