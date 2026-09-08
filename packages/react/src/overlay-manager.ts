import type { OverlayDefinition } from "./types.js";

export type OverlayInstance = {
  id: string;
  open: boolean;
  visible: boolean;
  props: object;
  definition: OverlayDefinition;
  close: () => void;
};

export type OverlayStore = ReturnType<typeof createOverlayStore>;

export function createOverlayStore() {
  let overlays: OverlayInstance[] = [];
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

  function add(definition: OverlayDefinition, props: object, close: () => void) {
    const id = String(++nextId);

    overlays = [
      ...overlays,
      {
        id,
        open: true,
        visible: true,
        props,
        definition,
        close,
      },
    ];
    notify();

    return id;
  }

  function remove(id: string) {
    if (!overlays.some((overlay) => overlay.id === id)) {
      return;
    }

    overlays = overlays.filter((overlay) => overlay.id !== id);
    notify();
  }

  function close(id: string, { delay = 300 }: { delay?: number } = {}) {
    const overlay = overlays.find((item) => item.id === id);

    if (!overlay || !overlay.open) {
      return;
    }

    overlays = overlays.map((item) =>
      item.id === id
        ? {
            ...item,
            open: false,
            visible: true,
          }
        : item,
    );
    notify();

    setTimeout(() => remove(id), delay);
  }

  function all() {
    return overlays;
  }

  return {
    add,
    all,
    close,
    subscribe,
  };
}
