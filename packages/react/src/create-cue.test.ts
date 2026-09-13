import { createElement, type ReactNode } from "react";
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createCue, type OverlayContext } from "./index.js";

function Backdrop({ open }: { open: boolean }) {
  return createElement("div", { "data-cue-backdrop": true, "data-open": String(open) });
}

function mutate(run: () => void) {
  act(run);
}

function mount(cue: ReturnType<typeof createCue>, container?: Element | DocumentFragment) {
  return render(createElement(cue.OverlayProvider, container ? { container } : null));
}

afterEach(() => {
  cleanup();
  vi.clearAllTimers();
  vi.useRealTimers();
});

describe("Cue isolation", () => {
  it("keeps independently created Cue instances isolated", () => {
    const portalA = document.createElement("div");
    const portalB = document.createElement("div");
    document.body.append(portalA, portalB);

    const a = createCue({ backdrop: Backdrop });
    const b = createCue({ backdrop: Backdrop });
    const aOverlay = a.createOverlay(() => createElement("div", { "data-overlay": "a" }));
    const bOverlay = b.createOverlay(() => createElement("div", { "data-overlay": "b" }));

    mount(a, portalA);
    mount(b, portalB);
    mutate(() => {
      aOverlay.open();
    });

    expect(portalA.querySelector('[data-overlay="a"]')).not.toBeNull();
    expect(portalB.querySelector("[data-overlay]")).toBeNull();

    mutate(() => {
      bOverlay.open();
    });
    expect(portalA.querySelector('[data-overlay="b"]')).toBeNull();
    expect(portalB.querySelector('[data-overlay="b"]')).not.toBeNull();

    portalA.remove();
    portalB.remove();
  });
});

