import { useEffect, useId, useRef } from "preact/hooks";

type ParticulesMap = {
  x: number[];
  y: number[];
};

function genParticules(count, maxX, maxY): ParticulesMap {}

function WebCanvas({ ...props }) {
  const targetId = useId();
  const particules = generateParticules();
  useEffect(() => {
    setInterval;
  });
  return <canvas onPlay={(e) => {}} {...props} id={targetId}></canvas>;
}
