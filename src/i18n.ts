export type Lang = "en" | "fr";
export type I18n = Record<Lang, string>;

export const LANGS: Lang[] = ["en", "fr"];

/** Terminal chrome strings (command output content lives in infos.ts). */
export const ui: Record<
  Lang,
  {
    help: string;
    helpHint: string;
    nf: string;
    nfh: string;
    themeok: string;
    accent: string;
    who: string;
    sudo: string[];
    reboot: string[];
    pb: string[];
    cancel: string;
    stopped: string;
    end: string;
    hint: string;
    play: string;
    no: string;
    hello: string;
    ph: string;
    langok: string;
    boot: string[];
    cols: { cmd: string; desc: string; lang: string; level: string; stack: string; since: string; project: string };
    sections: { language: string; framework: string; ai: string };
    sayHello: string;
    hints: { pong: string; spaceshooter: string };
  }
> = {
  en: {
    help: "available commands:",
    helpHint: "tip: Tab completes, ↑ ↓ browse history, any key skips typing.",
    nf: "command not found: ",
    nfh: "type help to list commands",
    themeok: "theme: ",
    accent: "accent: ",
    who: "ctlinker — systems · servers · making some noise",
    sudo: [
      "ctlinker is not in the sudoers file. This incident will be reported.",
      "(kidding. nothing was reported.)",
    ],
    reboot: ["[ ok ] stopping shell", "rebooting…"],
    pb: [
      "⚠ WARNING: rapid image sequence",
      "may trigger seizures in people with photosensitive epilepsy.",
      "images change about 3 times per second, no strobing.",
      "press any key or click to stop at any time.",
      "",
      "type y and press enter to play, anything else cancels.",
    ],
    cancel: "cancelled.",
    stopped: "stopped.",
    end: "end of photobook.",
    hint: "any key or click to stop",
    play: "play",
    no: "cancel",
    hello: "tap a command below, or type one. try: about, projects, skills",
    ph: "type a command…",
    langok: "language: English",
    boot: [
      "[ ok ] mounting /home/ctlinker",
      "[ ok ] loading profile",
      "[ ok ] indexing projects",
      "[ ok ] starting shell",
    ],
    cols: {
      cmd: "command",
      desc: "description",
      lang: "language",
      level: "level",
      stack: "stack",
      since: "experience",
      project: "project",
    },
    sections: { language: "languages", framework: "frameworks & tools", ai: "ai tooling" },
    sayHello: "say hello:",
    hints: {
      pong: "↑ ↓ / mouse / touch to move · first to 5 · esc to quit",
      spaceshooter: "← → / mouse / touch to move · space / click / hold to shoot · esc to quit",
    },
  },
  fr: {
    help: "commandes disponibles :",
    helpHint: "astuce : Tab complète, ↑ ↓ parcourent l’historique, une touche saute l’animation.",
    nf: "commande introuvable : ",
    nfh: "tapez aide pour lister les commandes",
    themeok: "thème : ",
    accent: "accent : ",
    who: "ctlinker — systèmes · serveurs · faire un peu de bruit",
    sudo: [
      "ctlinker ne figure pas dans le fichier sudoers. Cet incident sera signalé.",
      "(je plaisante. rien n’a été signalé.)",
    ],
    reboot: ["[ ok ] arrêt du shell", "redémarrage…"],
    pb: [
      "⚠ AVERTISSEMENT : séquence d’images rapide",
      "peut déclencher des crises chez les personnes atteintes d’épilepsie photosensible.",
      "les images changent environ 3 fois par seconde, sans effet stroboscopique.",
      "appuyez sur une touche ou cliquez pour arrêter à tout moment.",
      "",
      "tapez o puis entrée pour lancer, toute autre réponse annule.",
    ],
    cancel: "annulé.",
    stopped: "arrêté.",
    end: "fin du photobook.",
    hint: "appuyez sur une touche ou cliquez pour arrêter",
    play: "lancer",
    no: "annuler",
    hello: "touchez une commande ci-dessous, ou tapez-en une. essayez : à propos, projets, compétences",
    ph: "tapez une commande…",
    langok: "langue : français",
    boot: [
      "[ ok ] montage de /home/ctlinker",
      "[ ok ] chargement du profil",
      "[ ok ] indexation des projets",
      "[ ok ] démarrage du shell",
    ],
    cols: {
      cmd: "commande",
      desc: "description",
      lang: "langage",
      level: "niveau",
      stack: "stack",
      since: "expérience",
      project: "projet",
    },
    sections: { language: "langages", framework: "frameworks & outils", ai: "outils d’IA" },
    sayHello: "dites bonjour :",
    hints: {
      pong: "↑ ↓ / souris / toucher pour bouger · premier à 5 · échap pour quitter",
      spaceshooter: "← → / souris / toucher pour bouger · espace / clic / maintenir pour tirer · échap pour quitter",
    },
  },
};

export type UI = (typeof ui)[Lang];
