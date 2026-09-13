import type { OverlayDefinition } from "./types.js";

export type OverlayInstance = {
  id: string;
  open: boolean;
  props: object;
  definition: OverlayDefinition;
  close: () => void;
};

export type OverlayStore = ReturnType<typeof createOverlayStore>;

export function createOverlayStore({ delay: defaultDelay = 300 }: { delay?: number } = {}) {
  let overlays: OverlayInstance[] = [];
  let nextId = 0;
  const listeners = new Set<() => void>();
  const timeouts = new Map<string, ReturnType<typeof setTimeout>>();

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
        props,
        definition,
        close,
      },
    ];
    notify();

    return id;
  }

  function remove(id: string) {
    const timeout = timeouts.get(id);

    if (timeout !== undefined) {
      clearTimeout(timeout);
      timeouts.delete(id);
    }

    if (!overlays.some((overlay) => overlay.id === id)) {
      return;
    }

    overlays = overlays.filter((overlay) => overlay.id !== id);
    notify();
  }

  function close(id: string, { delay = defaultDelay }: { delay?: number } = {}) {
    const overlay = overlays.find((item) => item.id === id);

    if (!overlay || !overlay.open) {
      return;
    }

    overlays = overlays.map((item) =>
      item.id === id
        ? {
            ...item,
            open: false,
          }
        : item,
    );
    notify();

    const timeout = setTimeout(() => remove(id), delay);
    timeouts.set(id, timeout);
  }

  function reset() {
    for (const timeout of timeouts.values()) {
      clearTimeout(timeout);
    }

    timeouts.clear();
    overlays = [];
    notify();
  }

  function all() {
    return overlays;
  }

  return {
    add,
    all,
    close,
    reset,
    subscribe,
  };
}
