# cue

Cue gives a React app one small, imperative overlay environment. Create it once, define overlays from that instance, and mount its provider near the root.

## Install

```sh
npm i @vlkoss/cue
```

## Create a Cue

Start with no configuration:

```tsx
// components/cue.ts
"use client";

import { createCue } from "@vlkoss/cue";

export const cue = createCue();
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

Define an overlay from the same instance. The callback receives application props first and Cue runtime context second.

```tsx
import { cue } from "./components/cue";

export const confirmDialog = cue.createOverlay<{ message: string }, boolean>((props, ctx) => (
  <div role="dialog" aria-hidden={!ctx.open}>
    <p>{props.message}</p>
    <button type="button" onClick={() => ctx.close({ result: false })}>
      Cancel
    </button>
    <button type="button" onClick={() => ctx.close({ result: true })}>
      Confirm
    </button>
  </div>
));
```

Open it from event handlers, effects, or other client-side code:

```tsx
const close = confirmDialog.open({ message: "Archive this project?" });
const result = await confirmDialog.openAsync({ message: "Delete this project?" });
confirmDialog.closeAll();
```

`open()` returns a close function for that instance. `close({ result })` settles the matching `openAsync()` call. Props with only optional keys can be omitted from `open()` and `openAsync()`.

## Using shadcn

If your app uses shadcn, the [Using Cue with shadcn guide](https://cue.vlkstudio.com/docs/shadcn) explains the registry setup and the native Dialog backdrop adapter.

## Customization

Cue has no backdrop or shared components by default. Add them with `createCue({ backdrop, components })` when your application needs them. See the [Customization guide](https://cue.vlkstudio.com/docs/customization).

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

## Docs

[cue.vlkstudio.com](https://cue.vlkstudio.com)

## Credits

Docs design inspired by [Emil Kowalski](https://emilkowal.ski/) ([@emilkowalski](https://x.com/emilkowalski)), especially [Sonner](https://sonner.emilkowal.ski/) and [Vaul](https://vaul.emilkowal.ski/).

## License

[MIT](./packages/react/LICENSE)
