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

Cue exposes the configured components through `ctx.components` and leaves composition to each overlay. It renders the configured backdrop once for the visible stack. A UI library backdrop adapter must provide any root or portal context the library requires.

Closing instances remain visible during their `delay`, but the backdrop disappears as soon as the final open instance starts closing. Instances always unmount after that delay. There is no `unmount: false` option.

Each call to `createCue()` creates an isolated store, provider, definitions, and lifecycle state. The package does not export global `createOverlay`, `OverlayProvider`, or `OverlayManager` values.

## Types

`OverlayContext<C, R>` contains `open`, `onOpenChange`, `close`, and the exact component map inferred from `createCue({ components })`. `CloseOptions<R>` accepts `result` and `delay`.

## License

[MIT](./LICENSE)
