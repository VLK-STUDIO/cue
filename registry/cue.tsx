"use client";

import type { ComponentProps } from "react";
import { createCue } from "@vlkoss/cue";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type CueContentProps = Omit<ComponentProps<typeof DialogContent>, "showBackdrop">;

function CueContent(props: CueContentProps) {
  return <DialogContent {...props} showBackdrop={false} />;
}

function CueBackdrop({ close }: { close: (options: { strategy: "last" | "all" }) => void }) {
  return (
    <Dialog open>
      <DialogPortal>
        <DialogOverlay onClick={() => close({ strategy: "last" })} />
      </DialogPortal>
    </Dialog>
  );
}

export const cue = createCue({
  backdrop: CueBackdrop,
  components: {
    wrapper: Dialog,
    content: CueContent,
    footer: DialogFooter,
    header: DialogHeader,
    title: DialogTitle,
    description: DialogDescription,
    close: DialogClose,
    trigger: DialogTrigger,
  },
});
