/**
 * Spinning circular-text stamp (the CineDaily corner badge move).
 * Pure SVG textPath; the whole badge rotates on a slow linear loop.
 */
export default function OrbitBadge({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none ${className}`}>
      <div className="animate-spin-slow h-full w-full">
        <svg viewBox="0 0 160 160" className="h-full w-full">
          <defs>
            <path
              id="orbit-circle"
              d="M 80,80 m -58,0 a 58,58 0 1,1 116,0 a 58,58 0 1,1 -116,0"
            />
          </defs>
          <circle cx="80" cy="80" r="78" fill="var(--color-night-deep)" fillOpacity="0.55" />
          <circle
            cx="80"
            cy="80"
            r="78"
            fill="none"
            stroke="var(--color-honey)"
            strokeOpacity="0.4"
            strokeWidth="1"
          />
          <text
            className="font-stamp"
            fill="var(--color-honey)"
            fontSize="13.5"
            letterSpacing="3.5"
          >
            <textPath href="#orbit-circle">
              PRIYANKA&apos;S 23RD ✦ GOLDEN HOUR ✦ LEO SEASON ✦
            </textPath>
          </text>
        </svg>
      </div>
      {/* static center glyph while the ring spins around it */}
      <span className="absolute inset-0 flex items-center justify-center font-display text-3xl italic text-citrus">
        &#9804;
      </span>
    </div>
  );
}
