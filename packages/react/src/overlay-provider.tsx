"use client";

import { createElement, useSyncExternalStore, type ComponentType, type ReactNode } from "react";
import type { OverlayInstance, OverlayStore } from "./overlay-manager.js";
import { createOverlayStack } from "./overlay-stack.js";
import type { CueBackdrop, CueComponents, OverlayContext } from "./types.js";

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
  const stack = createOverlayStack(overlays, backdrop);

  return (
    <>
      {stack.backdrop
        ? createElement(stack.backdrop, { key: "cue-backdrop", close: stack.close })
        : null}
      {stack.visible.map((overlay) => (
        <OverlayInstance key={overlay.id} overlay={overlay} components={components} />
      ))}
    </>
  );
}

function OverlayInstance<C extends CueComponents>({
  overlay,
  components,
}: {
  overlay: OverlayInstance;
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

  return overlay.definition.render(overlay.props, context);
}
