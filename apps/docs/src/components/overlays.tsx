import { createOverlay } from "@overlay-manager/react";
import { Dialog } from "./dialog";

export const welcomeDialog = createOverlay((props) => (
  <Dialog {...props} title="Hello">
    <p className="om-dialog-body">
      Opened with <code>welcomeDialog.open()</code>. No local state.
    </p>
    <div className="om-dialog-actions">
      <button type="button" className="om-button" onClick={() => welcomeDialog.close()}>
        Close
      </button>
    </div>
  </Dialog>
));

export const settingsDialog = createOverlay((props) => (
  <Dialog {...props} title="Settings">
    <p className="om-dialog-body">
      No extra props. Opened with <code>settingsDialog.open()</code>.
    </p>
    <div className="om-dialog-actions">
      <button type="button" className="om-button" onClick={() => settingsDialog.close()}>
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
    </div>
  </Dialog>
));

export const confirmDeleteDialog = createOverlay<{
  organizationName: string;
}>((props) => (
  <Dialog {...props} title={`Delete ${props.organizationName}?`}>
    <p className="om-dialog-body">
      Typed props, stacked on top of Settings, closed from the overlay itself.
    </p>
    <div className="om-dialog-actions">
      <button type="button" className="om-button" onClick={() => confirmDeleteDialog.close()}>
        Cancel
      </button>
      <button
        type="button"
        className="om-button om-button-danger"
        onClick={() => confirmDeleteDialog.close()}
      >
        Delete
      </button>
    </div>
  </Dialog>
));

export const asyncConfirmDialog = createOverlay<{
  message: string;
}>((props) => (
  <Dialog {...props} title="Confirm">
    <p className="om-dialog-body">{props.message}</p>
    <div className="om-dialog-actions">
      <button type="button" className="om-button" onClick={() => asyncConfirmDialog.close()}>
        Cancel
      </button>
      <button
        type="button"
        className="om-button om-button-primary"
        onClick={() => asyncConfirmDialog.close()}
      >
        Confirm
      </button>
    </div>
  </Dialog>
));
