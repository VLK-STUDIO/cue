import type { ReactNode } from "react";

type DialogProps = {
  open: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  children: ReactNode;
};

export function Dialog({ open, onOpenChange, title, children }: DialogProps) {
  return (
    <div
      className={open ? "om-dialog-surface is-open" : "om-dialog-surface"}
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
