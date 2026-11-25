import type { I18n } from "./i18n";

const t = (en: string, fr: string): I18n => ({ en, fr });

/** Single source of truth for portfolio content. FR/EN are kept in parity. */
export default {
  me: {
    handle: "ctlinker",
    tagline: t(
      "systems · servers · making some noise",
      "systèmes · serveurs · faire un peu de bruit",
    ),
    description: t(
      "I do a bit of everything but my main focus is on systems, servers and making some noise",
      "Je fais un peu de tout, mais je me concentre surtout sur les systèmes, les serveurs et faire un peu de bruit",
    ),
    status: t("open to client projects", "ouvert aux missions clients"),
    email: "ctlinker.dev@gmail.com",
    github: "https://github.com/ctlinker",
    /** Plain multiline logo. Swap freely: fastfetch renders it as-is. */
    ascii: `   ██████╗
  ██╔════╝
  ██║
  ██║
  ╚██████╗
   ╚═════╝`,
  },
  language: {
    go: { name: "Go", level: "proficient", note: t("CLI, backend, mid-to-low-level", "CLI, backend, niveau moyen à bas") },
    typescript: { name: "TypeScript", level: "proficient", note: t("bun/node: libraries, tooling, UI", "bun/node : bibliothèques, outillage, UI") },
    c: { name: "C", level: "proficient", note: t("performance-critical, embedded", "code critique en performance, embarqué") },
    rust: { name: "Rust", level: "good", note: t("systems experiments", "expériences système") },
    javascript: { name: "JavaScript", level: "good", note: t("the web, naturally", "le web, naturellement") },
    zig: { name: "Zig", level: "intermediate", note: t("experiments and AI", "expériences et IA") },
    python: { name: "Python", level: "intermediate", note: t("proofs of concept", "preuves de concept") },
    html: { name: "HTML", level: "decent", note: t("markup", "balisage") },
    css: { name: "CSS", level: "decent", note: t("styling", "mise en forme") },
  },
  framework: {
    astrojs: "2years+",
    react: "2years+",
    bun: "2years+",
    vue: "2years+",
    cloudflare: "1year+",
    hono: "6months+",
    tailwind: "6months+",
    docker: "6months+",
  },
  /** Display names for framework / ai keys (falls back to the key). */
  names: {
    astrojs: "Astro",
    react: "React",
    bun: "Bun",
    vue: "Vue",
    cloudflare: "Cloudflare",
    hono: "Hono",
    tailwind: "Tailwind",
    docker: "Docker",
    gemini: "Gemini",
    claude: "Claude",
    chatgpt: "ChatGPT",
    githubCopilot: "GitHub Copilot",
  } as Record<string, string>,
  projects: [
    {
      name: "monitext",
      desc: t("TypeScript observability & structured logging", "observabilité et logging structuré pour TypeScript"),
      url: "https://github.com/ctlinker",
    },
    {
      name: "takyon",
      desc: t("lightweight Linux container manager (CLI + dashboard)", "gestionnaire de conteneurs Linux léger (CLI + tableau de bord)"),
      url: "https://github.com/ctlinker",
    },
    {
      name: "nylun",
      desc: t("low-level UI programming language (formerly Lone)", "langage de programmation UI bas niveau (anciennement Lone)"),
      url: "https://github.com/ctlinker",
    },
  ],
  ai: {
    gemini: "6months+",
    claude: "6months+",
    chatgpt: "1year+",
    githubCopilot: "1year+",
  },
};
