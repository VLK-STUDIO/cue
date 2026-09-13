# @vlkoss/cue

Imperative React overlays with isolated state and optional shared components and backdrops.

## Install

```sh
npm i @vlkoss/cue
```

## Create a Cue

Create one Cue instance in a client-side module:

```tsx
import { createCue } from "@vlkoss/cue";

export const cue = createCue();
```

Mount its provider once:

```tsx
<cue.OverlayProvider>{children}</cue.OverlayProvider>
```

Create overlays from that instance. `props` contains only values passed to `open()` or `openAsync()`. Cue-owned values are in the second callback argument.

```tsx
const dialog = cue.createOverlay<{ message: string }, boolean>((props, ctx) => (
  <div role="dialog" aria-hidden={!ctx.open}>
    <p>{props.message}</p>
    <button type="button" onClick={() => ctx.close({ result: true })}>
      Confirm
    </button>
  </div>
));
```

```tsx
dialog.open({ message: "Continue?" });
const result = await dialog.openAsync({ message: "Continue?" });
dialog.closeAll();
```

`open()` returns a close function for one instance. `close({ result })` resolves the matching async call. Required props must be passed. If every prop is optional, both methods also accept no argument.

## Configure shared UI

Pass a backdrop or any application-defined component map when you need them:

```tsx
const cue = createCue({
  backdrop: OverlayBackdrop,
  components: {
    wrapper: OverlayWrapper,
    footer: OverlayFooter,
  },
});
```

Cue exposes the configured components through `ctx.components` and leaves composition to each overlay. The OverlayProvider portals the shared backdrop and overlay instances to `document.body`, or to `container`. The backdrop receives `open` and `close`. Choose `{ strategy: "last" }` or `{ strategy: "all" }`.

An overlay definition may pass `{ backdrop: false }` to opt out of the dim, or pass a replacement. `createCue({ delay })` sets the close delay. Default `300`. `open()` returns a `close` that accepts `{ result, delay }` like `ctx.close`.

Unmounting the provider dismisses pending `openAsync()` calls as `undefined` and clears the stack. There is no `unmount: false` option.

Each call to `createCue()` creates an isolated store, provider, definitions, and lifecycle state. The package does not export global `createOverlay`, `OverlayProvider`, or `OverlayManager` values.

## Types

`OverlayContext<C, R>` contains `open`, `onOpenChange`, `close`, and the exact component map inferred from `createCue({ components })`. `CloseOptions<R>` accepts `result` and `delay`. The package also exports `OverlayHandle`, `CueOptions`, `CueBackdrop`, `CueBackdropCloseOptions`, `OverlayDefinitionOptions`, and `OverlayProviderProps`.

## License

[MIT](./LICENSE)
