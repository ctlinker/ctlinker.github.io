import { useEffect, useState, useRef } from "preact/hooks";

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
  const timerRef = useRef<number>(NaN);

  useEffect(() => {
    let index = 0;
    const symbols = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    const tick = () => {
      if (index < content.length) {
        if (flavor === "plain") {
          setCurrent(content.slice(0, index + 1));
        } else {
          // gibberish: show correct prefix + random symbol
          const prefix = content.slice(0, index);
          const gibberish = symbols[Math.floor(Math.random() * symbols.length)];
          setCurrent(index === 0 ? gibberish : prefix + gibberish);
        }
        index++;
        timerRef.current = setTimeout(tick, speed) as unknown as number;
      } else if (flavor === "gibbrish") {
        // final reveal of full content
        setCurrent(content);
      }
    };

    tick();
    return () => clearTimeout(timerRef.current);
  }, [content, speed, flavor]);

  return (
    <span className={className} {...props}>
      {current}
    </span>
  );
}
