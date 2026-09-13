import type { OverlayInstance } from "./overlay-manager.js";
import type { CueBackdrop, CueBackdropCloseOptions } from "./types.js";

export type OverlayStack = {
  mounted: OverlayInstance[];
  backdrop?: CueBackdrop;
  backdropOpen: boolean;
  close: (options: CueBackdropCloseOptions) => void;
};

export function createOverlayStack(
  overlays: OverlayInstance[],
  environmentBackdrop?: CueBackdrop,
): OverlayStack {
  const mounted = overlays;
  const open = mounted.filter((overlay) => overlay.open);
  const source = open.length > 0 ? open : mounted;
  const backdrop = resolveBackdrop(source, environmentBackdrop);
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
    mounted,
    backdrop,
    backdropOpen: open.length > 0 && backdrop !== undefined,
    close,
  };
}

function resolveBackdrop(instances: OverlayInstance[], environmentBackdrop?: CueBackdrop) {
  let inherit = false;

  for (let index = instances.length - 1; index >= 0; index -= 1) {
    const override = instances[index]?.definition.backdrop;

    if (override === false) {
      continue;
    }

    if (override !== undefined) {
      return override;
    }

    inherit = true;
  }

  return inherit ? environmentBackdrop : undefined;
}
