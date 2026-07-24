/**
 * Warm split-tone film grade: a multiply layer that cools/deepens the
 * top and warms the base, plus an overlay lift over the focal band.
 * Turns raw footage into something that reads as graded film.
 */
export default function ColorGrade({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      <div className="grade-warm absolute inset-0" />
      <div className="grade-warm-lift absolute inset-0" />
    </div>
  );
}
