"use client";

import { useEffect, useRef } from "react";

/**
 * The real stone-threshold footage (torches, mist, carved arch) replacing
 * the CSS approximation. Poster paints instantly so there's no black
 * flash; video fades in once playback actually starts.
 */
export default function GateVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reveal = () => {
      video.style.opacity = "1";
    };

    video.addEventListener("playing", reveal);
    video.play().then(reveal).catch(reveal);
    if (!video.paused && video.readyState > 2) reveal();

    return () => video.removeEventListener("playing", reveal);
  }, []);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url(/images/gate-threshold-poster.jpg)" }}
      />
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        autoPlay
        preload="auto"
        poster="/images/gate-threshold-poster.jpg"
        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-1000"
      >
        <source src="/videos/gate-threshold.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
