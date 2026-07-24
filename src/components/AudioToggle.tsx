"use client";

import { useEffect, useState } from "react";
import { isMuted, toggleMute, subscribe } from "@/lib/audio";

export default function AudioToggle() {
  const [muted, setMuted] = useState(() => isMuted());

  useEffect(() => {
    return subscribe(() => setMuted(isMuted()));
  }, []);

  return (
    <button
      onClick={toggleMute}
      aria-label={muted ? "Unmute ambient sound" : "Mute ambient sound"}
      className="ease-premium fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-honey/40 bg-night-deep/80 text-paper backdrop-blur transition-transform duration-150 hover:border-honey/70 hover:scale-105 active:scale-95"
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 9v6h4l5 5V4L8 9H4z" fill="currentColor" stroke="none" />
        {muted ? (
          <path d="M16 9l5 6M21 9l-5 6" strokeLinecap="round" />
        ) : (
          <path d="M16.5 8.5a5 5 0 010 7M19 6a9 9 0 010 12" strokeLinecap="round" />
        )}
      </svg>
    </button>
  );
}
