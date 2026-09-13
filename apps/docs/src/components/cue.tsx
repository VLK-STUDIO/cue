import type { ComponentProps } from "react";
import { createCue, type CueBackdrop } from "@vlkoss/cue";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type CueContentProps = Omit<ComponentProps<typeof DialogContent>, "showBackdrop">;

function CueContent(props: CueContentProps) {
  return <DialogContent {...props} showBackdrop={false} />;
}

const CueBackdrop: CueBackdrop = ({ open, close }) => (
  <div
    aria-hidden="true"
    data-open={open ? "" : undefined}
    className="fixed inset-0 isolate z-50 bg-black/10 opacity-0 transition-opacity duration-100 supports-backdrop-filter:backdrop-blur-xs starting:opacity-0 data-open:opacity-100"
    style={{ pointerEvents: open ? "auto" : "none" }}
    onClick={() => close({ strategy: "last" })}
  />
);

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
