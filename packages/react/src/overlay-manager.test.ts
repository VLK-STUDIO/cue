import { renderToStaticMarkup } from "react-dom/server";
import { createElement, type ReactNode } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createCue, type OverlayContext } from "./index.js";

function Backdrop() {
  return createElement("div", { "data-cue-backdrop": true });
}

function renderProvider(cue: ReturnType<typeof createCue>) {
  return renderToStaticMarkup(createElement(cue.OverlayProvider));
}

function count(markup: string, marker: string) {
  return markup.split(marker).length - 1;
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe("Cue isolation", () => {
  it("keeps independently created Cue instances isolated", () => {
    const a = createCue({ backdrop: Backdrop });
    const b = createCue({ backdrop: Backdrop });
    const aOverlay = a.createOverlay(() => createElement("div", { "data-overlay": "a" }));
    const bOverlay = b.createOverlay(() => createElement("div", { "data-overlay": "b" }));

    aOverlay.open();

    expect(renderProvider(a)).toContain('data-overlay="a"');
    expect(renderProvider(b)).not.toContain("data-overlay");

    bOverlay.open();
    expect(renderProvider(a)).not.toContain('data-overlay="b"');
    expect(renderProvider(b)).toContain('data-overlay="b"');
  });
});

describe("overlay handles", () => {
  it("keeps each returned close function bound to one instance", () => {
    const cue = createCue();
    const dialog = cue.createOverlay<{ id: string }>((props, context) =>
      createElement("div", {
        "data-overlay-id": props.id,
        "data-open": context.open,
      }),
    );

    const closeFirst = dialog.open({ id: "first" });
    dialog.open({ id: "second" });
    closeFirst();

    const markup = renderProvider(cue);
    expect(markup).toContain('data-overlay-id="first" data-open="false"');
    expect(markup).toContain('data-overlay-id="second" data-open="true"');
  });

  it("closes an instance through onOpenChange", () => {
    let context: OverlayContext<{}, undefined> | undefined;
    const cue = createCue();
    const dialog = cue.createOverlay((_props, nextContext) => {
      context = nextContext;
      return null;
    });

    dialog.open();
    renderProvider(cue);
    context?.onOpenChange(false);

    expect(renderProvider(cue)).toBe("");
    vi.advanceTimersByTime(300);
    expect(renderProvider(cue)).toBe("");
  });

  it("closeAll closes every instance from one overlay definition", () => {
    const cue = createCue();
    const dialog = cue.createOverlay((_props, context) =>
      createElement("div", { "data-open": context.open }),
    );

    dialog.open();
    dialog.open();
    dialog.closeAll();

    expect(count(renderProvider(cue), 'data-open="false"')).toBe(2);
    vi.advanceTimersByTime(300);
    expect(renderProvider(cue)).not.toContain("data-open");
  });
});

describe("async overlays", () => {
  it("keeps concurrent results isolated", async () => {
    const contexts = new Map<string, OverlayContext<{}, boolean>>();
    const cue = createCue({ backdrop: Backdrop });
    const dialog = cue.createOverlay<{ id: string }, boolean>((props, context) => {
      contexts.set(props.id, context);
      return createElement("div", { "data-overlay-id": props.id });
    });

    const first = dialog.openAsync({ id: "first" });
    const second = dialog.openAsync({ id: "second" });
    renderProvider(cue);

    contexts.get("first")?.close({ result: true });
    expect(count(renderProvider(cue), "data-cue-backdrop")).toBe(1);
    contexts.get("second")?.close({ result: false });

    await expect(first).resolves.toBe(true);
    await expect(second).resolves.toBe(false);
  });

  it("settles every pending result through closeAll", async () => {
    const cue = createCue();
    const dialog = cue.createOverlay<{}, string>(() => null);
    const first = dialog.openAsync();
    const second = dialog.openAsync();

    dialog.closeAll({ result: "dismissed" });

    await expect(first).resolves.toBe("dismissed");
    await expect(second).resolves.toBe("dismissed");
  });

  it("resolves dismissals as undefined", async () => {
    let context: OverlayContext<{}, boolean> | undefined;
    const cue = createCue();
    const dialog = cue.createOverlay<{}, boolean>((_props, nextContext) => {
      context = nextContext;
      return null;
    });

    const result = dialog.openAsync();
    renderProvider(cue);
    context?.onOpenChange(false);

    await expect(result).resolves.toBeUndefined();
  });
});

describe("shared components", () => {
  function Wrapper({ children }: { children?: ReactNode }) {
    return createElement("section", { "data-component": "wrapper" }, children);
  }

  function Footer({ children }: { children?: ReactNode }) {
    return createElement("footer", { "data-component": "footer" }, children);
  }

  it("passes configured components through context without merging them into props", () => {
    const seenProps: object[] = [];
    const seenContexts: object[] = [];
    const cue = createCue({ components: { wrapper: Wrapper, footer: Footer } });
    const dialog = cue.createOverlay<{ message: string }>((props, context) => {
      seenProps.push(props);
      seenContexts.push(context);
      const WrapperComponent = context.components.wrapper;
      const FooterComponent = context.components.footer;

      return createElement(
        WrapperComponent,
        null,
        props.message,
        createElement(FooterComponent, null, "Actions"),
      );
    });

    dialog.open({ message: "Hello" });
    const markup = renderProvider(cue);

    expect(markup).toContain('data-component="wrapper"');
    expect(markup).toContain('data-component="footer"');
    expect(seenProps[0]).toEqual({ message: "Hello" });
    expect(Object.keys(seenContexts[0] ?? {}).sort()).toEqual([
      "close",
      "components",
      "onOpenChange",
      "open",
    ]);
  });
});

describe("shared backdrop", () => {
  it("renders one backdrop for an open stack", () => {
    const cue = createCue({ backdrop: Backdrop });
    const dialog = cue.createOverlay(() => createElement("div", { "data-overlay": true }));

    expect(count(renderProvider(cue), "data-cue-backdrop")).toBe(0);
    dialog.open();
    expect(count(renderProvider(cue), "data-cue-backdrop")).toBe(1);
    dialog.open();
    expect(count(renderProvider(cue), "data-cue-backdrop")).toBe(1);
  });

  it("keeps the backdrop while a closing instance remains visible", () => {
    const cue = createCue({ backdrop: Backdrop });
    let renderCount = 0;
    let closeTop: OverlayContext<{}, undefined>["close"] | undefined;
    const dialog = cue.createOverlay((_props, context) => {
      if (renderCount++ === 1) {
        closeTop = context.close;
      }
      return null;
    });
    dialog.open();
    dialog.open();
    renderProvider(cue);

    closeTop?.({ delay: 50 });
    expect(count(renderProvider(cue), "data-cue-backdrop")).toBe(1);

    vi.advanceTimersByTime(50);
    expect(count(renderProvider(cue), "data-cue-backdrop")).toBe(1);
  });

  it("removes the backdrop when the final instance starts closing", () => {
    const cue = createCue({ backdrop: Backdrop });
    let close: OverlayContext<{}, undefined>["close"] | undefined;
    const dialog = cue.createOverlay((_props, context) => {
      close = context.close;
      return null;
    });
    dialog.open();
    renderProvider(cue);

    close?.({ delay: 50 });
    expect(count(renderProvider(cue), "data-cue-backdrop")).toBe(0);
    vi.advanceTimersByTime(50);
    expect(count(renderProvider(cue), "data-cue-backdrop")).toBe(0);
  });

  it("removes the backdrop when closeAll starts closing the final instances", () => {
    const cue = createCue({ backdrop: Backdrop });
    const dialog = cue.createOverlay(() => null);
    dialog.open();
    dialog.open();

    dialog.closeAll({ delay: 25 });
    expect(count(renderProvider(cue), "data-cue-backdrop")).toBe(0);
    vi.advanceTimersByTime(25);
    expect(count(renderProvider(cue), "data-cue-backdrop")).toBe(0);
  });
});
