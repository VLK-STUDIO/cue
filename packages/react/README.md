# @vlkoss/cue

Imperative React overlays with isolated state, typed application components, and one shared backdrop per Cue environment.

## Install

```sh
npm i @vlkoss/cue
```

## Create a Cue environment

```tsx
import { createCue } from "@vlkoss/cue";

export const cue = createCue({
  backdrop: OverlayBackdrop,
  components: {
    wrapper: OverlayWrapper,
    footer: OverlayFooter,
  },
});
```

Mount its provider once:

```tsx
<cue.OverlayProvider>{children}</cue.OverlayProvider>
```

Create overlays from that instance. `props` contains only values passed to `open()` or `openAsync()`. Cue-owned values are in the second callback argument.

```tsx
const dialog = cue.createOverlay<{ message: string }, boolean>((props, ctx) => {
  const components = ctx.components;

  return (
    <Dialog open={ctx.open} onOpenChange={ctx.onOpenChange}>
      <components.wrapper>
        {props.message}
        <components.footer>
          <button type="button" onClick={() => ctx.close({ result: true })}>
            Confirm
          </button>
        </components.footer>
      </components.wrapper>
    </Dialog>
  );
});
```

```tsx
dialog.open({ message: "Continue?" });
const result = await dialog.openAsync({ message: "Continue?" });
dialog.closeAll();
```

`open()` returns a close function for one instance. `close({ result })` resolves the matching async call. Required props must be passed. If every prop is optional, both methods also accept no argument.

The provider renders the overlay stack and one configured backdrop whenever at least one instance is open. A configured backdrop can be an application adapter around a UI library's native backdrop, but it must provide any context that library requires. Closing instances remain visible during their `delay`, but the backdrop disappears as soon as the final open instance starts closing. Instances always unmount after that delay. There is no `unmount: false` option.

Each call to `createCue()` creates an isolated store, provider, definitions, and lifecycle state. The package does not export global `createOverlay`, `OverlayProvider`, or `OverlayManager` values.

## Types

`OverlayContext<C, R>` contains `open`, `onOpenChange`, `close`, and the exact component map inferred from `createCue({ components })`. `CloseOptions<R>` accepts `result` and `delay`.

## License

[MIT](./LICENSE)
