import { hydrate, prerender as ssr } from "preact-iso";

import "./style.css";
import "animate.css";
import { Header } from "./component/header";
import { ParticuleCanvas } from "./component/particule-canvas";
import { Comets } from "./component/comets";
import { Terminal } from "./component/terminal";
import { usePrefs } from "./prefs";

export function App() {
  const prefs = usePrefs();

  return (
    <div class="app">
      <ParticuleCanvas className="bg" />
      <Comets className="bg" />
      <Header prefs={prefs} />
      <main>
        <Terminal prefs={prefs} />
      </main>
    </div>
  );
}

if (typeof window !== "undefined") {
  hydrate(<App />, document.getElementById("app")!);
}

export async function prerender(data: Record<string, unknown>) {
  return await ssr(<App {...data} />);
}
