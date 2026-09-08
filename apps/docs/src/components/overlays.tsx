import { cue } from "./cue";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const welcomeDialog = cue.createOverlay((_props, ctx) => {
  const components = ctx.components;
  return (
    <Dialog open={ctx.open} onOpenChange={ctx.onOpenChange}>
      <DialogContent showBackdrop={false}>
        <DialogHeader>
          <DialogTitle>Hello</DialogTitle>
          <DialogDescription>
            Opened with <code>welcomeDialog.open()</code>. No local state.
          </DialogDescription>
        </DialogHeader>
        <components.footer>
          <Button variant="outline" onClick={() => ctx.close()}>
            Close
          </Button>
        </components.footer>
      </DialogContent>
    </Dialog>
  );
});

export const settingsDialog = cue.createOverlay((_props, ctx) => {
  const components = ctx.components;

  return (
    <Dialog open={ctx.open} onOpenChange={ctx.onOpenChange}>
      <DialogContent showBackdrop={false}>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            No extra props. Opened with <code>settingsDialog.open()</code>.
          </DialogDescription>
        </DialogHeader>
        <components.footer>
          <Button variant="outline" onClick={() => ctx.close()}>
            Close
          </Button>
          <Button
            onClick={() =>
              confirmDeleteDialog.open({
                organizationName: "Atlas",
              })
            }
          >
            Delete Atlas…
          </Button>
        </components.footer>
      </DialogContent>
    </Dialog>
  );
});

export const confirmDeleteDialog = cue.createOverlay<{
  organizationName: string;
}>((props, ctx) => {
  const components = ctx.components;

  return (
    <Dialog open={ctx.open} onOpenChange={ctx.onOpenChange}>
      <DialogContent showBackdrop={false}>
        <DialogHeader>
          <DialogTitle>Delete {props.organizationName}?</DialogTitle>
          <DialogDescription>
            Typed props, stacked on top of Settings, closed from the overlay itself.
          </DialogDescription>
        </DialogHeader>
        <components.footer>
          <Button variant="outline" onClick={() => ctx.close()}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => ctx.close()}>
            Delete
          </Button>
        </components.footer>
      </DialogContent>
    </Dialog>
  );
});

export const asyncConfirmDialog = cue.createOverlay<{ message: string }, boolean>((props, ctx) => {
  const components = ctx.components;

  return (
    <Dialog open={ctx.open} onOpenChange={ctx.onOpenChange}>
      <DialogContent showBackdrop={false}>
        <DialogHeader>
          <DialogTitle>Confirm</DialogTitle>
          <DialogDescription>{props.message}</DialogDescription>
        </DialogHeader>
        <components.footer>
          <Button variant="outline" onClick={() => ctx.close({ result: false })}>
            Cancel
          </Button>
          <Button onClick={() => ctx.close({ result: true })}>Confirm</Button>
        </components.footer>
      </DialogContent>
    </Dialog>
  );
});
