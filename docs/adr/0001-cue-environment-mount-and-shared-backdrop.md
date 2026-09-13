# Cue environment mount and shared backdrop

Cue is an overlay environment, not a dialog host. OverlayProvider portals the shared backdrop and every overlay instance to `document.body`, or to a `container` you pass. The shared backdrop is not a dialog. It follows close delay. It is chosen from the top open overlay instance that did not opt out: that overlay definition's replacement, otherwise the environment's. `backdrop: false` skips that overlay instance so a lower one can keep the dim. Unmounting the outlet provider dismisses pending `openAsync()` calls as `undefined` and clears the stack.

## Considered options

- Render in-flow at the provider. Headless overlay instances clip inside `overflow: hidden`.
- Portal only the dim. A headless overlay instance stays in the app tree and sits under the dim.
- Make Cue a Dialog host. Every overlay would have to be a dialog.
- `backdrop: false` kills the dim for the whole stack. Popovers and alerts opened over a dialog would undim that dialog.
- Keep overlay instances in the store after the provider unmounts. `openAsync()` hangs, and a remount resurrects the stack.

We rejected those. The Cue environment owns the stack, the close delay, and one dim. Overlay authors still supply the UI.
