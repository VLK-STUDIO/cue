import { asyncConfirmDialog, confirmDeleteDialog, settingsDialog, welcomeDialog } from "./overlays";

export function DefaultDemo() {
  return (
    <button
      type="button"
      className="om-button om-button-primary"
      onClick={() => settingsDialog.open()}
    >
      Open dialog
    </button>
  );
}

export function TypedPropsDemo() {
  return (
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
  );
}

export function StackingDemo() {
  return (
    <button
      type="button"
      className="om-button om-button-primary"
      onClick={() => settingsDialog.open()}
    >
      Open settings
    </button>
  );
}

export function OpenAsyncDemo() {
  return (
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
  );
}

export function WelcomeDemo() {
  return (
    <button
      type="button"
      className="om-button om-button-primary"
      onClick={() => welcomeDialog.open()}
    >
      Open dialog
    </button>
  );
}
