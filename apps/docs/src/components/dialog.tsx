import type { OverlayProps } from "@vlkoss/cue";
import type { ReactNode } from "react";

type DialogProps = OverlayProps & {
  title: string;
  children: ReactNode;
};

export function Dialog({ open, onOpenChange, title, children }: DialogProps) {
  return (
    <div
      className={open ? "om-dialog-backdrop is-open" : "om-dialog-backdrop"}
      onClick={() => onOpenChange(false)}
    >
      <div
        className="om-dialog-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="om-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="om-dialog-title" className="om-dialog-title">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
