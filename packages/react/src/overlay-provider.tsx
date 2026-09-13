"use client";

import {
  createElement,
  useId,
  useLayoutEffect,
  useSyncExternalStore,
  type ComponentType,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import type { OverlayInstance, OverlayStore } from "./overlay-manager.js";
import { createOverlayStack } from "./overlay-stack.js";
import type { CueBackdrop, CueComponents, OverlayContext, OverlayProviderProps } from "./types.js";

export type { OverlayProviderProps };

export function createOverlayProvider<C extends CueComponents>(params: {
  store: OverlayStore;
  components: C;
  backdrop?: CueBackdrop;
  teardown: () => void;
}): ComponentType<OverlayProviderProps> {
  let owner: string | null = null;
  const outletListeners = new Set<() => void>();

  function subscribeOutlet(listener: () => void) {
    outletListeners.add(listener);

    return () => {
      outletListeners.delete(listener);
    };
  }

  function getOwner() {
    return owner;
  }

  function notifyOutlet() {
    for (const listener of outletListeners) {
      listener();
    }
  }

  function OverlayProvider({ children, container }: OverlayProviderProps) {
    const id = useId();
    const outletOwner = useSyncExternalStore(subscribeOutlet, getOwner, getOwner);

    useLayoutEffect(() => {
      if (owner === null) {
        owner = id;
        notifyOutlet();
      } else if (owner !== id && isDev()) {
        console.warn(
          "Cue: OverlayProvider is already mounted for this Cue environment. This copy will not render overlays.",
        );
      }

      return () => {
        if (owner === id) {
          owner = null;
          params.teardown();
          notifyOutlet();
        }
      };
    }, [id]);

    return (
      <>
        {children}
        {outletOwner === id ? (
          <CuePortal container={container}>
            <OverlayOutlet
              store={params.store}
              components={params.components}
              backdrop={params.backdrop}
            />
          </CuePortal>
        ) : null}
      </>
    );
  }

  return OverlayProvider;
}

function CuePortal({
  container,
  children,
}: {
  container?: Element | DocumentFragment;
  children: ReactNode;
}) {
  const target = container ?? (typeof document === "undefined" ? null : document.body);

  if (target == null) {
    return null;
  }

  return createPortal(children, target);
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
        ? createElement(stack.backdrop, {
            key: "cue-backdrop",
            open: stack.backdropOpen,
            close: stack.close,
          })
        : null}
      {stack.mounted.map((overlay) => (
        <OverlayView key={overlay.id} overlay={overlay} components={components} />
      ))}
    </>
  );
}

function OverlayView<C extends CueComponents>({
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

function isDev() {
  const nodeProcess = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process;
  return nodeProcess?.env?.NODE_ENV !== "production";
}
