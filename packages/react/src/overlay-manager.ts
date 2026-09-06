import type { ComponentType } from "react";

export const OverlayManager = createOverlayManager();

export type OverlayProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export function createOverlay<P>(component: ComponentType<OverlayProps & P>) {
  const id = OverlayManager.add(component as ComponentType<Partial<OverlayProps>>);

  type OpenProps = P extends Record<string, unknown> ? [props: P] : [];

  function open(...props: OpenProps) {
    return OverlayManager.open(id, {
      ...props[0],
      onOpenChange(isOpen: boolean) {
        if (!isOpen) {
          OverlayManager.close(id);
        }
      },
    });
  }

  function openAsync(...props: OpenProps) {
    return new Promise<boolean>((resolve) => {
      OverlayManager.open(id, {
        ...props[0],
        onOpenChange(isOpen: boolean) {
          if (!isOpen) {
            OverlayManager.close(id);
            resolve(false);
          }
        },
      });
    });
  }

  function close(options?: { unmount: boolean; delay?: number }) {
    return OverlayManager.close(id, options);
  }

  return {
    open,
    close,
    openAsync,
    component,
  };
}

function createOverlayManager() {
  let overlays: {
    id: string;
    open: boolean;
    visible: boolean;
    props: Record<string, unknown>;
    component: ComponentType<Partial<OverlayProps>>;
  }[] = [];

  let nextId = 0;
  const listeners = new Set<() => void>();

  function notify() {
    for (const listener of listeners) {
      listener();
    }
  }

  function subscribe(listener: () => void) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  }

  function add(component: ComponentType<Partial<OverlayProps>>) {
    const overlayId = String(++nextId);

    overlays.push({
      id: overlayId,
      open: false,
      visible: false,
      props: {},
      component,
    });

    return overlayId;
  }

  function set(
    overlayId: string,
    options: {
      open: boolean;
      visible: boolean;
      props?: Record<string, unknown>;
    },
  ) {
    const overlay = overlays.find((overlay) => overlay.id === overlayId);

    if (!overlay) {
      return;
    }

    overlays = overlays.map((overlay) => {
      if (overlay.id === overlayId) {
        return {
          ...overlay,
          ...options,
          component: overlay.component,
        };
      }

      return overlay;
    });

    notify();
  }

  function open<P extends Record<string, unknown>>(overlayId: string, props: P) {
    set(overlayId, {
      open: true,
      visible: true,
      props,
    });
  }

  function close(
    overlayId: string,
    options: { unmount: boolean; delay?: number } = { unmount: true },
  ) {
    set(overlayId, {
      open: false,
      visible: true,
    });

    if (options.unmount) {
      setTimeout(() => {
        set(overlayId, {
          open: false,
          visible: false,
        });
      }, options?.delay ?? 300);
    }
  }

  function all() {
    return overlays;
  }

  return {
    add,
    all,
    open,
    close,
    subscribe,
  };
}
