import { useSyncExternalStore } from "react";
import { OverlayManager } from "./overlay-manager.js";

export function OverlayProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <OverlayOutlet />
    </>
  );
}

function OverlayOutlet() {
  const overlays = useOverlays();
  const visible = overlays.filter((overlay) => overlay.visible);

  return (
    <>
      {visible.map((overlay) => (
        <overlay.component key={overlay.id} {...overlay.props} open={overlay.open} />
      ))}
    </>
  );
}

function useOverlays() {
  const overlays = useSyncExternalStore(
    OverlayManager.subscribe,
    OverlayManager.all,
    OverlayManager.all,
  );

  return overlays;
}
