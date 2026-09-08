"use client";

import { createElement, useSyncExternalStore, type ComponentType, type ReactNode } from "react";
import type { OverlayStore } from "./overlay-manager.js";
import type { CueBackdrop, CueComponents, OverlayContext, OverlayDefinition } from "./types.js";

export type OverlayProviderProps = {
  children?: ReactNode;
};

export function createOverlayProvider<C extends CueComponents>(params: {
  store: OverlayStore;
  components: C;
  backdrop?: CueBackdrop;
}): ComponentType<OverlayProviderProps> {
  function OverlayProvider({ children }: OverlayProviderProps) {
    return (
      <>
        {children}
        <OverlayOutlet
          store={params.store}
          components={params.components}
          backdrop={params.backdrop}
        />
      </>
    );
  }

  return OverlayProvider;
}

function OverlayOutlet<C extends CueComponents>({
  store,
  components,
  backdrop,
}: {
  store: OverlayStore;
  components: C;
  backdrop?: CueBackdrop;
}) {
  const overlays = useSyncExternalStore(store.subscribe, store.all, store.all);
  const visible = overlays.filter((overlay) => overlay.visible);
  const openOverlays = visible.filter((overlay) => overlay.open);
  const Backdrop = getBackdrop(openOverlays, backdrop);

  return (
    <>
      {Backdrop && openOverlays.length > 0
        ? createElement(Backdrop, { key: "cue-backdrop" })
        : null}
      {visible.map((overlay) => (
        <OverlayInstance key={overlay.id} overlay={overlay} components={components} />
      ))}
    </>
  );
}

function OverlayInstance<C extends CueComponents>({
  overlay,
  components,
}: {
  overlay: {
    id: string;
    open: boolean;
    props: object;
    definition: OverlayDefinition;
    close: (options?: { result?: unknown; delay?: number }) => void;
  };
  components: C;
}) {
  const context: OverlayContext<C, unknown> = {
    open: overlay.open,
    onOpenChange(isOpen) {
      if (!isOpen) {
        overlay.close();
      }
    },
    close: overlay.close,
    components,
  };

  const render = overlay.definition.render as (
    props: object,
    context: OverlayContext<C, unknown>,
  ) => ReactNode;

  return render(overlay.props, context);
}

function getBackdrop(visible: { definition: OverlayDefinition }[], defaultBackdrop?: CueBackdrop) {
  for (let index = visible.length - 1; index >= 0; index -= 1) {
    const override = visible[index]?.definition.backdrop;

    if (override !== undefined) {
      return override || undefined;
    }
  }

  return defaultBackdrop;
}
