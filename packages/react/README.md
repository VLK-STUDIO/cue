# @vlkoss/cue

Register a dialog once. Open it from anywhere.

Works with any component that accepts `open` and `onOpenChange`: Radix Dialog, Base UI, vaul, or your own.

## Install

```sh
npm i @vlkoss/cue
```

Source install via shadcn: see the [docs](https://cue.vlkstudio.com/docs) or root README.

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
    <button type="button" onClick={() => props.close()}>
      Close
    </button>
  </Dialog>
));
```

Open it:

```tsx
const close = settingsDialog.open();
```

Pass a props generic when the overlay needs data at open time:

```tsx
export const confirmDeleteDialog = createOverlay<{
  organizationName: string;
}>((props) => <Dialog {...props} title={`Delete ${props.organizationName}?`} />);

confirmDeleteDialog.open({ organizationName: "Atlas" });
```

`OverlayProps` is `{ open, onOpenChange, close }`. Spread `open` and `onOpenChange` onto your dialog so Escape and backdrop clicks still close it. Call `props.close()` from buttons. Pass a second generic to `createOverlay` when `openAsync` should return a result (`Promise<R | undefined>`; dismiss is `undefined`).

## API

### `createOverlay(component)`

Returns `{ open, closeAll, openAsync, component }`.

| Method               | Description                                                                                                                                                      |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `open(props?)`       | Open a new instance. Returns that instance's `close`. Props are required only when the props generic has a required key; all-optional props allow bare `open()`. |
| `closeAll(options?)` | Close every live instance of this overlay. `{ result? }` settles pending `openAsync`s. Always unmounts after `delay` (default 300ms).                            |
| `openAsync(props?)`  | Open a new instance. Returns `Promise<R \| undefined>` when you pass result generic `R`; otherwise `Promise<undefined>`. Dismiss → `undefined`.                  |
| `component`          | The component you passed in. Render it yourself only when the overlay must sit inside a local tree that `OverlayProvider` does not wrap.                         |

### `OverlayProvider`

Renders children plus every currently visible overlay. Mount it once near the root.

## License

[MIT](./LICENSE)
