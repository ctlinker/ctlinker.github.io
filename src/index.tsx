import { hydrate, prerender as ssr } from "preact-iso";

import preactLogo from "./assets/preact.svg";
import "./style.css";
import { TypeWritter } from "./component/type-writer";
import { Header } from "./component/header";
import "animate.css";
import { ParticuleCanvas } from "./component/particule-canvas";

export function App() {
  return (
    <div class="w-screen h-screen">
      <ParticuleCanvas className="fixed -z-10 " />
      <Header />
      <section>
        <pre>
          <TypeWritter
            flavor="plain"
            speed={25}
            content={"Welcome to my corner of the web"}
          />
        </pre>
      </section>
    </div>
  );
}

function Resource(props) {
  return (
    <a href={props.href} target="_blank" class="resource">
      <h2>{props.title}</h2>
      <p>{props.description}</p>
    </a>
  );
}

if (typeof window !== "undefined") {
  hydrate(<App />, document.getElementById("app"));
}

export async function prerender(data) {
  return await ssr(<App {...data} />);
}
