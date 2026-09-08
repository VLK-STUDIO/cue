import { createCue } from "@vlkoss/cue";
import type { ReactNode } from "react";

export function CueBackdrop() {
  return <div className="om-cue-backdrop" aria-hidden="true" />;
}

export function CueWrapper({ children }: { children?: ReactNode }) {
  return <div className="om-cue-wrapper">{children}</div>;
}

export function CueFooter({ children }: { children?: ReactNode }) {
  return <div className="om-dialog-actions">{children}</div>;
}

export const cue = createCue({
  backdrop: CueBackdrop,
  components: {
    wrapper: CueWrapper,
    footer: CueFooter,
  },
});
