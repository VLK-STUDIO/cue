import type { ComponentType, ReactNode } from "react";

export type CueComponents = Record<string, ComponentType<any>>;

export type CueBackdrop = ComponentType;

export type CloseOptions<R = undefined> = {
  /** Value passed to a pending `openAsync` Promise. Omit to resolve `undefined`. */
  result?: R;
  /** Milliseconds before the instance is removed. Default `300`. */
  delay?: number;
};

export type OverlayContext<C extends CueComponents = {}, R = undefined> = {
  /** Whether this instance is open. It remains mounted with `false` during its close delay. */
  open: boolean;
  /** Close the instance when the wrapped overlay primitive reports dismissal. */
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

export type OverlayDefinition = {
  render: unknown;
  /** Reserved for the future per-overlay backdrop option. */
  backdrop?: CueBackdrop | false;
};
