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

		expect(OverlayManager.all().some((overlay) => overlay.id === id)).toBe(
			true,
		);

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

	it("closes then unmounts after the default delay", () => {
		const id = OverlayManager.add(Dummy);
		OverlayManager.open(id, {});

		OverlayManager.close(id);

		let overlay = OverlayManager.all().find((item) => item.id === id);
		expect(overlay?.open).toBe(false);
		expect(overlay?.visible).toBe(true);

		vi.advanceTimersByTime(300);

		overlay = OverlayManager.all().find((item) => item.id === id);
		expect(overlay?.open).toBe(false);
		expect(overlay?.visible).toBe(false);
	});
});

function ConfirmDummy() {
	return null;
}

describe("createOverlay", () => {
	it("opens with typed props and closes through onOpenChange", () => {
		const confirm = createOverlay<{ name: string }>(ConfirmDummy);

		confirm.open({ name: "Atlas" });

		const overlay = OverlayManager.all().find(
			(item) => item.component === ConfirmDummy && item.open,
		);
		expect(overlay?.props).toMatchObject({ name: "Atlas" });

		const onOpenChange = overlay?.props.onOpenChange as (open: boolean) => void;
		onOpenChange(false);

		expect(
			OverlayManager.all().find((item) => item.component === ConfirmDummy)?.open,
		).toBe(false);
	});
});
