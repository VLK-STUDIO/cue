# @vlkoss/cue

## 0.3.0

### Minor Changes

- [#3](https://github.com/VLK-STUDIO/cue/pull/3) [`262eeb5`](https://github.com/VLK-STUDIO/cue/commit/262eeb51957070390e1c278dd0db828e9175fa0f) Thanks [@mauroerta](https://github.com/mauroerta)! - Rename handle `close` to `closeAll` so definition-level close-all is obvious next to instance `close`. Add JSDoc on `createOverlay` and its methods. Mark `OverlayProvider` with `"use client"` and document Next.js App Router usage.

## 0.2.0

### Minor Changes

- [#1](https://github.com/VLK-STUDIO/cue/pull/1) [`af1f1c4`](https://github.com/VLK-STUDIO/cue/commit/af1f1c46325ed94bd9b3a73415fadeb0fec83152) Thanks [@mauroerta](https://github.com/mauroerta)! - Per-instance `open`/`openAsync` with a returned `close`, `OverlayProps.close`, and a typed `openAsync` result (`Promise<R | undefined>`; dismiss is `undefined`).
