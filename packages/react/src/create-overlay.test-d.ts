import { createElement, type ComponentProps, type ReactNode } from "react";
import { expectTypeOf, test } from "vitest";
import {
  createCue,
  type CloseOptions,
  type CueBackdropCloseOptions,
  type CueOptions,
  type OverlayDefinitionOptions,
  type OverlayHandle,
  type OverlayProviderProps,
} from "./index.js";

function Wrapper({ children }: { children?: ReactNode }) {
  return createElement("div", null, children);
}

function Footer({ children }: { children?: ReactNode }) {
  return createElement("footer", null, children);
}

test("createCue infers the exact application component map", () => {
  const cue = createCue({ components: { wrapper: Wrapper, footer: Footer } });

  cue.createOverlay<{ message: string }, boolean>((props, context) => {
    expectTypeOf(props).toEqualTypeOf<{ message: string }>();
    expectTypeOf(context.components.wrapper).toEqualTypeOf<typeof Wrapper>();
    expectTypeOf(context.components.footer).toEqualTypeOf<typeof Footer>();

    // @ts-expect-error ordinary components are application-defined
    void context.components.header;

    return null;
  });
});

test("backdrop receives open and a strategy-based close callback", () => {
  createCue({
    backdrop: ({ open, close }) => {
      expectTypeOf(open).toBeBoolean();
      expectTypeOf(close).toEqualTypeOf<(options: CueBackdropCloseOptions) => void>();

      return null;
    },
  });
});

test("createCue accepts delay next to backdrop and components", () => {
  expectTypeOf<CueOptions>().toMatchTypeOf<{
    delay?: number;
    backdrop?: CueOptions["backdrop"];
    components?: CueOptions["components"];
  }>();
});

test("createOverlay accepts a definition-level backdrop override", () => {
  const cue = createCue();

  cue.createOverlay(() => null, { backdrop: false });
  cue.createOverlay(() => null, {
    backdrop: ({ open, close }) => {
      expectTypeOf(open).toBeBoolean();
      void close;
      return null;
    },
  });

  expectTypeOf<OverlayDefinitionOptions>().toMatchTypeOf<{
    backdrop?: false | CueOptions["backdrop"];
  }>();
});

test("context keeps runtime values out of application props", () => {
  const cue = createCue();

  cue.createOverlay<{ message: string }>((props, context) => {
    expectTypeOf(props).toEqualTypeOf<{ message: string }>();
    expectTypeOf(context.open).toBeBoolean();
    expectTypeOf(context.onOpenChange).toEqualTypeOf<(isOpen: boolean) => void>();
    expectTypeOf(context.close).toEqualTypeOf<(options?: CloseOptions<undefined>) => void>();

    // @ts-expect-error Cue runtime values are not application props
    void props.close;

    return null;
  });
});

test("no props and all-optional props allow bare open and openAsync", () => {
  const cue = createCue();
  const noProps = cue.createOverlay(() => null);
  const optionalProps = cue.createOverlay<{ title?: string }>(() => null);

  expectTypeOf(noProps.open).toBeCallableWith();
  expectTypeOf(noProps.openAsync).toBeCallableWith();
  expectTypeOf(optionalProps.open).toBeCallableWith();
  expectTypeOf(optionalProps.open).toBeCallableWith({ title: "Hello" });
  expectTypeOf(optionalProps.openAsync).toBeCallableWith();
  expectTypeOf(optionalProps.openAsync).toBeCallableWith({ title: "Hello" });
});

test("required props remain required for open and openAsync", () => {
  const cue = createCue();
  const dialog = cue.createOverlay<{ title: string }, boolean>(() => null);

  dialog.open({ title: "Hello" });
  dialog.openAsync({ title: "Hello" });

  // @ts-expect-error required props cannot be omitted
  dialog.open();
  // @ts-expect-error required props cannot be omitted
  dialog.openAsync();
  // @ts-expect-error required props cannot be omitted
  dialog.open({});
});

test("result types flow through openAsync, context close, and open's close", () => {
  const cue = createCue();
  const dialog = cue.createOverlay<{}, boolean>((_props, context) => {
    expectTypeOf(context.close).toEqualTypeOf<(options?: CloseOptions<boolean>) => void>();

    context.close({ result: true });
    // @ts-expect-error result must be boolean
    context.close({ result: "yes" });

    return null;
  });

  expectTypeOf(dialog.open()).toEqualTypeOf<(options?: CloseOptions<boolean>) => void>();
  expectTypeOf(dialog.openAsync()).resolves.toEqualTypeOf<boolean | undefined>();
  expectTypeOf<OverlayHandle<{}, boolean>["open"]>().toMatchTypeOf<typeof dialog.open>();
});

test("provider exposes children and an optional portal container", () => {
  const cue = createCue({ components: { footer: Footer } });
  const Provider = cue.OverlayProvider;

  expectTypeOf<ComponentProps<typeof Provider>>().toEqualTypeOf<OverlayProviderProps>();
  expectTypeOf<OverlayProviderProps>().toMatchTypeOf<{
    children?: ReactNode;
    container?: Element | DocumentFragment;
  }>();
});

test("the package entry exposes only createCue as the creation root", async () => {
  const cue = await import("./index.js");

  expectTypeOf(cue.createCue).toBeFunction();
  expectTypeOf(cue).not.toHaveProperty("createOverlay");
  expectTypeOf(cue).not.toHaveProperty("OverlayProvider");
  expectTypeOf(cue).not.toHaveProperty("OverlayManager");
});
