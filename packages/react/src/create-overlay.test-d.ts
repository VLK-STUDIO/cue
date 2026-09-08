import { assertType, expectTypeOf, test } from "vitest";
import { createOverlay, type CloseOptions, type OverlayProps } from "./overlay-manager.js";

// Intentionally untyped props so createOverlay does not infer OverlayProps into P.
function Dummy() {
  return null;
}

test("no props generic: open and openAsync take no required argument", () => {
  const dialog = createOverlay(Dummy);

  expectTypeOf(dialog.open).toBeCallableWith();
  expectTypeOf(dialog.openAsync).toBeCallableWith();

  dialog.open();
  dialog.openAsync();
});

test("empty props object: open and openAsync remain optional", () => {
  const dialog = createOverlay<{}>(Dummy);

  expectTypeOf(dialog.open).toBeCallableWith();
  expectTypeOf(dialog.openAsync).toBeCallableWith();

  dialog.open();
  dialog.open({});
  dialog.openAsync();
  dialog.openAsync({});
});

test("all-optional props: open() and open({ ... }) both work", () => {
  const dialog = createOverlay<{ title?: string; subtitle?: string }>(Dummy);

  expectTypeOf(dialog.open).toBeCallableWith();
  expectTypeOf(dialog.open).toBeCallableWith({});
  expectTypeOf(dialog.open).toBeCallableWith({ title: "Hi" });
  expectTypeOf(dialog.open).toBeCallableWith({ subtitle: "There" });
  expectTypeOf(dialog.open).toBeCallableWith({ title: "Hi", subtitle: "There" });

  expectTypeOf(dialog.openAsync).toBeCallableWith();
  expectTypeOf(dialog.openAsync).toBeCallableWith({ title: "Hi" });

  dialog.open();
  dialog.open({});
  dialog.open({ title: "Hi" });
  dialog.openAsync();
  dialog.openAsync({ subtitle: "There" });
});

test("required props: open requires the props object", () => {
  const dialog = createOverlay<{ title: string }>(Dummy);

  expectTypeOf(dialog.open).parameter(0).toEqualTypeOf<{ title: string }>();
  expectTypeOf(dialog.openAsync).parameter(0).toEqualTypeOf<{ title: string }>();

  dialog.open({ title: "Hi" });
  dialog.openAsync({ title: "Hi" });

  // @ts-expect-error required props cannot be omitted
  dialog.open();
  // @ts-expect-error required props cannot be omitted
  dialog.openAsync();
  // @ts-expect-error empty object is missing title
  dialog.open({});
  // @ts-expect-error wrong prop type
  dialog.open({ title: 1 });
});

test("mixed required and optional props: only required keys are mandatory", () => {
  const dialog = createOverlay<{ id: string; title?: string }>(Dummy);

  dialog.open({ id: "1" });
  dialog.open({ id: "1", title: "Hi" });
  dialog.openAsync({ id: "1" });

  // @ts-expect-error required id cannot be omitted
  dialog.open();
  // @ts-expect-error required id cannot be omitted
  dialog.open({ title: "Hi" });
  // @ts-expect-error wrong id type
  dialog.open({ id: 1 });
});

test("optional props with a result generic still allow bare openAsync", () => {
  const dialog = createOverlay<{ message?: string }, boolean>(Dummy);

  expectTypeOf(dialog.openAsync()).resolves.toEqualTypeOf<boolean | undefined>();

  dialog.open();
  dialog.open({ message: "Sure?" });
  dialog.openAsync();
  dialog.openAsync({ message: "Sure?" });
});

test("required props with a result generic still require the props argument", () => {
  const dialog = createOverlay<{ message: string }, boolean>(Dummy);

  expectTypeOf(dialog.openAsync({ message: "Sure?" })).resolves.toEqualTypeOf<
    boolean | undefined
  >();

  // @ts-expect-error required message cannot be omitted
  dialog.openAsync();
});

test("CloseOptions only allows result and delay", () => {
  expectTypeOf<CloseOptions<boolean>>().toEqualTypeOf<{
    result?: boolean;
    delay?: number;
  }>();

  const props = null as unknown as OverlayProps<boolean>;
  props.close();
  props.close({ result: true });
  props.close({ delay: 0 });
  props.close({ result: false, delay: 100 });

  // @ts-expect-error unmount is not part of CloseOptions
  assertType(props.close({ unmount: false }));
});

test("package entry does not export OverlayManager", async () => {
  const cue = await import("./index.js");

  expectTypeOf(cue).not.toHaveProperty("OverlayManager");
  expectTypeOf(cue.createOverlay).toBeFunction();
  expectTypeOf(cue.OverlayProvider).toBeFunction();
});
