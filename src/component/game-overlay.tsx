import { useEffect, useRef } from "preact/hooks";
import { pong } from "../games/pong";
import { spaceshooter } from "../games/spaceshooter";
import type { Game } from "../games/util";
import type { Lang } from "../i18n";

export const games: Record<string, Game> = { pong, spaceshooter };

type Props = { game: string; lang: Lang; hint: string; onExit: () => void };

/** Full-screen canvas host for the mini-games. Esc or the ✕ button leaves. */
export function GameOverlay({ game, lang, hint, onExit }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const exit = useRef(onExit);
  exit.current = onExit;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !games[game]) return;
    const cleanup = games[game](canvas, lang);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && exit.current();
    document.addEventListener("keydown", esc);
    return () => {
      cleanup();
      document.removeEventListener("keydown", esc);
    };
  }, [game]);

  return (
    <div class="game" role="dialog" aria-label={game}>
      <canvas ref={ref} class="game-cv" />
      <div class="game-hint">{hint}</div>
      <button type="button" class="game-x" aria-label="close" onClick={onExit}>
        ✕
      </button>
    </div>
  );
}
