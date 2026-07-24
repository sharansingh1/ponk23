type GlowPoolProps = {
  /** Any CSS color; defaults to the marigold token. */
  color?: string;
  /** Diameter as a CSS size (e.g. "60vmin"). */
  size?: string;
  /** Position of the glow's center within the parent. */
  x?: string;
  y?: string;
  className?: string;
};

/**
 * A breathing radial bloom placed behind a subject so it reads as a
 * light source casting into the scene rather than a pasted sticker.
 */
export default function GlowPool({
  color = "var(--color-marigold)",
  size = "58vmin",
  x = "50%",
  y = "55%",
  className = "",
}: GlowPoolProps) {
  return (
    <div
      aria-hidden
      className={`animate-glow-pulse pointer-events-none absolute rounded-full blur-3xl ${className}`}
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        background: `radial-gradient(circle, color-mix(in oklch, ${color} 55%, transparent) 0%, color-mix(in oklch, ${color} 20%, transparent) 45%, transparent 70%)`,
      }}
    />
  );
}
