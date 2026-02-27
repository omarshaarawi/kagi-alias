import { getPreferenceValues } from "@raycast/api";

const BASE = "https://kagimail.com";

interface Preferences {
  sessionCookie: string;
  domains: string;
}

function cookieHeaders(): Record<string, string> {
  const { sessionCookie } = getPreferenceValues<Preferences>();
  return {
    Accept: "text/plain",
    "X-Kagi-No-Redirect": "true",
    Cookie: sessionCookie,
  };
}

function parseRandomAliasHTML(html: string): { id: string; hash: string; name: string } {
  const idMatch = html.match(/name="id"\s+value="([^"]*)"/);
  const hashMatch = html.match(/name="hash"\s+value="([^"]*)"/);
  const name = html.replace(/<input[^>]*>/g, "").replace(/<[^>]*>/g, "").trim();
  return {
    id: idMatch?.[1] ?? "",
    hash: hashMatch?.[1] ?? "",
    name,
  };
}

export function getDomains(): string[] {
  const { domains } = getPreferenceValues<Preferences>();
  const parsed = domains
    .split(",")
    .map((d) => d.trim())
    .filter(Boolean);
  return parsed.length > 0 ? parsed : ["kagimail.com"];
}

export async function getRandomAlias(): Promise<{ id: string; hash: string; name: string }> {
  const res = await fetch(`${BASE}/settings/aliases/random`, {
    headers: cookieHeaders(),
  });
  if (!res.ok) throw new Error("Failed to generate random alias");
  return parseRandomAliasHTML(await res.text());
}

interface CreateAliasOptions {
  id?: string;
  hash?: string;
  name?: string;
  domain: string;
  description?: string;
}

export async function createAlias(opts: CreateAliasOptions): Promise<void> {
  const body = new URLSearchParams({
    id: opts.id ?? "",
    hash: opts.hash ?? "",
    name: opts.name ?? "",
    domain: opts.domain,
    outgoingName: "",
    description: opts.description ?? "",
    signature: "",
  });

  const res = await fetch(`${BASE}/settings/aliases/add`, {
    method: "POST",
    headers: cookieHeaders(),
    body,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to create alias");
  }
}
