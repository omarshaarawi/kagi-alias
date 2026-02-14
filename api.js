import { parseRandomAliasHTML, parseDomainsFromHTML } from "./parser.js";

const BASE = "https://kagimail.com";
const HEADERS = {
  Accept: "text/plain",
  "X-Kagi-No-Redirect": "true",
};

export async function getRandomAlias() {
  const res = await fetch(BASE + "/settings/aliases/random", {
    method: "GET",
    headers: HEADERS,
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to generate random alias");
  const html = await res.text();
  return parseRandomAliasHTML(html);
}

export async function createAlias(opts) {
  const fd = new FormData();
  fd.set("id", opts.id || "");
  fd.set("hash", opts.hash || "");
  fd.set("name", opts.name || "");
  fd.set("domain", opts.domain);
  fd.set("outgoingName", opts.outgoingName || "");
  fd.set("description", opts.description || "");
  fd.set("signature", opts.signature || "");

  const res = await fetch(BASE + "/settings/aliases/add", {
    method: "POST",
    headers: HEADERS,
    credentials: "include",
    body: fd,
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "Failed to create alias");
  }
}

export async function enableAlias(address) {
  const res = await fetch(BASE + "/settings/aliases/enable", {
    method: "POST",
    headers: HEADERS,
    credentials: "include",
    body: new URLSearchParams({ address }),
  });
  if (!res.ok) throw new Error((await res.text()) || "Failed to enable alias");
}

export async function disableAlias(address) {
  const res = await fetch(BASE + "/settings/aliases/disable", {
    method: "POST",
    headers: HEADERS,
    credentials: "include",
    body: new URLSearchParams({ address }),
  });
  if (!res.ok)
    throw new Error((await res.text()) || "Failed to disable alias");
}

export async function deleteAlias(address) {
  const res = await fetch(BASE + "/settings/aliases/delete", {
    method: "POST",
    headers: HEADERS,
    credentials: "include",
    body: new URLSearchParams({ address }),
  });
  if (!res.ok) throw new Error((await res.text()) || "Failed to delete alias");
}

export async function getDomains() {
  const res = await fetch(BASE + "/settings/aliases/edit", {
    method: "GET",
    headers: { Accept: "text/html" },
    credentials: "include",
  });
  if (!res.ok) throw new Error("Not logged in to Kagi Mail");
  const html = await res.text();
  return parseDomainsFromHTML(html);
}
