import type { ComponentType, ReactNode } from "react";

export type CueComponents = Record<string, ComponentType<any>>;

export type CueBackdropCloseOptions = {
  strategy: "last" | "all";
};

export type CueBackdrop = ComponentType<{
  /** Whether the shared backdrop is open. It stays mounted with `false` during the last overlay instance's close delay. */
  open: boolean;
  /** Close overlay instances when the shared backdrop is dismissed. */
  close: (options: CueBackdropCloseOptions) => void;
}>;

export type CloseOptions<R = undefined> = {
  /** Value passed to a pending `openAsync` Promise. Omit to resolve `undefined`. */
  result?: R;
  /** Milliseconds before the instance is removed. Falls back to the Cue environment `delay`. */
  delay?: number;
};

export type OverlayContext<C extends CueComponents = {}, R = undefined> = {
  /** Whether this instance is open. It remains mounted with `false` during its close delay. */
  open: boolean;
  /** Close the instance when the wrapped overlay reports dismissal. */
  onOpenChange: (isOpen: boolean) => void;
  /** Close this instance and optionally settle its `openAsync` result. */
  close: (options?: CloseOptions<R>) => void;
  /** The exact component map configured for this Cue environment. */
  components: C;
};

export type OverlayRenderer<P extends object = {}, C extends CueComponents = {}, R = undefined> = (
  props: P,
  context: OverlayContext<C, R>,
) => ReactNode;

export type OverlayDefinitionOptions = {
  /** Replace the environment shared backdrop, or `false` to opt out of providing one. */
  backdrop?: CueBackdrop | false;
};

export type OverlayDefinition = {
  render: (props: object, context: OverlayContext<CueComponents, unknown>) => ReactNode;
  backdrop?: CueBackdrop | false;
};

export type CueOptions<C extends CueComponents = {}> = {
  backdrop?: CueBackdrop;
  /** Close delay in milliseconds. Default `300`. */
  delay?: number;
  components?: C;
};

type OpenArguments<P extends object> = {} extends P ? [props?: P] : [props: P];

export type OverlayHandle<P extends object = {}, R = undefined> = {
  /** Open one instance and return a close function bound to that instance. */
  open: (...args: OpenArguments<P>) => (options?: CloseOptions<R>) => void;
  /** Open one instance and resolve when that instance closes. */
  openAsync: (...args: OpenArguments<P>) => Promise<R | undefined>;
  /** Close every live instance created from this overlay definition. */
  closeAll: (options?: CloseOptions<R>) => void;
};

export type OverlayProviderProps = {
  children?: ReactNode;
  /** Element the overlay outlet portals into. Default `document.body`. */
  container?: Element | DocumentFragment;
};
