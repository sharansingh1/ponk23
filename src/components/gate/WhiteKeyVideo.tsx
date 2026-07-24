"use client";

import { useEffect, useRef } from "react";

type WhiteKeyVideoProps = {
  src: string;
  className?: string;
  /** Called once, when the clip finishes playing through. */
  onEnded?: () => void;
};

// Luminance range over which white keys out to transparent. Soft falloff
// (not a hard cutoff) so the parchment's own torn edges don't get a
// jagged halo.
const OPAQUE_BELOW = 205;
const TRANSPARENT_ABOVE = 248;

/**
 * A background-video with a pure white backdrop, keyed to transparent in
 * real time via canvas pixel processing. MP4/H.264 can't carry an alpha
 * channel, so this is the general-purpose way to composite a
 * white-background clip (e.g. from Canva's "remove background," which
 * swaps the scene for solid white rather than true transparency) over
 * anything, regardless of what's behind it.
 */
export default function WhiteKeyVideo({ src, className = "", onEnded }: WhiteKeyVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    let raf = 0;
    let stopped = false;
    const RENDER_WIDTH = 480; // downscaled render target; perf, not display size

    const setSize = () => {
      if (!video.videoWidth) return;
      canvas.width = RENDER_WIDTH;
      canvas.height = Math.round((RENDER_WIDTH * video.videoHeight) / video.videoWidth);
    };

    const draw = () => {
      if (stopped) return;
      if (video.readyState >= 2 && canvas.width > 0) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const d = frame.data;
        const range = TRANSPARENT_ABOVE - OPAQUE_BELOW;
        for (let i = 0; i < d.length; i += 4) {
          const lum = (d[i] + d[i + 1] + d[i + 2]) / 3;
          const t = Math.min(1, Math.max(0, (lum - OPAQUE_BELOW) / range));
          d[i + 3] = Math.round((1 - t) * 255);
        }
        ctx.putImageData(frame, 0, 0);
      }
      raf = requestAnimationFrame(draw);
    };

    const handleEnded = () => {
      stopped = true;
      onEnded?.();
    };

    video.addEventListener("loadedmetadata", setSize);
    video.addEventListener("ended", handleEnded);
    setSize();
    video.play().catch(() => {});
    raf = requestAnimationFrame(draw);

    return () => {
      stopped = true;
      cancelAnimationFrame(raf);
      video.removeEventListener("loadedmetadata", setSize);
      video.removeEventListener("ended", handleEnded);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

  return (
    <>
      <video ref={videoRef} src={src} muted playsInline autoPlay preload="auto" className="hidden" />
      <canvas ref={canvasRef} className={className} />
    </>
  );
}
