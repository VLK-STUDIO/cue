import { Children, isValidElement, type ReactNode } from "react";
import { Tab, Tabs } from "fumadocs-ui/components/tabs";

type DemoProps = {
  children: ReactNode;
};

export function DemoPreview({ children }: { children: ReactNode }) {
  return <div className="om-demo-preview">{children}</div>;
}

export function Demo({ children }: DemoProps) {
  const nodes = Children.toArray(children).filter((child) => {
    return typeof child !== "string" || child.trim().length > 0;
  });
  const preview = nodes.find((child) => isValidElement(child) && child.type === DemoPreview);
  const code = nodes.filter((child) => child !== preview);

  return (
    <Tabs items={["Preview", "Code"]} className="om-demo">
      <Tab value="Preview">{preview}</Tab>
      <Tab value="Code">
        <div className="om-demo-code">{code}</div>
      </Tab>
    </Tabs>
  );
}