describe("overlay handles", () => {
  it("keeps each returned close function bound to one instance", () => {
    const cue = createCue();
    const dialog = cue.createOverlay<{ id: string }>((props, context) =>
      createElement("div", {
        "data-overlay-id": props.id,
        "data-open": String(context.open),
      }),
    );

    mount(cue);
    let closeFirst: () => void = () => {};
    mutate(() => {
      closeFirst = dialog.open({ id: "first" });
      dialog.open({ id: "second" });
    });
    mutate(() => {
      closeFirst();
    });

    expect(document.querySelector('[data-overlay-id="first"]')?.getAttribute("data-open")).toBe(
      "false",
    );
    expect(document.querySelector('[data-overlay-id="second"]')?.getAttribute("data-open")).toBe(
      "true",
    );
  });

  it("closes an instance through onOpenChange", () => {
    vi.useFakeTimers();
    let context: OverlayContext<{}, undefined> | undefined;
    const cue = createCue();
    const dialog = cue.createOverlay((_props, nextContext) => {
      context = nextContext;
      return createElement("div", { "data-overlay": true, "data-open": String(nextContext.open) });
    });

    mount(cue);
    mutate(() => {
      dialog.open();
    });
    mutate(() => {
      context?.onOpenChange(false);
    });

    expect(document.querySelector("[data-overlay]")?.getAttribute("data-open")).toBe("false");
    mutate(() => {
      vi.advanceTimersByTime(300);
    });
    expect(document.querySelector("[data-overlay]")).toBeNull();
  });

  it("closeAll closes every instance from one overlay definition", () => {
    vi.useFakeTimers();
    const cue = createCue();
    const dialog = cue.createOverlay((_props, context) =>
      createElement("div", { "data-overlay": true, "data-open": String(context.open) }),
    );

    mount(cue);
    mutate(() => {
      dialog.open();
      dialog.open();
      dialog.closeAll();
    });

    expect(document.querySelectorAll('[data-open="false"]').length).toBe(2);
    mutate(() => {
      vi.advanceTimersByTime(300);
    });
    expect(document.querySelector("[data-overlay]")).toBeNull();
  });

  it("lets the opener pass CloseOptions through the returned close", () => {
    vi.useFakeTimers();
    const cue = createCue({ delay: 300 });
    const dialog = cue.createOverlay(() => createElement("div", { "data-overlay": true }));

    mount(cue);
    let close: (options?: { delay?: number }) => void = () => {};
    mutate(() => {
      close = dialog.open();
    });
    mutate(() => {
      close({ delay: 10 });
    });

    expect(document.querySelector("[data-overlay]")).not.toBeNull();
    mutate(() => {
      vi.advanceTimersByTime(10);
    });
    expect(document.querySelector("[data-overlay]")).toBeNull();
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

    mount(cue);
    let first!: Promise<boolean | undefined>;
    let second!: Promise<boolean | undefined>;
    mutate(() => {
      first = dialog.openAsync({ id: "first" });
      second = dialog.openAsync({ id: "second" });
    });

    expect(document.querySelectorAll("[data-cue-backdrop]").length).toBe(1);

    mutate(() => {
      contexts.get("first")?.close({ result: true });
      contexts.get("second")?.close({ result: false });
    });

    await expect(first).resolves.toBe(true);
    await expect(second).resolves.toBe(false);
  });

  it("settles every pending result through closeAll", async () => {
    const cue = createCue({ delay: 0 });
    const dialog = cue.createOverlay<{}, string>(() => null);
    mount(cue);
    let first!: Promise<string | undefined>;
    let second!: Promise<string | undefined>;
    mutate(() => {
      first = dialog.openAsync();
      second = dialog.openAsync();
    });

    mutate(() => {
      dialog.closeAll({ result: "dismissed" });
    });

    await expect(first).resolves.toBe("dismissed");
    await expect(second).resolves.toBe("dismissed");
  });

  it("resolves dismissals as undefined", async () => {
    let context: OverlayContext<{}, boolean> | undefined;
    const cue = createCue({ delay: 0 });
    const dialog = cue.createOverlay<{}, boolean>((_props, nextContext) => {
      context = nextContext;
      return null;
    });

    mount(cue);
    let result!: Promise<boolean | undefined>;
    mutate(() => {
      result = dialog.openAsync();
    });
    mutate(() => {
      context?.onOpenChange(false);
    });

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

    mount(cue);
    mutate(() => {
      dialog.open({ message: "Hello" });
    });

    expect(document.querySelector('[data-component="wrapper"]')).not.toBeNull();
    expect(document.querySelector('[data-component="footer"]')).not.toBeNull();
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
  it("lets the backdrop choose which instances to close", () => {
    let closeOverlays: ((options: { strategy: "last" | "all" }) => void) | undefined;
    function ConfiguredBackdrop({
      open,
      close,
    }: {
      open: boolean;
      close: (options: { strategy: "last" | "all" }) => void;
    }) {
      closeOverlays = close;
      return createElement("div", { "data-cue-backdrop": true, "data-open": String(open) });
    }

    const cue = createCue({ backdrop: ConfiguredBackdrop });
    const dialog = cue.createOverlay((_props, context) =>
      createElement("div", { "data-open": String(context.open) }),
    );

    mount(cue);
    mutate(() => {
      dialog.open();
      dialog.open();
    });
    expect(document.querySelectorAll("[data-cue-backdrop]").length).toBe(1);

    mutate(() => {
      closeOverlays?.({ strategy: "last" });
    });

    expect(document.querySelectorAll('[data-open="false"]:not([data-cue-backdrop])').length).toBe(
      1,
    );
    expect(document.querySelectorAll('[data-open="true"]:not([data-cue-backdrop])').length).toBe(1);
    expect(document.querySelectorAll("[data-cue-backdrop]").length).toBe(1);

    mutate(() => {
      closeOverlays?.({ strategy: "all" });
    });

    expect(document.querySelectorAll('[data-open="false"]:not([data-cue-backdrop])').length).toBe(
      2,
    );
    expect(document.querySelectorAll('[data-open="true"]:not([data-cue-backdrop])').length).toBe(0);
    expect(document.querySelector("[data-cue-backdrop]")?.getAttribute("data-open")).toBe("false");
  });

  it("renders one backdrop for an open stack", () => {
    const cue = createCue({ backdrop: Backdrop });
    const dialog = cue.createOverlay(() => createElement("div", { "data-overlay": true }));

    mount(cue);
    expect(document.querySelector("[data-cue-backdrop]")).toBeNull();
    mutate(() => {
      dialog.open();
    });
    expect(document.querySelectorAll("[data-cue-backdrop]").length).toBe(1);
    mutate(() => {
      dialog.open();
    });
    expect(document.querySelectorAll("[data-cue-backdrop]").length).toBe(1);
  });

  it("keeps the backdrop open while a lower instance remains", () => {
    vi.useFakeTimers();
    const cue = createCue({ backdrop: Backdrop });
    let renderCount = 0;
    let closeTop: OverlayContext<{}, undefined>["close"] | undefined;
    const dialog = cue.createOverlay((_props, context) => {
      if (renderCount++ === 1) {
        closeTop = context.close;
      }
      return createElement("div", { "data-open": String(context.open) });
    });

    mount(cue);
    mutate(() => {
      dialog.open();
      dialog.open();
    });

    mutate(() => {
      closeTop?.({ delay: 50 });
    });
    expect(document.querySelector("[data-cue-backdrop]")?.getAttribute("data-open")).toBe("true");

    mutate(() => {
      vi.advanceTimersByTime(50);
    });
    expect(document.querySelector("[data-cue-backdrop]")?.getAttribute("data-open")).toBe("true");
  });

  it("follows close delay on the last overlay instance", () => {
    vi.useFakeTimers();
    const cue = createCue({ backdrop: Backdrop });
    let close: OverlayContext<{}, undefined>["close"] | undefined;
    const dialog = cue.createOverlay((_props, context) => {
      close = context.close;
      return createElement("div", { "data-overlay": true });
    });

    mount(cue);
    mutate(() => {
      dialog.open();
    });
    mutate(() => {
      close?.({ delay: 50 });
    });

    expect(document.querySelector("[data-cue-backdrop]")?.getAttribute("data-open")).toBe("false");
    expect(document.querySelector("[data-overlay]")).not.toBeNull();

    mutate(() => {
      vi.advanceTimersByTime(50);
    });
    expect(document.querySelector("[data-cue-backdrop]")).toBeNull();
    expect(document.querySelector("[data-overlay]")).toBeNull();
  });

  it("follows close delay when closeAll starts closing the final instances", () => {
    vi.useFakeTimers();
    const cue = createCue({ backdrop: Backdrop });
    const dialog = cue.createOverlay(() => createElement("div", { "data-overlay": true }));

    mount(cue);
    mutate(() => {
      dialog.open();
      dialog.open();
      dialog.closeAll({ delay: 25 });
    });

    expect(document.querySelector("[data-cue-backdrop]")?.getAttribute("data-open")).toBe("false");
    mutate(() => {
      vi.advanceTimersByTime(25);
    });
    expect(document.querySelector("[data-cue-backdrop]")).toBeNull();
  });

  it("keeps the environment dim when the top overlay definition opts out", () => {
    const cue = createCue({ backdrop: Backdrop });
    const dialog = cue.createOverlay(() => createElement("div", { "data-overlay": "dialog" }));
    const popover = cue.createOverlay(() => createElement("div", { "data-overlay": "popover" }), {
      backdrop: false,
    });

    mount(cue);
    mutate(() => {
      dialog.open();
      popover.open();
    });

    expect(document.querySelector("[data-cue-backdrop]")?.getAttribute("data-open")).toBe("true");
  });

  it("has no dim when every open overlay instance opts out", () => {
    const cue = createCue({ backdrop: Backdrop });
    const popover = cue.createOverlay(() => createElement("div", { "data-overlay": "popover" }), {
      backdrop: false,
    });

    mount(cue);
    mutate(() => {
      popover.open();
    });

    expect(document.querySelector("[data-cue-backdrop]")).toBeNull();
    expect(document.querySelector('[data-overlay="popover"]')).not.toBeNull();
  });

  it("uses a replacement backdrop from the top overlay definition", () => {
    function Replacement({ open }: { open: boolean }) {
      return createElement("div", { "data-replacement-backdrop": true, "data-open": String(open) });
    }

    const cue = createCue({ backdrop: Backdrop });
    const dialog = cue.createOverlay(() => createElement("div", { "data-overlay": "dialog" }));
    const lightbox = cue.createOverlay(() => createElement("div", { "data-overlay": "lightbox" }), {
      backdrop: Replacement,
    });

    mount(cue);
    mutate(() => {
      dialog.open();
      lightbox.open();
    });

    expect(document.querySelector("[data-cue-backdrop]")).toBeNull();
    expect(document.querySelector("[data-replacement-backdrop]")).not.toBeNull();
  });
});

describe("OverlayProvider mount", () => {
  it("tears down pending openAsync and mounted instances on unmount", async () => {
    const cue = createCue();
    const dialog = cue.createOverlay(() => createElement("div", { "data-overlay": true }));

    const view = mount(cue);
    let pending!: Promise<unknown>;
    mutate(() => {
      pending = dialog.openAsync();
    });
    expect(document.querySelector("[data-overlay]")).not.toBeNull();

    view.unmount();

    await expect(pending).resolves.toBeUndefined();
    expect(document.querySelector("[data-overlay]")).toBeNull();
  });

  it("does not render overlays from a second provider", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const cue = createCue();
    const dialog = cue.createOverlay(() => createElement("div", { "data-overlay": true }));
    const first = document.createElement("div");
    const second = document.createElement("div");
    document.body.append(first, second);

    render(createElement(cue.OverlayProvider, { container: first }));
    render(createElement(cue.OverlayProvider, { container: second }));
    mutate(() => {
      dialog.open();
    });

    expect(first.querySelector("[data-overlay]")).not.toBeNull();
    expect(second.querySelector("[data-overlay]")).toBeNull();
    expect(warn).toHaveBeenCalled();

    warn.mockRestore();
    first.remove();
    second.remove();
  });

  it("uses the Cue environment delay as the default close delay", () => {
    vi.useFakeTimers();
    const cue = createCue({ delay: 40 });
    let close: OverlayContext["close"] | undefined;
    const dialog = cue.createOverlay((_props, context) => {
      close = context.close;
      return createElement("div", { "data-overlay": true });
    });

    mount(cue);
    mutate(() => {
      dialog.open();
    });
    mutate(() => {
      close?.();
    });

    expect(document.querySelector("[data-overlay]")).not.toBeNull();
    mutate(() => {
      vi.advanceTimersByTime(39);
    });
    expect(document.querySelector("[data-overlay]")).not.toBeNull();
    mutate(() => {
      vi.advanceTimersByTime(1);
    });
    expect(document.querySelector("[data-overlay]")).toBeNull();
  });
});
