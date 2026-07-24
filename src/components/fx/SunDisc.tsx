/**
 * The poster's anchor: a setting-sun disc with thin instrument rings,
 * sitting behind the subject the way CineDaily's red circle sits behind
 * Deadpool. The dashed ring rotates slowly; everything else holds still.
 */
export default function SunDisc({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none ${className}`}>
      <svg viewBox="0 0 800 800" className="h-full w-full">
        <defs>
          <radialGradient id="sun-disc-fill" cx="50%" cy="42%" r="60%">
            <stop offset="0%" stopColor="var(--color-citrus)" stopOpacity="0.95" />
            <stop offset="45%" stopColor="var(--color-marigold)" stopOpacity="0.85" />
            <stop offset="80%" stopColor="var(--color-grenadine)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--color-grenadine)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* the sun itself */}
        <circle cx="400" cy="400" r="330" fill="url(#sun-disc-fill)" />

        {/* instrument rings */}
        <circle
          cx="400"
          cy="400"
          r="352"
          fill="none"
          stroke="var(--color-honey)"
          strokeOpacity="0.35"
          strokeWidth="1.5"
        />
        <g className="animate-spin-reverse" style={{ transformOrigin: "400px 400px" }}>
          <circle
            cx="400"
            cy="400"
            r="388"
            fill="none"
            stroke="var(--color-honey)"
            strokeOpacity="0.45"
            strokeWidth="1.5"
            strokeDasharray="3 26"
            strokeLinecap="round"
          />
        </g>

        {/* cardinal ticks */}
        {[0, 90, 180, 270].map((deg) => (
          <line
            key={deg}
            x1="400"
            y1="24"
            x2="400"
            y2="44"
            stroke="var(--color-honey)"
            strokeOpacity="0.5"
            strokeWidth="2"
            transform={`rotate(${deg} 400 400)`}
          />
        ))}
      </svg>
    </div>
  );
}
