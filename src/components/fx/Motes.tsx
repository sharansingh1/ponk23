"use client";

import { useEffect, useRef } from "react";

type MotesProps = {
  /** Particles per 10,000 px² of canvas. Default keeps it sparse and expensive-looking. */
  density?: number;
  /** CSS color for the mote glow. */
  color?: string;
  /** Upward drift speed multiplier. */
  speed?: number;
  className?: string;
};

type Mote = {
  x: number;
  y: number;
  r: number;
  vy: number;
  sway: number;
  phase: number;
  alpha: number;
};

/**
 * Ambient dust-in-golden-light particle field on a lazy canvas.
 * Lives between a media plate and the foreground subject — the layer
 * that makes a scene feel like it contains air. Pauses offscreen and
 * disables itself entirely under prefers-reduced-motion.
 */
export default function Motes({
  density = 0.16,
  color = "oklch(0.85 0.14 85)",
  speed = 1,
  className = "",
}: MotesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let motes: Mote[] = [];
    let raf = 0;
    let running = false;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Pre-render one soft sprite; drawImage is far cheaper than per-frame gradients.
    const sprite = document.createElement("canvas");
    const S = 64;
    sprite.width = S;
    sprite.height = S;
    const sctx = sprite.getContext("2d")!;
    const grad = sctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
    grad.addColorStop(0, color);
    grad.addColorStop(1, "transparent");
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, S, S);

    function seed() {
      const { width, height } = canvas!.getBoundingClientRect();
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(((width * height) / 10_000) * density);
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 1.5 + Math.random() * 3.5,
        vy: (0.08 + Math.random() * 0.2) * speed,
        sway: 8 + Math.random() * 18,
        phase: Math.random() * Math.PI * 2,
        alpha: 0.25 + Math.random() * 0.5,
      }));
    }

    function frame(t: number) {
      const { width, height } = canvas!.getBoundingClientRect();
      ctx!.clearRect(0, 0, width, height);
      for (const m of motes) {
        m.y -= m.vy;
        if (m.y < -10) {
          m.y = height + 10;
          m.x = Math.random() * width;
        }
        const x = m.x + Math.sin(t / 3000 + m.phase) * m.sway;
        ctx!.globalAlpha = m.alpha * (0.7 + 0.3 * Math.sin(t / 1600 + m.phase));
        ctx!.drawImage(sprite, x - m.r * 2, m.y - m.r * 2, m.r * 4, m.r * 4);
      }
      ctx!.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    seed();
    const io = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? start() : stop()),
      { threshold: 0 },
    );
    io.observe(canvas);

    const ro = new ResizeObserver(seed);
    ro.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
    };
  }, [density, color, speed]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    />
  );
}
