import { useEffect, useState } from "preact/hooks";
import { TypeWritter } from "./type-writer";

export function Header() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }),
      );
    };

    updateTime();

    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header
      className="flex items-center w-full h-10
      bg-white border-b border-white/20 text-sm"
    >
      <h1 className="h-full flex items-center px-3 select-none">
        <TypeWritter speed={20} content="ctlinker://Portfolio" />
      </h1>

      <div
        className="ml-auto flex items-center gap-3 px-3
        h-full select-none animate__animated animate__lightSpeedInRight"
      >
        <span className="text-xs tabular-nums">{time}</span>

        <span
          className="w-2 h-2 bg-amber-600
          animate-pulse rounded-sm"
        />
      </div>
    </header>
  );
}
