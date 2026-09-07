import { confirmDeleteDialog, settingsDialog } from "./overlays";

export function App() {
  return (
    <main>
      <p className="eyebrow">@vlkoss/cue</p>
      <h1>Open a dialog from anywhere</h1>
      <p className="lede">
        Register a dialog once, then call <code>open()</code> from anywhere — even outside React.
      </p>
      <div className="actions">
        <button type="button" className="primary" onClick={() => settingsDialog.open()}>
          Open settings
        </button>
        <button
          type="button"
          onClick={() => confirmDeleteDialog.open({ organizationName: "Helios" })}
        >
          Delete Helios
        </button>
      </div>
    </main>
  );
}
