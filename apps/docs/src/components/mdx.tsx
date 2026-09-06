import defaultMdxComponents from "fumadocs-ui/mdx";
import * as TabsComponents from "fumadocs-ui/components/tabs";
import type { MDXComponents } from "mdx/types";
import { Demo } from "./demo";
import {
  DefaultDemo,
  OpenAsyncDemo,
  StackingDemo,
  TypedPropsDemo,
  WelcomeDemo,
} from "./demos";

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    ...TabsComponents,
    Demo,
    DefaultDemo,
    TypedPropsDemo,
    StackingDemo,
    OpenAsyncDemo,
    WelcomeDemo,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
