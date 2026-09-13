# Cue

An overlay environment for a React app. Several callers, or code outside a component, open the same overlay. The environment is not a dialog.

## Language

**Cue environment**:
An isolated set of overlay definitions and overlay instances that share one backdrop.
_Avoid_: overlay manager, dialog host, global overlay

**Overlay definition**:
An overlay created from a Cue environment and opened through its handle. It may replace the shared backdrop, or opt out of providing one so a lower overlay instance can keep it.
_Avoid_: modal, dialog

**Overlay instance**:
One opening of an overlay definition. The overlay author supplies its UI.
_Avoid_: dialog instance

**Overlay handle**:
What callers use to open, await, and close overlay instances of one overlay definition.
_Avoid_: overlay controller, modal ref

**Shared backdrop**:
The single dim that belongs to a Cue environment while at least one overlay instance is mounted. It is not a dialog. It comes from the top open overlay instance that did not opt out: that definition's replacement, otherwise the environment's. If every open overlay instance opted out, there is no dim.
_Avoid_: DialogOverlay, scrim, overlay

**Close delay**:
The duration an overlay instance remains mounted after it has started to close. The shared backdrop uses the same window when that instance is the last.
_Avoid_: unmount delay, animation timeout
