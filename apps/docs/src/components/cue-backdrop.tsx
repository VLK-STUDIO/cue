"use client";

import { Dialog, DialogOverlay, DialogPortal } from "@/components/ui/dialog";

export function CueBackdrop() {
  return (
    <Dialog open>
      <DialogPortal>
        <DialogOverlay />
      </DialogPortal>
    </Dialog>
  );
}
