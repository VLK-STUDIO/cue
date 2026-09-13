"use client";

import { createOverlayProvider } from "./overlay-provider.js";
import { createOverlayStore } from "./overlay-manager.js";
import type {
  CloseOptions,
  CueComponents,
  CueOptions,
  OverlayDefinition,
  OverlayDefinitionOptions,
  OverlayHandle,
  OverlayRenderer,
} from "./types.js";

/** Create an isolated overlay environment with its own provider and lifecycle state. */
export function createCue<const C extends CueComponents = {}>(options: CueOptions<C> = {}) {
  const store = createOverlayStore({ delay: options.delay });
  const components = (options.components ?? {}) as C;
  const pendingResolvers = new Map<string, (result: unknown) => void>();

  function settle(instanceId: string, result: unknown) {
    pendingResolvers.get(instanceId)?.(result);
    pendingResolvers.delete(instanceId);
  }

  function teardown() {
    for (const resolve of pendingResolvers.values()) {
      resolve(undefined);
    }

    pendingResolvers.clear();
    store.reset();
  }

  const OverlayProvider = createOverlayProvider({
    store,
    components,
    backdrop: options.backdrop,
    teardown,
  });

  /** Create an overlay definition owned by this Cue environment. */
  function createOverlay<P extends object = {}, R = undefined>(
    render: OverlayRenderer<P, C, R>,
    definitionOptions: OverlayDefinitionOptions = {},
  ): OverlayHandle<P, R> {
    const definition: OverlayDefinition = {
      render: render as OverlayDefinition["render"],
      backdrop: definitionOptions.backdrop,
    };

    function closeInstance(instanceId: string, closeOptions: CloseOptions<R> = {}) {
      settle(instanceId, closeOptions.result);
      store.close(instanceId, { delay: closeOptions.delay });
    }

    function mountInstance(props: P | undefined) {
      let instanceId = "";
      const close = (closeOptions?: CloseOptions<R>) => closeInstance(instanceId, closeOptions);

      instanceId = store.add(definition, props ?? {}, close);

      return { instanceId, close };
    }

    function open(...args: Parameters<OverlayHandle<P, R>["open"]>) {
      return mountInstance(args[0]).close;
    }

    function openAsync(...args: Parameters<OverlayHandle<P, R>["openAsync"]>) {
      return new Promise<R | undefined>((resolve) => {
        const { instanceId } = mountInstance(args[0]);
        pendingResolvers.set(instanceId, resolve as (result: unknown) => void);
      });
    }

    function closeAll(closeOptions: CloseOptions<R> = {}) {
      const instances = store.all().filter((overlay) => overlay.definition === definition);

      for (const instance of instances) {
        closeInstance(instance.id, closeOptions);
      }
    }

    return {
      open,
      openAsync,
      closeAll,
    };
  }

  return {
    createOverlay,
    OverlayProvider,
  };
}
