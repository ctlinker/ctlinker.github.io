export type Locale = "en" | "fr";

export type TableContent = {
  t: "table";
  head?: string[];
  rows: (string | [string, string])[][];
};

export const DEFAULT_ASCII = `
  ██████╗
  ██╔════╝    ctlinker@portfolio
  ██║         ─────────────────────
  ██║         OS:    ctlinker/web v1.0
  ╚██████╗    Shell: /bin/portfolio
   ╚═════╝
`.trimEnd();

export const INFOS = {
  me: {
    handle: "ctlinker",
    tagline: "systems · servers · making some noise",
    ascii: DEFAULT_ASCII,
    status: {
      en: "open to client work",
      fr: "ouvert aux missions clients",
    },
    email: "ctlinker.dev@gmail.com",
    github: "https://github.com/ctlinker",
    githubUrl: "https://github.com/ctlinker",
  },
  commands: [
    "help",
    "about",
    "fastfetch",
    "skills",
    "projects",
    "contact",
    "photobook",
    "theme",
    "accent",
    "lang",
    "clear",
  ] as const,
  aliases: {
    "?": "help",
    aide: "help",
    whoami: "about",
    "a propos": "about",
    apropos: "about",
    ff: "fastfetch",
    fetch: "fastfetch",
    lang: "skills",
    languages: "skills",
    stack: "skills",
    techno: "skills",
    work: "projects",
    projets: "projects",
    activite: "activity",
    mail: "contact",
    email: "contact",
    photo: "photobook",
    photos: "photobook",
    cls: "clear",
    effacer: "clear",
    fr: "fr",
    francais: "fr",
    français: "fr",
    en: "en",
    english: "en",
  } as Record<string, string>,
  content: {
    en: {
      about: [
        "C — developer & designer.",
        "",
        "I build developer tooling, observability libraries, and UI work across self-directed projects under the Linker banner.",
        "I also take on client work: high-performance landing pages, dashboards, and full-stack web applications.",
      ],
      activity: {
        t: "table" as const,
        rows: [
          ["monitext", "TypeScript observability & structured logging library"],
          ["takyon", "Lightweight Linux container manager (CLI + dashboard)"],
          ["nylun", "Low-level UI programming language (formerly Lone)"],
          ["client work", "Landing pages, dashboards, and bespoke web apps"],
        ],
      },
      skills: [
        {
          t: "table" as const,
          head: ["Language", "Focus & Usage"],
          rows: [
            ["TypeScript", "bun / node: libraries, dev tooling, UI"],
            ["Go", "CLI utilities, backend systems, concurrent services"],
            ["C", "Performance-critical routines, low-level experiments"],
            ["Rust", "Systems programming, CLI tools, safety-critical code"],
            ["Zig", "Systems experiments and lightweight binaries"],
            ["Python", "Tooling, prototypes, data processing"],
            ["Bash", "Automation scripts, Linux workflows"],
            ["Nylun", "My custom low-level UI language"],
          ],
        },
        {
          t: "table" as const,
          head: ["Framework / Tool", "Experience"],
          rows: [
            ["Preact / React", "2+ years: SPAs, SSR, lightweight frontends"],
            ["Astro", "2+ years: content-focused static sites & docs"],
            ["Bun / Node", "2+ years: fast runtimes, APIs, test suites"],
            ["Hono / Express", "1+ year: edge APIs and microservices"],
            ["Tailwind CSS", "Modern responsive styling and design systems"],
            ["Docker / Linux", "Container orchestration & cloud environments"],
          ],
        },
      ],
      projects: {
        t: "table" as const,
        head: ["Project", "Description"],
        rows: [
          [["monitext", "https://github.com/ctlinker"], "Structured logging & observability library for TypeScript"],
          [["takyon", "https://github.com/ctlinker"], "Lightweight Linux container manager with web dashboard"],
          [["nylun", "https://github.com/ctlinker"], "Experimental low-level UI programming language"],
          [["portfolio", "https://github.com/ctlinker"], "This interactive terminal portfolio website"],
        ],
      },
      contact: {
        t: "table" as const,
        rows: [
          ["email", ["ctlinker.dev@gmail.com", "mailto:ctlinker.dev@gmail.com"]],
          ["github", ["github.com/ctlinker", "https://github.com/ctlinker"]],
          ["status", "open to client work & consulting"],
        ],
      },
    },
    fr: {
      about: [
        "C — développeur & designer.",
        "",
        "Je conçois des outils pour développeurs, des bibliothèques d'observabilité et des interfaces soignées sous la bannière Linker.",
        "J'interviens également sur des missions clients : landing pages percutantes, tableaux de bord et applications web complètes.",
      ],
      activity: {
        t: "table" as const,
        rows: [
          ["monitext", "Bibliothèque TypeScript d'observabilité et de logging structuré"],
          ["takyon", "Gestionnaire de conteneurs Linux léger (CLI + interface web)"],
          ["nylun", "Langage de programmation UI bas niveau (anciennement Lone)"],
          ["missions clients", "Landing pages, applications web et dashboards"],
        ],
      },
      skills: [
        {
          t: "table" as const,
          head: ["Langage", "Usage & Spécialité"],
          rows: [
            ["TypeScript", "bun / node : bibliothèques, outillage, UI"],
            ["Go", "CLI, backend, services systèmes concurrents"],
            ["C", "Code critique en performance, embarqué, systèmes"],
            ["Rust", "Programmation système, outils CLI fiables"],
            ["Zig", "Expérimentations systèmes et binaires légers"],
            ["Python", "Prototypes, scripts de données, automatisations"],
            ["Bash", "Scripts d'administration et pipelines Linux"],
            ["Nylun", "Mon propre langage d'interface bas niveau"],
          ],
        },
        {
          t: "table" as const,
          head: ["Framework / Outil", "Expérience"],
          rows: [
            ["Preact / React", "2+ ans : SPAs, SSR, interfaces réactives légères"],
            ["Astro", "2+ ans : sites statiques optimisés et documentation"],
            ["Bun / Node", "2+ ans : runtimes véloces, APIs, outillage"],
            ["Hono / Express", "1+ an : APIs légères pour l'edge"],
            ["Tailwind CSS", "Systèmes de design et intégrations responsives"],
            ["Docker / Linux", "Conteneurs et déploiements cloud"],
          ],
        },
      ],
      projects: {
        t: "table" as const,
        head: ["Projet", "Description"],
        rows: [
          [["monitext", "https://github.com/ctlinker"], "Logging structuré et observabilité pour TypeScript"],
          [["takyon", "https://github.com/ctlinker"], "Gestionnaire de conteneurs Linux léger avec dashboard"],
          [["nylun", "https://github.com/ctlinker"], "Langage expérimental de programmation d'interface bas niveau"],
          [["portfolio", "https://github.com/ctlinker"], "Ce portfolio interactif sous forme de terminal"],
        ],
      },
      contact: {
        t: "table" as const,
        rows: [
          ["email", ["ctlinker.dev@gmail.com", "mailto:ctlinker.dev@gmail.com"]],
          ["github", ["github.com/ctlinker", "https://github.com/ctlinker"]],
          ["statut", "ouvert aux missions clients & consulting"],
        ],
      },
    },
  },
  i18n: {
    en: {
      help: "available commands:",
      notFound: "command not found: ",
      helpHint: "type 'help' to list available commands",
      themeChanged: "theme switched: ",
      accentChanged: "accent switched: ",
      who: "c — developer & designer",
      sudo: [
        "c is not in the sudoers file. This incident will be reported.",
        "(just kidding. nothing was reported.)",
      ],
      pbWarning: [
        "⚠ WARNING: rapid image sequence",
        "May trigger discomfort in people with photosensitive sensitivity.",
        "Images change every ~350ms with no strobing.",
        "Press any key or click to stop at any time.",
        "",
        "Type 'y' and press Enter to play, or click a button below:",
      ],
      pbCancelled: "photobook cancelled.",
      pbStopped: "photobook stopped.",
      pbEnd: "end of photobook.",
      pbHint: "press any key or click to exit",
      play: "play",
      cancel: "cancel",
      hello: "type a command below or tap a chip. try: about, fastfetch, skills, projects",
      placeholder: "type a command… (e.g. help, about, fastfetch)",
      langChanged: "language: English",
      labels: {
        help: "help",
        about: "about",
        fastfetch: "fastfetch",
        skills: "skills",
        projects: "projects",
        contact: "contact",
        photobook: "photos",
        theme: "theme",
        accent: "accent",
        lang: "FR",
        clear: "clear",
      },
      descriptions: {
        help: "show this help menu",
        about: "personal bio and background",
        fastfetch: "display system & stack overview",
        skills: "languages, frameworks & tools",
        projects: "featured open-source work",
        contact: "reach out and contact links",
        photobook: "interactive image showcase sequence",
        theme: "toggle light / dark mode",
        accent: "cycle color palette (green, blue, cyan, purple)",
        lang: "switch language (FR / EN)",
        clear: "clear terminal output",
      },
    },
    fr: {
      help: "commandes disponibles :",
      notFound: "commande introuvable : ",
      helpHint: "tapez 'aide' pour lister les commandes disponibles",
      themeChanged: "thème basculé : ",
      accentChanged: "accent changé : ",
      who: "c — développeur & designer",
      sudo: [
        "c ne figure pas dans le fichier sudoers. Cet incident sera signalé.",
        "(je plaisante. rien n'a été signalé.)",
      ],
      pbWarning: [
        "⚠ AVERTISSEMENT : séquence d'images rapide",
        "Peut incommoder les personnes sensibles aux effets visuels rapides.",
        "Les images changent toutes les ~350ms sans flash stroboscopique.",
        "Appuyez sur n'importe quelle touche ou cliquez pour arrêter.",
        "",
        "Tapez 'o' et appuyez sur Entrée pour lancer, ou cliquez ci-dessous :",
      ],
      pbCancelled: "photobook annulé.",
      pbStopped: "photobook arrêté.",
      pbEnd: "fin du photobook.",
      pbHint: "appuyez sur une touche ou cliquez pour quitter",
      play: "lancer",
      cancel: "annuler",
      hello: "tapez une commande ou touchez un bouton. essayez : à propos, fastfetch, compétences",
      placeholder: "tapez une commande… (ex: aide, fastfetch, projets)",
      langChanged: "langue : Français",
      labels: {
        help: "aide",
        about: "à propos",
        fastfetch: "fastfetch",
        skills: "compétences",
        projects: "projets",
        contact: "contact",
        photobook: "photos",
        theme: "thème",
        accent: "accent",
        lang: "EN",
        clear: "effacer",
      },
      descriptions: {
        help: "affiche ce menu d'aide",
        about: "bio et présentation",
        fastfetch: "vue d'ensemble système & stack",
        skills: "langages, frameworks et outils",
        projects: "projets open-source principaux",
        contact: "coordonnées et liens",
        photobook: "séquence visuelle des outils",
        theme: "basculer mode clair / sombre",
        accent: "changer la couleur d'accent (vert, bleu, cyan, violet)",
        lang: "changer de langue (FR / EN)",
        clear: "effacer l'écran du terminal",
      },
    },
  },
};

export default INFOS;
