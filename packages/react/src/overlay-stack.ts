import type { OverlayInstance } from "./overlay-manager.js";
import type { CueBackdrop, CueBackdropCloseOptions } from "./types.js";

export type OverlayStack = {
  visible: OverlayInstance[];
  backdrop?: CueBackdrop;
  close: (options: CueBackdropCloseOptions) => void;
};

export function createOverlayStack(
  overlays: OverlayInstance[],
  backdrop?: CueBackdrop,
): OverlayStack {
  const visible = overlays.filter((overlay) => overlay.visible);
  const open = visible.filter((overlay) => overlay.open);
  const activeBackdrop = open.length > 0 ? getBackdrop(open, backdrop) : undefined;
  const top = open[open.length - 1];

  function close(options: CueBackdropCloseOptions) {
    if (options.strategy === "last") {
      top?.close();
      return;
    }

    for (const overlay of open) {
      overlay.close();
    }
  }

  return {
    visible,
    backdrop: activeBackdrop,
    close,
  };
}

function getBackdrop(visible: OverlayInstance[], backdrop?: CueBackdrop) {
  for (let index = visible.length - 1; index >= 0; index -= 1) {
    const override = visible[index]?.definition.backdrop;

    if (override !== undefined) {
      return override || undefined;
    }
  }

  return backdrop;
}
