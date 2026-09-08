import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OverlayManager, createOverlay } from "./overlay-manager.js";

function Dummy() {
  return null;
}

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("OverlayManager", () => {
  it("assigns a distinct id to each overlay", () => {
    const first = OverlayManager.add(Dummy);
    const second = OverlayManager.add(Dummy);

    expect(first).not.toBe(second);
  });

  it("registers an overlay as closed and hidden", () => {
    const id = OverlayManager.add(Dummy);

    expect(OverlayManager.all().some((overlay) => overlay.id === id)).toBe(true);

    const overlay = OverlayManager.all().find((item) => item.id === id);
    expect(overlay?.open).toBe(false);
    expect(overlay?.visible).toBe(false);
  });

  it("opens an overlay and notifies subscribers", () => {
    const id = OverlayManager.add(Dummy);
    const listener = vi.fn();
    const unsubscribe = OverlayManager.subscribe(listener);

    OverlayManager.open(id, { title: "Hello" });

    const overlay = OverlayManager.all().find((item) => item.id === id);
    expect(overlay?.open).toBe(true);
    expect(overlay?.visible).toBe(true);
    expect(overlay?.props).toMatchObject({ title: "Hello" });
    expect(listener).toHaveBeenCalled();

    unsubscribe();
  });

  it("closes then removes after the default delay", () => {
    const id = OverlayManager.add(Dummy);
    OverlayManager.open(id, {});

    OverlayManager.close(id);

    let overlay = OverlayManager.all().find((item) => item.id === id);
    expect(overlay?.open).toBe(false);
    expect(overlay?.visible).toBe(true);

    vi.advanceTimersByTime(300);

    expect(OverlayManager.all().some((item) => item.id === id)).toBe(false);
  });

  it("closes then removes after a custom delay", () => {
    const id = OverlayManager.add(Dummy);
    OverlayManager.open(id, {});

    OverlayManager.close(id, { delay: 50 });

    expect(OverlayManager.all().some((item) => item.id === id)).toBe(true);

    vi.advanceTimersByTime(49);
    expect(OverlayManager.all().some((item) => item.id === id)).toBe(true);

    vi.advanceTimersByTime(1);
    expect(OverlayManager.all().some((item) => item.id === id)).toBe(false);
  });
});

function ConfirmDummy() {
  return null;
}

type CloseOptions = { result?: unknown; delay?: number };

