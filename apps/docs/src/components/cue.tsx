import { createCue } from "@vlkoss/cue";
import { DialogFooter } from "@/components/ui/dialog";
import { CueBackdrop } from "./cue-backdrop";

export const cue = createCue({
  backdrop: CueBackdrop,
  components: {
    footer: DialogFooter,
  },
});
