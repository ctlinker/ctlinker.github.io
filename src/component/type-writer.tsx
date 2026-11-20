import { useEffect, useState } from "preact/hooks";

type Props = {
  content: string;
  speed?: number;
  className?: string;
  flavor: "plain" | "gibbrish";
};

export function TypeWritter({
  className,
  content,
  speed = 50,
  flavor = "plain",
  ...props
}: Props) {
  const [current, setCurrent] = useState("");

  function plainTypeWriting() {
    let interval: any;
    if (current.length < content.length) {
      interval = setInterval(() => {
        const next = content[current.length];
        setCurrent((prev) => prev + next);
      }, speed);
    }
    return () => clearInterval(interval);
  }

  function gibberishTypeWriting() {
    let interval: any;
    let symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    if (current.length < content.length - 1) {
      interval = setInterval(() => {
        const next = content.slice(0, current.length);
        const prev = current.slice(0, current.length);
        const gibberish = symbols[Math.floor(Math.random() * symbols.length)];

        if (prev.length == 0) {
          setCurrent(gibberish);
        } else {
          setCurrent(next + gibberish);
        }
      }, speed);
    } else {
      setCurrent(content);
    }

    return () => clearInterval(interval);
  }

  useEffect(() => {
    return flavor == "plain" ? plainTypeWriting() : gibberishTypeWriting();
  }, [current, content, speed]);

  return (
    <span className={className} {...props}>
      {current}
    </span>
  );
}
