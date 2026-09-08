import { createOverlayProvider } from "./overlay-provider.js";
import { createOverlayStore } from "./overlay-manager.js";
import type {
  CloseOptions,
  CueBackdrop,
  CueComponents,
  OverlayRenderer,
  OverlayDefinition,
} from "./types.js";

type OpenArguments<P extends object> = {} extends P ? [props?: P] : [props: P];

type OverlayHandle<P extends object, R> = {
  /** Open one instance and return a close function bound to that instance. */
  open: (...args: OpenArguments<P>) => () => void;
  /** Open one instance and resolve when that instance closes. */
  openAsync: (...args: OpenArguments<P>) => Promise<R | undefined>;
  /** Close every live instance created from this overlay definition. */
  closeAll: (options?: CloseOptions<R>) => void;
};

type CueOptions<C extends CueComponents> = {
  backdrop?: CueBackdrop;
  components?: C;
};

/** Create an isolated overlay environment with its own provider and lifecycle state. */
export function createCue<const C extends CueComponents = {}>(options: CueOptions<C> = {}) {
  const store = createOverlayStore();
  const components = (options.components ?? {}) as C;
  const OverlayProvider = createOverlayProvider({ store, components, backdrop: options.backdrop });

  /** Create an overlay definition owned by this Cue environment. */
  function createOverlay<P extends object = {}, R = undefined>(
    render: OverlayRenderer<P, C, R>,
  ): OverlayHandle<P, R> {
    const definition: OverlayDefinition = {
      render: render as OverlayDefinition["render"],
    };
    const pendingResolvers = new Map<string, (result: R | undefined) => void>();

    function settle(instanceId: string, result: R | undefined) {
      pendingResolvers.get(instanceId)?.(result);
      pendingResolvers.delete(instanceId);
    }

    function closeInstance(instanceId: string, options: CloseOptions<R> = {}) {
      settle(instanceId, options.result);
      store.close(instanceId, { delay: options.delay });
    }

    function mountInstance(props: P | undefined) {
      let instanceId = "";
      const close = (options?: CloseOptions<R>) => closeInstance(instanceId, options);

      instanceId = store.add(definition, props ?? {}, close);

      return { instanceId, close };
    }

    function open(...args: OpenArguments<P>) {
      return mountInstance(args[0]).close;
    }

    function openAsync(...args: OpenArguments<P>) {
      return new Promise<R | undefined>((resolve) => {
        const { instanceId } = mountInstance(args[0]);
        pendingResolvers.set(instanceId, resolve);
      });
    }

    function closeAll(options: CloseOptions<R> = {}) {
      const instances = store
        .all()
        .filter(
          (overlay) => overlay.definition === definition && (overlay.open || overlay.visible),
        );

      for (const instance of instances) {
        closeInstance(instance.id, options);
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
