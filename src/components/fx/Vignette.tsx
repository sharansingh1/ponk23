/**
 * Lens-style corner darkening over any media plate.
 * Sits absolutely inside a relative parent; never intercepts input.
 */
export default function Vignette({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`vignette pointer-events-none absolute inset-0 ${className}`}
    />
  );
}
