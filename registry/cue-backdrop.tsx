export function CueBackdrop() {
  return (
    <div
      aria-hidden="true"
      data-slot="dialog-overlay"
      className="fixed inset-0 z-50 bg-black/50"
    />
  );
}
