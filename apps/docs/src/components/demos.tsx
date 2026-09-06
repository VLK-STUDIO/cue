import { Demo } from "./demo";
import {
  asyncConfirmDialog,
  confirmDeleteDialog,
  settingsDialog,
  welcomeDialog,
} from "./overlays";

const defaultCode = `import { createOverlay, type OverlayProps } from "@overlay-manager/react";
import { Dialog } from "./dialog";

export const settingsDialog = createOverlay((props) => (
  <Dialog {...props} title="Settings">
    <p>No local useState required.</p>
    <button type="button" onClick={() => settingsDialog.close()}>
      Close
    </button>
  </Dialog>
));

settingsDialog.open();`;

export function DefaultDemo() {
  return (
    <Demo code={defaultCode}>
      <button type="button" className="om-button om-button-primary" onClick={() => settingsDialog.open()}>
        Open dialog
      </button>
    </Demo>
  );
}

const typedPropsCode = `export const confirmDeleteDialog = createOverlay<{
  organizationName: string;
}>((props) => (
  <Dialog {...props} title={\`Delete \${props.organizationName}?\`}>
    <button type="button" onClick={() => confirmDeleteDialog.close()}>
      Cancel
    </button>
  </Dialog>
));

confirmDeleteDialog.open({
  organizationName: "Helios",
});`;

export function TypedPropsDemo() {
  return (
    <Demo code={typedPropsCode}>
      <button
        type="button"
        className="om-button om-button-primary"
        onClick={() =>
          confirmDeleteDialog.open({
            organizationName: "Helios",
          })
        }
      >
        Delete Helios
      </button>
    </Demo>
  );
}

const stackingCode = `settingsDialog.open();

// From inside Settings:
confirmDeleteDialog.open({
  organizationName: "Atlas",
});`;

export function StackingDemo() {
  return (
    <Demo code={stackingCode}>
      <button type="button" className="om-button om-button-primary" onClick={() => settingsDialog.open()}>
        Open settings
      </button>
    </Demo>
  );
}

const openAsyncCode = `const confirmed = await asyncConfirmDialog.openAsync({
  message: "Archive this project?",
});

// resolves false when the overlay closes
console.log(confirmed);`;

export function OpenAsyncDemo() {
  return (
    <Demo code={openAsyncCode}>
      <button
        type="button"
        className="om-button om-button-primary"
        onClick={async () => {
          await asyncConfirmDialog.openAsync({
            message: "Archive this project?",
          });
        }}
      >
        Open async
      </button>
    </Demo>
  );
}

const welcomeCode = `welcomeDialog.open();`;

export function WelcomeDemo() {
  return (
    <Demo code={welcomeCode}>
      <button type="button" className="om-button om-button-primary" onClick={() => welcomeDialog.open()}>
        Open dialog
      </button>
    </Demo>
  );
}
