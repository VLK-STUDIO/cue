# @vlkoss/cue

Register a dialog once. Open it from anywhere.

Works with any component that accepts `open` and `onOpenChange`: Radix Dialog, Base UI, vaul, or your own.

## Install

```sh
npm i @vlkoss/cue
```

## Usage

Wrap the tree once:

```tsx
import { OverlayProvider } from "@vlkoss/cue";

export function App() {
  return (
    <OverlayProvider>
      <Page />
    </OverlayProvider>
  );
}
```

Create an overlay:

```tsx
import { createOverlay, type OverlayProps } from "@vlkoss/cue";
import { Dialog } from "./dialog";

export const settingsDialog = createOverlay((props: OverlayProps) => (
  <Dialog {...props} title="Settings">
    <button type="button" onClick={() => settingsDialog.close()}>
      Close
    </button>
  </Dialog>
));
```

Open it:

```tsx
settingsDialog.open();
```

Pass a props generic when the overlay needs data at open time:

```tsx
export const confirmDeleteDialog = createOverlay<{
  organizationName: string;
}>((props) => (
  <Dialog {...props} title={`Delete ${props.organizationName}?`} />
));

confirmDeleteDialog.open({ organizationName: "Atlas" });
```

`OverlayProps` is `{ open, onOpenChange }`. Spread them onto your dialog so Escape and backdrop clicks still close it.

## API

### `createOverlay(component)`

Returns `{ open, close, openAsync, component }`.

| Method | Description |
| --- | --- |
| `open(props?)` | Show the overlay. Extra props are required when you pass a props generic. |
| `close({ unmount?, delay? })` | Sets `open` to `false`, then unmounts after `delay` (default `300`) so exit animations can finish. Pass `{ unmount: false }` to keep it mounted. |
| `openAsync(props?)` | Same as `open`, then a `Promise<boolean>` that resolves `false` when the overlay closes. |
| `component` | The component you passed in. |

### `OverlayProvider`

Renders children plus every currently visible overlay. Mount it once near the root.

### `OverlayManager`

The singleton store used by `createOverlay` and `OverlayProvider`. You rarely call this yourself.

## License

[MIT](./LICENSE)
