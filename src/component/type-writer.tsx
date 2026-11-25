import {
  useEffect,
  useState,
  useRef,
  type StateUpdater,
  type Dispatch,
} from "preact/hooks";

type Props = {
  content: string;
  speed?: number;
  className?: string;
  setReady?: Dispatch<StateUpdater<boolean>>;
  /** Fired once the full content has been typed (either flavor). */
  onDone?: () => void;
  flavor: "plain" | "gibbrish";
};

export function TypeWritter({
  className,
  content,
  speed = 50,
  flavor = "plain",
  setReady,
  onDone,
  ...props
}: Props) {
  const [current, setCurrent] = useState("");
  const timerRef = useRef<number>(NaN);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

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
      } else {
        if (flavor === "gibbrish") {
          // final reveal of full content
          setCurrent(content);

          if (setReady instanceof Function) {
            setReady(true);
          }
        }
        onDoneRef.current?.();
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
