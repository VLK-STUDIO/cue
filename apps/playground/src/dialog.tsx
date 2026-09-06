import type { OverlayProps } from "@overlay-manager/react";
import type { ReactNode } from "react";

type DialogProps = OverlayProps & {
  title: string;
  children: ReactNode;
};

export function Dialog({ open, onOpenChange, title, children }: DialogProps) {
  return (
    <div
      className={open ? "dialog-backdrop is-open" : "dialog-backdrop"}
      onClick={() => onOpenChange(false)}
    >
      <div
        className="dialog-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="dialog-title">{title}</h2>
        {children}
      </div>
    </div>
  );
}
