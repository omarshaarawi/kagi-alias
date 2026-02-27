import { showHUD, Clipboard, showToast, Toast } from "@raycast/api";
import { getRandomAlias, createAlias } from "./api";

export default async function Command() {
  try {
    await showToast({ style: Toast.Style.Animated, title: "Generating alias..." });
    const { id, hash, name } = await getRandomAlias();
    await createAlias({ id, hash, name: "", domain: "kagimail.com" });
    const address = `${name}@kagimail.com`;
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
