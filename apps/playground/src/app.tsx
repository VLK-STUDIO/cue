import { confirmDeleteDialog, settingsDialog } from "./overlays";

export function App() {
  return (
    <main>
      <p className="eyebrow">@overlay-manager/react</p>
      <h1>Open a dialog from anywhere</h1>
      <p className="lede">
        Same API as the uni-cagliari overlay manager: register once, call{" "}
        <code>open()</code> from a click handler.
      </p>
      <div className="actions">
        <button
          type="button"
          className="primary"
          onClick={() => settingsDialog.open()}
        >
          Open settings
        </button>
        <button
          type="button"
          onClick={() =>
            confirmDeleteDialog.open({ organizationName: "Helios" })
          }
        >
          Delete Helios
        </button>
      </div>
    </main>
  );
}
