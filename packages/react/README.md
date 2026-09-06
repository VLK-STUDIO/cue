# @overlay-manager/react

Register a dialog once. Open it from anywhere.

Works with any component that accepts `open` and `onOpenChange` — Radix Dialog, Base UI, vaul, or your own.

## Install

```sh
pnpm add @overlay-manager/react
```

This repo uses the TypeScript source in the workspace. `pnpm publish` swaps the entry to `dist/` via `publishConfig`.

## Usage

Wrap the tree once:

```tsx
import { OverlayProvider } from "@overlay-manager/react";

export function App() {
  return (
    <OverlayProvider>
      <Page />
    </OverlayProvider>
  );
}
```

Define an overlay next to the component it renders:

```tsx
import { createOverlay, type OverlayProps } from "@overlay-manager/react";
import { Dialog } from "./dialog";

export const deleteOrganizationDialog = createOverlay<{
  organizationId: string;
  organizationName: string;
}>((props) => (
  <Dialog {...props}>
    <p>Delete {props.organizationName}?</p>
    <button type="button" onClick={() => deleteOrganizationDialog.close()}>
      Confirm
    </button>
  </Dialog>
));
```

Open it from a click handler, a route effect, or another overlay — no local `useState`:

```tsx
deleteOrganizationDialog.open({
  organizationId: "org_1",
  organizationName: "Atlas",
});
```

`OverlayProps` is `{ open, onOpenChange }`. Spread them onto your dialog so Escape and backdrop clicks still close it.

## API

### `createOverlay(component)`

Returns `{ open, close, openAsync, component }`.

- `open(props?)` — show the overlay. Extra props are required when you pass a props generic.
- `close({ unmount?, delay? })` — set `open` to `false`, then unmount after `delay` (default `300`) so exit animations can finish. Pass `{ unmount: false }` to keep it mounted.
- `openAsync(props?)` — same as `open`, then a `Promise<boolean>` that resolves `false` when the overlay closes.

### `OverlayProvider`

Renders children plus every currently visible overlay.

### `OverlayManager`

The singleton store used by `createOverlay` and `OverlayProvider`. You usually do not call this directly.
