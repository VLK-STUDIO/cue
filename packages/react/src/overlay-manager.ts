import type { ComponentType } from "react";

export const OverlayManager = createOverlayManager();

export type CloseOptions<R = undefined> = {
  /** Value passed to a pending `openAsync` Promise. Omit (or dismiss) to resolve `undefined`. */
  result?: R;
  /** Milliseconds before the instance is removed. Default `300`. */
  delay?: number;
};

export type OverlayProps<R = undefined> = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  /**
   * Close this overlay instance.
   * Pass `{ result }` to settle a pending `openAsync` with that value.
   * The instance always unmounts after `delay` (default 300ms).
   */
  close: (options?: CloseOptions<R>) => void;
};

const pendingResolvers = new Map<string, (result: unknown) => void>();

/**
 * Register an overlay component and get a handle to open instances from anywhere.
 *
 * Each `open` / `openAsync` creates a new instance. `closeAll` closes every live
 * instance from this definition. Instance-specific close comes from `open()`'s
 * return value or `props.close` inside the component.
 */
export function createOverlay<P extends object = {}, R = undefined>(
  component: ComponentType<OverlayProps<R> & P>,
) {
  type OpenProps = {} extends P ? [props?: P] : [props: P];

  function settle(instanceId: string, result: R | undefined) {
    pendingResolvers.get(instanceId)?.(result);
    pendingResolvers.delete(instanceId);
  }

  function closeInstance(instanceId: string, { result, delay }: CloseOptions<R> = {}) {
    settle(instanceId, result);
    return OverlayManager.close(instanceId, { delay });
  }

  function mountInstance(...props: OpenProps) {
    const instanceId = OverlayManager.add(component as ComponentType<Partial<OverlayProps>>);

    const close = (options?: CloseOptions<R>) => closeInstance(instanceId, options);

    OverlayManager.open(instanceId, {
      ...(props[0] as object | undefined),
      close,
      onOpenChange(isOpen: boolean) {
        if (!isOpen) {
          close();
        }
      },
    });

    return { instanceId, close };
  }

  /**
   * Open a new overlay instance.
   * Returns a `close` function for that instance only.
   */
  function open(...props: OpenProps) {
    return mountInstance(...props).close;
  }

  /**
   * Open a new overlay instance and return a Promise that settles when it closes.
   * Resolves with `R` when closed via `close({ result })`, otherwise `undefined`.
   * With no result generic, the Promise is `Promise<undefined>` (wait until closed).
   */
  function openAsync(...props: OpenProps) {
    return new Promise<R | undefined>((resolve) => {
      const { instanceId } = mountInstance(...props);
      pendingResolvers.set(instanceId, resolve as (result: unknown) => void);
    });
  }

  /**
   * Close every live instance created from this overlay definition.
   * `{ result }` settles every pending `openAsync` with the same value.
   */
  function closeAll(options: CloseOptions<R> = {}) {
    const instances = OverlayManager.all().filter(
      (overlay) => overlay.component === component && (overlay.open || overlay.visible),
    );

    for (const instance of instances) {
      closeInstance(instance.id, options);
    }
  }

  return {
    open,
    closeAll,
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

    notify();

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

  function remove(overlayId: string) {
    overlays = overlays.filter((overlay) => overlay.id !== overlayId);
    notify();
  }

  function open<P extends Record<string, unknown>>(overlayId: string, props: P) {
    set(overlayId, {
      open: true,
      visible: true,
      props,
    });
  }

  function close(overlayId: string, options: { delay?: number } = {}) {
    set(overlayId, {
      open: false,
      visible: true,
    });

    setTimeout(() => {
      remove(overlayId);
    }, options.delay ?? 300);
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
