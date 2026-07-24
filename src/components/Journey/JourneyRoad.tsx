"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  generateRoadPoints,
  pointsToSmoothPath,
  roadPointForStop,
  ROAD_VIEW_WIDTH,
  ROAD_SECTION_HEIGHT,
} from "@/lib/path";

gsap.registerPlugin(ScrollTrigger);

type JourneyRoadProps = {
  stopCount: number;
  containerRef: React.RefObject<HTMLDivElement | null>;
};

export default function JourneyRoad({ stopCount, containerRef }: JourneyRoadProps) {
  const pathRef = useRef<SVGPathElement>(null);
  const discRef = useRef<SVGGElement>(null);
  const sunGroupRef = useRef<SVGGElement>(null);
  const moonGroupRef = useRef<SVGGElement>(null);
  const nodeRefs = useRef<(SVGCircleElement | null)[]>([]);

  const totalHeight = stopCount * ROAD_SECTION_HEIGHT;
  const d = useMemo(() => pointsToSmoothPath(generateRoadPoints(stopCount)), [stopCount]);
  const nodePoints = useMemo(
    () => Array.from({ length: stopCount }, (_, i) => roadPointForStop(i, stopCount)),
    [stopCount],
  );

  useEffect(() => {
    const pathEl = pathRef.current;
    const container = containerRef.current;
    if (!pathEl || !container) return;

    const length = pathEl.getTotalLength();
    gsap.set(pathEl, { strokeDasharray: length, strokeDashoffset: length });

    const st = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.6,
      onUpdate: (self) => {
        const progress = self.progress;
        gsap.set(pathEl, { strokeDashoffset: length * (1 - progress) });

        const point = pathEl.getPointAtLength(length * progress);
        if (discRef.current) {
          gsap.set(discRef.current, { attr: { transform: `translate(${point.x}, ${point.y})` } });
        }
        // Sun-to-moon crossfade: the disc reads as citrus/marigold sunlight
        // near the top, pale honey/silver moonlight by the bottom — same
        // day-into-night beat as the background sky.
        if (sunGroupRef.current && moonGroupRef.current) {
          gsap.set(sunGroupRef.current, { opacity: gsap.utils.clamp(0, 1, 1 - progress * 1.35) });
          gsap.set(moonGroupRef.current, { opacity: gsap.utils.clamp(0, 1, progress * 1.35) });
        }

        nodeRefs.current.forEach((node, i) => {
          if (!node) return;
          const lit = progress >= (i + 0.5) / stopCount;
          gsap.to(node, { scale: lit ? 1.6 : 1, opacity: lit ? 1 : 0.35, duration: 0.4, transformOrigin: "center" });
        });
      },
    });

    return () => st.kill();
  }, [containerRef, stopCount]);

  return (
    <svg
      viewBox={`0 0 ${ROAD_VIEW_WIDTH} ${totalHeight}`}
      preserveAspectRatio="none"
      className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
      aria-hidden
    >
      <path
        ref={pathRef}
        d={d}
        fill="none"
        stroke="var(--color-honey)"
        strokeWidth={2.5}
        strokeLinecap="round"
        opacity={0.7}
      />

      {nodePoints.map((p, i) => (
        <circle
          key={i}
          ref={(el) => {
            nodeRefs.current[i] = el;
          }}
          cx={p.x}
          cy={p.y}
          r={7}
          fill="var(--color-citrus)"
          opacity={0.35}
        />
      ))}

      <g ref={discRef}>
        <g ref={sunGroupRef}>
          <circle r={16} fill="var(--color-citrus)" />
          <circle r={26} fill="var(--color-marigold)" opacity={0.35} />
        </g>
        <g ref={moonGroupRef} opacity={0}>
          <circle r={14} fill="var(--color-paper)" />
          <circle r={24} fill="var(--color-honey)" opacity={0.3} />
        </g>
      </g>
    </svg>
  );
}
