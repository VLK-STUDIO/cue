import { createOverlay } from "@overlay-manager/react";
import { Dialog } from "./dialog";

export const settingsDialog = createOverlay((props) => (
  <Dialog {...props} title="Settings">
    <p>
      No extra props. Opened with <code>settingsDialog.open()</code>.
    </p>
    <div className="dialog-actions">
      <button type="button" onClick={() => settingsDialog.close()}>
        Close
      </button>
      <button
        type="button"
        className="primary"
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
    <p>Typed props, stacked on top of Settings, closed from the overlay itself.</p>
    <div className="dialog-actions">
      <button type="button" onClick={() => confirmDeleteDialog.close()}>
        Cancel
      </button>
      <button type="button" className="danger" onClick={() => confirmDeleteDialog.close()}>
        Delete
      </button>
    </div>
  </Dialog>
));
