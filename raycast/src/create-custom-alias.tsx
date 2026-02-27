import { Action, ActionPanel, Form, showHUD, Clipboard, showToast, Toast } from "@raycast/api";
import { createAlias, getDomains } from "./api";

export default function Command() {
  const domains = getDomains();

  async function handleSubmit(values: { name: string; domain: string; description: string }) {
    const name = values.name.trim();
    if (!name) {
      await showToast({ style: Toast.Style.Failure, title: "Alias name is required" });
      return;
    }

    try {
      await showToast({ style: Toast.Style.Animated, title: "Creating alias..." });
      await createAlias({ name, domain: values.domain, description: values.description.trim() });
      const address = `${name}@${values.domain}`;
      await Clipboard.copy(address);
      await showHUD(`Copied ${address}`);
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: "Failed",
        message: error instanceof Error ? error.message : String(error),
      });
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Create Alias" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.TextField id="name" title="Alias Name" placeholder="myalias" />
      <Form.Dropdown id="domain" title="Domain">
        {domains.map((d) => (
          <Form.Dropdown.Item key={d} value={d} title={d} />
        ))}
      </Form.Dropdown>
      <Form.TextField id="description" title="Description" placeholder="Optional" />
    </Form>
  );
}
