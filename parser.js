export function parseRandomAliasHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString("<div>" + html + "</div>", "text/html");
  const container = doc.body.firstElementChild;

  const id = container.querySelector('input[name="id"]')?.value || "";
  const hash = container.querySelector('input[name="hash"]')?.value || "";

  const clone = container.cloneNode(true);
  clone.querySelectorAll("input").forEach((el) => el.remove());
  const name = clone.textContent.trim();

  return { id, hash, name };
}

export function parseDomainsFromHTML(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const select = doc.querySelector('select[name="domain"]');
  if (!select) return ["kagimail.com"];
  return [...select.options].map((opt) => opt.value);
}
