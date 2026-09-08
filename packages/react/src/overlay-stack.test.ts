import { describe, expect, it, vi } from "vitest";
import { createOverlayStack } from "./overlay-stack.js";
import type { OverlayInstance } from "./overlay-manager.js";

function Backdrop() {
  return null;
}

function overlay(id: string, options: { open?: boolean; visible?: boolean } = {}): OverlayInstance {
  return {
    id,
    open: options.open ?? true,
    visible: options.visible ?? true,
    props: {},
    definition: { render: () => null },
    close: vi.fn(),
  };
}

describe("overlay stack", () => {
  it("does not activate a backdrop for a stack without open instances", () => {
    const closing = overlay("closing", { open: false });
    const stack = createOverlayStack([closing], Backdrop);

    expect(stack.visible).toEqual([closing]);
    expect(stack.backdrop).toBeUndefined();

    stack.close({ strategy: "last" });
    expect(closing.close).not.toHaveBeenCalled();
  });

  it("closes the top instance or every open instance by strategy", () => {
    const first = overlay("first");
    const second = overlay("second");
    const stack = createOverlayStack([first, second], Backdrop);

    expect(stack.backdrop).toBe(Backdrop);

    stack.close({ strategy: "last" });
    expect(first.close).not.toHaveBeenCalled();
    expect(second.close).toHaveBeenCalledOnce();

    stack.close({ strategy: "all" });
    expect(first.close).toHaveBeenCalledOnce();
    expect(second.close).toHaveBeenCalledTimes(2);
  });
});
