const ITEMS = [
  "Priyanka's 23rd",
  "Tequila Sunrise",
  "Leo Season",
  "Golden Hour",
  "Est. 2003",
];

function Band() {
  return (
    <div className="flex shrink-0 items-center">
      {ITEMS.map((item) => (
        <span key={item} className="flex items-center">
          <span className="font-stamp whitespace-nowrap px-6 text-sm tracking-[0.3em] text-honey/90 md:px-10 md:text-base">
            {item.toUpperCase()}
          </span>
          <span aria-hidden className="text-citrus/70">
            &#10022;
          </span>
        </span>
      ))}
    </div>
  );
}

/**
 * The kinetic band along the hero's base (the one marquee on the page).
 * Two copies of the content shift by exactly half the track width for a
 * seamless loop; the slight tilt keeps it feeling like a poster element.
 */
export default function HeroMarquee({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`-rotate-[1.5deg] overflow-hidden border-y border-honey/25 bg-night-deep/50 py-3 backdrop-blur-md ${className}`}
    >
      <div className="animate-marquee flex w-max">
        <Band />
        <Band />
      </div>
    </div>
  );
}
