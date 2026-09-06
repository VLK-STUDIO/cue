import type { ReactNode } from "react";
import { DynamicCodeBlock } from "fumadocs-ui/components/dynamic-codeblock";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";

type DemoProps = {
  code: string;
  lang?: string;
  children: ReactNode;
};

export function Demo({ code, lang = "tsx", children }: DemoProps) {
  return (
    <Tabs items={["Preview", "Code"]} className="om-demo">
      <Tab value="Preview">
        <div className="om-demo-preview">{children}</div>
      </Tab>
      <Tab value="Code">
        <DynamicCodeBlock lang={lang} code={code.trim()} />
      </Tab>
    </Tabs>
  );
}
