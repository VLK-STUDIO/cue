import { cue } from "./cue";
import { Dialog } from "./dialog";

export const welcomeDialog = cue.createOverlay((_props, ctx) => {
  const components = ctx.components;
  return (
    <Dialog open={ctx.open} onOpenChange={ctx.onOpenChange} title="Hello">
      <components.wrapper>
        <p className="om-dialog-body">
          Opened with <code>welcomeDialog.open()</code>. No local state.
        </p>
        <components.footer>
          <button type="button" className="om-button" onClick={() => ctx.close()}>
            Close
          </button>
        </components.footer>
      </components.wrapper>
    </Dialog>
  );
});

export const settingsDialog = cue.createOverlay((_props, ctx) => {
  const components = ctx.components;

  return (
    <Dialog open={ctx.open} onOpenChange={ctx.onOpenChange} title="Settings">
      <components.wrapper>
        <p className="om-dialog-body">
          No extra props. Opened with <code>settingsDialog.open()</code>.
        </p>
        <components.footer>
          <button type="button" className="om-button" onClick={() => ctx.close()}>
            Close
          </button>
          <button
            type="button"
            className="om-button om-button-primary"
            onClick={() =>
              confirmDeleteDialog.open({
                organizationName: "Atlas",
              })
            }
          >
            Delete Atlas…
          </button>
        </components.footer>
      </components.wrapper>
    </Dialog>
  );
});

export const confirmDeleteDialog = cue.createOverlay<{
  organizationName: string;
}>((props, ctx) => {
  const components = ctx.components;

  return (
    <Dialog
      open={ctx.open}
      onOpenChange={ctx.onOpenChange}
      title={`Delete ${props.organizationName}?`}
    >
      <components.wrapper>
        <p className="om-dialog-body">
          Typed props, stacked on top of Settings, closed from the overlay itself.
        </p>
        <components.footer>
          <button type="button" className="om-button" onClick={() => ctx.close()}>
            Cancel
          </button>
          <button type="button" className="om-button om-button-danger" onClick={() => ctx.close()}>
            Delete
          </button>
        </components.footer>
      </components.wrapper>
    </Dialog>
  );
});

export const asyncConfirmDialog = cue.createOverlay<{ message: string }, boolean>((props, ctx) => {
  const components = ctx.components;

  return (
    <Dialog open={ctx.open} onOpenChange={ctx.onOpenChange} title="Confirm">
      <components.wrapper>
        <p className="om-dialog-body">{props.message}</p>
        <components.footer>
          <button type="button" className="om-button" onClick={() => ctx.close({ result: false })}>
            Cancel
          </button>
          <button
            type="button"
            className="om-button om-button-primary"
            onClick={() => ctx.close({ result: true })}
          >
            Confirm
          </button>
        </components.footer>
      </components.wrapper>
    </Dialog>
  );
});
