/**
 * ModeLoadingFallback — shown for the brief moment a takeover
 * mode's JS chunk (terminal/ai/developer) is still downloading,
 * so switching modes never flashes a blank screen. Matches the
 * takeover shells' full-bleed dark surface.
 */
export function ModeLoadingFallback() {
  return (
    <div
      role="status"
      aria-label="Loading experience"
      className="fixed inset-0 z-[60] flex items-center justify-center bg-bg"
    >
      <div className="flex items-center gap-1.5" aria-hidden="true">
        {[0, 1, 2].map((d) => (
          <span
            key={d}
            className="h-2 w-2 animate-pulse-soft rounded-full bg-brand"
            style={{ animationDelay: `${d * 0.15}s` }}
          />
        ))}
      </div>
    </div>
  );
}
