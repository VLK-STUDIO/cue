# cue

Cue gives a React app one small, imperative overlay environment. Create it once, define overlays from that instance, and mount its provider near the root.

## Install

```sh
npm i @vlkoss/cue
```

You can also install a local starter configuration through the [shadcn registry](https://ui.shadcn.com/docs/registry):

```sh
npx shadcn@latest add https://cue.vlkstudio.com/r/cue.json
```

The registry also installs shadcn's `dialog` item and generates one local `cue` module containing the shared Dialog components and a provider-level backdrop built from the local shadcn Dialog wrapper. Add the documented `showBackdrop` prop to the local `DialogContent`; the generated `content` adapter disables that local backdrop so the provider remains the only backdrop owner.

## Usage

Create the Cue environment in a client-side module. Its components are application-defined and inferred from this object.

```tsx
// components/cue.ts
import { createCue } from "@vlkoss/cue";
import { OverlayBackdrop } from "./overlay-backdrop";
import { OverlayFooter } from "./overlay-footer";
import { OverlayWrapper } from "./overlay-wrapper";

export const cue = createCue({
  backdrop: OverlayBackdrop,
  components: {
    wrapper: OverlayWrapper,
    footer: OverlayFooter,
  },
});
```

Mount that instance once:

```tsx
import { cue } from "./components/cue";

export function App() {
  return (
    <cue.OverlayProvider>
      <Page />
    </cue.OverlayProvider>
  );
}
```

Define overlays from the same instance. Application props and Cue runtime context stay separate.

```tsx
import { cue } from "./components/cue";
import { Dialog } from "./dialog";

export const confirmDialog = cue.createOverlay<{ message: string }, boolean>((props, ctx) => {
  const components = ctx.components;

  return (
    <Dialog open={ctx.open} onOpenChange={ctx.onOpenChange}>
      <components.wrapper>
        <p>{props.message}</p>
        <components.footer>
          <button type="button" onClick={() => ctx.close({ result: false })}>
            Cancel
          </button>
          <button type="button" onClick={() => ctx.close({ result: true })}>
            Confirm
          </button>
        </components.footer>
      </components.wrapper>
    </Dialog>
  );
});
```

Open it from event handlers, effects, or other client-side code:

```tsx
const close = confirmDialog.open({ message: "Archive this project?" });
const result = await confirmDialog.openAsync({ message: "Delete this project?" });
confirmDialog.closeAll();
```

`open()` returns a close function for that instance only. `close({ result })` settles the matching `openAsync()` call. Props with only optional keys can be omitted from `open()` and `openAsync()`.

Cue renders one configured backdrop for the whole open stack. The backdrop disappears as soon as the final open instance starts closing, while that instance remains mounted for its exit delay.

## Next.js

Put `createCue()` and the overlay definitions in a client-side module. A server layout can render the provider:

```tsx
// app/layout.tsx
import { cue } from "@/components/cue";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <cue.OverlayProvider>{children}</cue.OverlayProvider>
      </body>
    </html>
  );
}
```

## Breaking pre-v1 change

Cue no longer exports a global `createOverlay`, `OverlayProvider`, or `OverlayManager`. Every overlay belongs to the Cue instance that created it.

## Docs

[cue.vlkstudio.com](https://cue.vlkstudio.com)

## License

[MIT](./packages/react/LICENSE)
