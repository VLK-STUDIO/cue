import { cue } from "./cue";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

export const welcomeDialog = cue.createOverlay((_props, ctx) => {
  const {
    content: Content,
    description: Description,
    footer: Footer,
    header: Header,
    title: Title,
  } = ctx.components;
  return (
    <Dialog open={ctx.open} onOpenChange={ctx.onOpenChange}>
      <Content>
        <Header>
          <Title>Hello</Title>
          <Description>
            Opened with <code>welcomeDialog.open()</code>. No local state.
          </Description>
        </Header>
        <Footer>
          <Button variant="outline" onClick={() => ctx.close()}>
            Close
          </Button>
        </Footer>
      </Content>
    </Dialog>
  );
});

export const settingsDialog = cue.createOverlay((_props, ctx) => {
  const {
    content: Content,
    description: Description,
    footer: Footer,
    header: Header,
    title: Title,
  } = ctx.components;

  return (
    <Dialog open={ctx.open} onOpenChange={ctx.onOpenChange}>
      <Content>
        <Header>
          <Title>Settings</Title>
          <Description>
            No extra props. Opened with <code>settingsDialog.open()</code>.
          </Description>
        </Header>
        <Footer>
          <Button variant="outline" onClick={() => ctx.close()}>
            Close
          </Button>
          <Button
            onClick={() =>
              confirmDeleteDialog.open({
                organizationName: "Atlas",
              })
            }
          >
            Delete Atlas…
          </Button>
        </Footer>
      </Content>
    </Dialog>
  );
});

export const confirmDeleteDialog = cue.createOverlay<{
  organizationName: string;
}>((props, ctx) => {
  const {
    content: Content,
    description: Description,
    footer: Footer,
    header: Header,
    title: Title,
  } = ctx.components;

  return (
    <Dialog open={ctx.open} onOpenChange={ctx.onOpenChange}>
      <Content>
        <Header>
          <Title>Delete {props.organizationName}?</Title>
          <Description>
            Typed props, stacked on top of Settings, closed from the overlay itself.
          </Description>
        </Header>
        <Footer>
          <Button variant="outline" onClick={() => ctx.close()}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={() => ctx.close()}>
            Delete
          </Button>
        </Footer>
      </Content>
    </Dialog>
  );
});

export const asyncConfirmDialog = cue.createOverlay<{ message: string }, boolean>((props, ctx) => {
  const {
    content: Content,
    description: Description,
    footer: Footer,
    header: Header,
    title: Title,
  } = ctx.components;

  return (
    <Dialog open={ctx.open} onOpenChange={ctx.onOpenChange}>
      <Content>
        <Header>
          <Title>Confirm</Title>
          <Description>{props.message}</Description>
        </Header>
        <Footer>
          <Button variant="outline" onClick={() => ctx.close({ result: false })}>
            Cancel
          </Button>
          <Button onClick={() => ctx.close({ result: true })}>Confirm</Button>
        </Footer>
      </Content>
    </Dialog>
  );
});
