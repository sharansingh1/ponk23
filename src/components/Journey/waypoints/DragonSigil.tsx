export default function DragonSigil({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden>
      <circle cx="100" cy="100" r="94" fill="none" stroke="var(--color-honey)" strokeWidth="1.5" opacity="0.5" />
      <path
        d="M100 40
           C 60 45, 45 75, 60 100
           C 70 118, 95 118, 100 100
           C 104 84, 88 76, 78 86
           C 72 92, 78 100, 86 98"
        fill="none"
        stroke="var(--color-honey)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* spikes along the back */}
      {[
        [66, 52],
        [56, 62],
        [50, 74],
      ].map(([x, y], i) => (
        <path key={i} d={`M${x} ${y} l-6 -8 l10 2 z`} fill="var(--color-honey)" />
      ))}
      {/* head + horn */}
      <path d="M100 40 l10 -14 l4 12" fill="var(--color-honey)" opacity="0.9" />
      <circle cx="101" cy="41" r="2.5" fill="var(--color-citrus)" />
    </svg>
  );
}
