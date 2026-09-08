import { cue } from "./cue";
import { Button } from "@/components/ui/button";

export const welcomeDialog = cue.createOverlay((_props, ctx) => {
  const components = ctx.components;

  return (
    <components.wrapper open={ctx.open} onOpenChange={ctx.onOpenChange}>
      <components.content>
        <components.header>
          <components.title>Hello</components.title>
          <components.description>
            Opened with <code>welcomeDialog.open()</code>. No local state.
          </components.description>
        </components.header>
        <components.footer>
          <Button variant="outline" onClick={() => ctx.close()}>
            Close
          </Button>
        </components.footer>
      </components.content>
    </components.wrapper>
  );
});

export const settingsDialog = cue.createOverlay((_props, ctx) => {
  const components = ctx.components;

  return (
    <components.wrapper open={ctx.open} onOpenChange={ctx.onOpenChange}>
      <components.content>
        <components.header>
          <components.title>Settings</components.title>
          <components.description>
            No extra props. Opened with <code>settingsDialog.open()</code>.
          </components.description>
        </components.header>
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
      </components.content>
    </components.wrapper>
  );
});

export const confirmDeleteDialog = cue.createOverlay<{
  organizationName: string;
}>((props, ctx) => {
  const components = ctx.components;

  return (
    <components.wrapper open={ctx.open} onOpenChange={ctx.onOpenChange}>
      <components.content>
        <components.header>
          <components.title>Delete {props.organizationName}?</components.title>
          <components.description>
            Typed props, stacked on top of Settings, closed from the overlay itself.
          </components.description>
        </components.header>
        <components.footer>
          <Button variant="outline" onClick={() => ctx.close()}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => ctx.close()}>
            Delete
          </Button>
        </components.footer>
      </components.content>
    </components.wrapper>
  );
});

export const asyncConfirmDialog = cue.createOverlay<{ message: string }, boolean>((props, ctx) => {
  const components = ctx.components;

  return (
    <components.wrapper open={ctx.open} onOpenChange={ctx.onOpenChange}>
      <components.content>
        <components.header>
          <components.title>Confirm</components.title>
          <components.description>{props.message}</components.description>
        </components.header>
        <components.footer>
          <Button variant="outline" onClick={() => ctx.close({ result: false })}>
            Cancel
          </Button>
          <Button onClick={() => ctx.close({ result: true })}>Confirm</Button>
        </components.footer>
      </components.content>
    </components.wrapper>
  );
});
