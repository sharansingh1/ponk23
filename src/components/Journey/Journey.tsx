"use client";

import { useRef } from "react";
import JourneyRoad from "./JourneyRoad";
import JourneyBackground from "./JourneyBackground";

type JourneyProps = {
  stopCount: number;
  children: React.ReactNode;
};

export default function Journey({ stopCount, children }: JourneyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="relative">
      <JourneyBackground containerRef={containerRef} />
      <JourneyRoad stopCount={stopCount} containerRef={containerRef} />
      {/* max-w-3xl (not 2xl): gives the wider photo slots (FriendSlot's
          own max-w-2xl) real room to reach their target width, while still
          leaving enough side margin at typical desktop widths for the
          winding road to stay visible past the card's edge. */}
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col">{children}</div>
    </div>
  );
}