describe("createOverlay", () => {
  it("open returns a close that only closes that instance", () => {
    const confirm = createOverlay(ConfirmDummy);

    const closeFirst = confirm.open();
    const closeSecond = confirm.open();

    const openIds = OverlayManager.all()
      .filter((item) => item.component === ConfirmDummy && item.open)
      .map((item) => item.id);

    expect(openIds).toHaveLength(2);

    closeFirst();

    const stillOpen = OverlayManager.all().filter(
      (item) => item.component === ConfirmDummy && item.open,
    );
    expect(stillOpen).toHaveLength(1);

    closeSecond();
    expect(
      OverlayManager.all().filter((item) => item.component === ConfirmDummy && item.open),
    ).toHaveLength(0);
  });

  it("opens with typed props and closes through onOpenChange", () => {
    const confirm = createOverlay<{ name: string }>(ConfirmDummy);

    confirm.open({ name: "Atlas" });

    const overlay = OverlayManager.all().find(
      (item) => item.component === ConfirmDummy && item.open,
    );
    expect(overlay?.props).toMatchObject({ name: "Atlas" });

    const onOpenChange = overlay?.props.onOpenChange as (open: boolean) => void;
    onOpenChange(false);

    expect(OverlayManager.all().find((item) => item.component === ConfirmDummy && item.open)).toBe(
      undefined,
    );
  });

  it("injects close into overlay props", () => {
    const confirm = createOverlay(ConfirmDummy);
    confirm.open();

    const overlay = OverlayManager.all().find(
      (item) => item.component === ConfirmDummy && item.open,
    );
    const close = overlay?.props.close as (options?: CloseOptions) => void;

    close();

    expect(OverlayManager.all().find((item) => item.component === ConfirmDummy && item.open)).toBe(
      undefined,
    );
  });

  it("openAsync resolves undefined when no result type is declared", async () => {
    const confirm = createOverlay(ConfirmDummy);
    const result = confirm.openAsync();

    const overlay = OverlayManager.all().find(
      (item) => item.component === ConfirmDummy && item.open,
    );
    const close = overlay?.props.close as (options?: CloseOptions) => void;
    close();

    await expect(result).resolves.toBeUndefined();
  });

  it("openAsync resolves undefined when dismissed through onOpenChange", async () => {
    const confirm = createOverlay(ConfirmDummy);
    const result = confirm.openAsync();

    const overlay = OverlayManager.all().find(
      (item) => item.component === ConfirmDummy && item.open,
    );
    const onOpenChange = overlay?.props.onOpenChange as (open: boolean) => void;
    onOpenChange(false);

    await expect(result).resolves.toBeUndefined();
  });

  it("openAsync resolves the declared result type", async () => {
    const confirm = createOverlay<{ title: string }, "one" | "two">(ConfirmDummy);
    const result = confirm.openAsync({ title: "Pick" });

    const overlay = OverlayManager.all().find(
      (item) => item.component === ConfirmDummy && item.open,
    );
    const close = overlay?.props.close as (options?: { result?: "one" | "two" }) => void;
    close({ result: "one" });

    await expect(result).resolves.toBe("one");
  });

  it("openAsync resolves undefined on dismiss when a result type is declared", async () => {
    const confirm = createOverlay<{}, "one" | "two">(ConfirmDummy);
    const result = confirm.openAsync();

    const overlay = OverlayManager.all().find(
      (item) => item.component === ConfirmDummy && item.open,
    );
    const onOpenChange = overlay?.props.onOpenChange as (open: boolean) => void;
    onOpenChange(false);

    await expect(result).resolves.toBeUndefined();
  });

  it("close always unmounts after the delay", () => {
    const confirm = createOverlay(ConfirmDummy);
    const closeInstance = confirm.open();

    const overlayId = OverlayManager.all().find(
      (item) => item.component === ConfirmDummy && item.open,
    )?.id;

    closeInstance({ delay: 50 });

    expect(OverlayManager.all().find((item) => item.id === overlayId)?.open).toBe(false);
    expect(OverlayManager.all().find((item) => item.id === overlayId)?.visible).toBe(true);

    vi.advanceTimersByTime(50);
    expect(OverlayManager.all().find((item) => item.id === overlayId)).toBe(undefined);
  });

  it("openAsync pending results stay isolated per instance", async () => {
    const confirm = createOverlay<{}, boolean>(ConfirmDummy);

    const firstResult = confirm.openAsync();
    const secondResult = confirm.openAsync();

    const instances = OverlayManager.all().filter(
      (item) => item.component === ConfirmDummy && item.open,
    );
    expect(instances).toHaveLength(2);

    const closeFirst = instances[0]?.props.close as (options?: { result?: boolean }) => void;
    const closeSecond = instances[1]?.props.close as (options?: { result?: boolean }) => void;
    closeFirst({ result: true });
    closeSecond({ result: false });

    await expect(firstResult).resolves.toBe(true);
    await expect(secondResult).resolves.toBe(false);
  });

  it("closeAll dismisses every instance of that overlay", () => {
    const confirm = createOverlay(ConfirmDummy);
    confirm.open();
    confirm.open();

    expect(
      OverlayManager.all().filter((item) => item.component === ConfirmDummy && item.open),
    ).toHaveLength(2);

    confirm.closeAll();

    expect(
      OverlayManager.all().filter((item) => item.component === ConfirmDummy && item.open),
    ).toHaveLength(0);
  });
});
