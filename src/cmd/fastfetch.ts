import infos from "../infos";
import type { ArtRow, Command } from "./_type";

const join = (keys: string[], map: (k: string) => string) => keys.map(map).join(" · ");

export const fastfetch: Command = {
  name: "fastfetch",
  aliases: ["ff", "neofetch"],
  description: { en: "system info block", fr: "bloc d’infos système" },
  function: (_args, { lang }) => {
    const art = infos.me.ascii.split("\n");
    const width = Math.max(...art.map((l) => l.length)) + 4;
    const title = `${infos.me.handle}@portfolio`;
    const info: { key?: string; val: string }[] = [
      { val: title },
      { val: "─".repeat(title.length) },
      { key: "OS", val: "ctlinker/web v1.0" },
      { key: "Shell", val: "/bin/portfolio" },
      {
        key: "Lang",
        val: join(
          Object.values(infos.language)
            .filter((l) => l.level === "proficient" || ["Rust", "Zig"].includes(l.name))
            .map((l) => l.name),
          (x) => x,
        ),
      },
      { key: "Frame", val: join(["react", "bun", "hono", "astrojs"], (k) => infos.names[k] ?? k) },
      { key: "AI", val: join(["gemini", "claude", "chatgpt"], (k) => infos.names[k] ?? k) },
      { key: "Work", val: infos.me.status[lang] },
    ];
    // Logo is vertically centred against the info column.
    const top = Math.max(0, Math.floor((info.length - art.length) / 2));
    const rows: ArtRow[] = info.map((row, i) => ({
      art: (art[i - top] ?? "").padEnd(width),
      key: row.key ? row.key.padEnd(7) : undefined,
      val: row.val,
    }));
    return [{ t: "art", rows }];
  },
};
