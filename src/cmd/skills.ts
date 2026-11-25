import infos from "../infos";
import type { Command } from "./_type";
import { ui, type I18n, type Lang } from "../i18n";

const levels: Record<string, { alt: number; label: I18n }> = {
  decent: { alt: 1, label: { en: "decent", fr: "correct" } },
  intermediate: { alt: 2, label: { en: "intermediate", fr: "intermédiaire" } },
  good: { alt: 3, label: { en: "good", fr: "bon" } },
  proficient: { alt: 4, label: { en: "proficient", fr: "maîtrisé" } },
};

const TIERS = ["decent", "intermediate", "good", "proficient"] as const;

const duration = (v: string, lang: Lang) =>
  lang === "en"
    ? v.replace("years", " years").replace("year", " year").replace("months", " months")
    : v.replace("years", " ans").replace("year", " an").replace("months", " mois");

const name = (k: string) => infos.names[k] ?? k;

/** "2years+" → 2, "1year+" → 1, "6months+" → 0.5 */
const years = (v: string) => {
  const n = parseFloat(v);
  return /month/.test(v) ? n / 12 : n;
};

const bars = (src: Record<string, string>, lang: Lang) =>
  Object.entries(src).map(([k, v]) => ({ label: name(k), value: years(v), text: duration(v, lang) }));

export const skills: Command = {
  name: "skills",
  aliases: ["stack", "language", "languages", "competences"],
  label: { en: "skills", fr: "compétences" },
  description: { en: "languages, frameworks and tools", fr: "langages, frameworks et outils" },
  function: (_args, { lang }) => {
    const u = ui[lang];
    return [
      { t: "text", text: u.sections.language, cls: "h" },
      {
        t: "mountain",
        tiers: TIERS.map((k) => levels[k].label[lang]),
        peaks: Object.values(infos.language).map((l) => {
          const lv = levels[l.level] ?? levels.decent;
          return { label: l.name, altitude: lv.alt, tier: lv.label[lang], note: l.note[lang] };
        }),
      },
      { t: "text", text: u.sections.framework, cls: "h" },
      { t: "chart", unit: lang === "fr" ? "années" : "years", bars: bars(infos.framework, lang) },
      { t: "text", text: u.sections.ai, cls: "h" },
      { t: "chart", unit: lang === "fr" ? "années" : "years", bars: bars(infos.ai, lang) },
    ];
  },
};
