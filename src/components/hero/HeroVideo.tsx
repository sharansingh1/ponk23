"use client";

import { useEffect, useRef } from "react";

/**
 * The far plate: looping beach footage with a poster frame that paints
 * instantly (no black flash), a slow perpetual camera push-in, and a
 * mobile-sized variant swapped in before the source is assigned.
 * Src is set imperatively so the poster owns the first paint.
 */
export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reveal = () => {
      video.style.opacity = "1";
    };

    const mq = window.matchMedia("(max-width: 768px)");

    const applySource = () => {
      const next = mq.matches ? "/videos/hero-beach-mobile.mp4" : "/videos/hero-beach-web.mp4";
      if (video.src.endsWith(next)) return;
      video.src = next;
      // Reveal on playback start OR on the play() promise resolving —
      // covers the case where "playing" already fired on a previous
      // effect pass (dev double-invoke) and never re-fires.
      video.play().then(reveal).catch(reveal);
    };

    video.addEventListener("playing", reveal);
    applySource();
    // If playback already started on a previous effect pass (dev
    // double-invoke) the "playing" event will never re-fire — reveal now.
    if (!video.paused && video.readyState > 2) reveal();
    mq.addEventListener("change", applySource);

    return () => {
      video.removeEventListener("playing", reveal);
      mq.removeEventListener("change", applySource);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Poster underneath paints immediately; video fades over it once playing. */}
      <div
        aria-hidden
        className="animate-slow-zoom absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/hero-beach-poster.jpg)" }}
      />
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        poster="/images/hero-beach-poster.jpg"
        className="animate-slow-zoom absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-1000"
        aria-label="Waves rolling onto a beach at sunset"
      />
    </div>
  );
}
