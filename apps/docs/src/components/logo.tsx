/** Spotlight mark. Uses CSS mask so it inherits `currentColor`. */
export function LogoMark({ className }: { className?: string }) {
  return <span className={className} aria-hidden />;
}
