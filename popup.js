import { getDomains, getRandomAlias, createAlias } from "./api.js";

const $ = (sel) => document.querySelector(sel);

const recentAliases = [];

function show(el) {
  el.classList.remove("hidden");
}
function hide(el) {
  el.classList.add("hidden");
}

function setLoading(on) {
  on ? show($("#loading")) : hide($("#loading"));
}

function showError(msg) {
  const el = $("#error");
  el.textContent = msg;
  show(el);
}

function clearError() {
  hide($("#error"));
}

function showResult(address) {
  $("#result-alias").textContent = "\u2713 " + address + " \u2014 Copied to clipboard";
  show($("#result"));

  const copyBtn = $("#btn-copy");
  copyBtn.textContent = "Copied!";
  setTimeout(() => {
    copyBtn.textContent = "Copy";
  }, 2000);
}

async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text);
}

function addToRecent(address) {
  recentAliases.unshift(address);
  renderRecent();
}

function renderRecent() {
  const section = $("#recent-section");
  const list = $("#recent-list");

  if (recentAliases.length === 0) {
    hide(section);
    return;
  }

  show(section);
  list.innerHTML = "";

  for (const addr of recentAliases) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = addr;

    const btn = document.createElement("button");
    btn.textContent = "Copy";
    btn.type = "button";
    btn.addEventListener("click", async () => {
      await copyToClipboard(addr);
      btn.textContent = "Copied!";
      setTimeout(() => {
        btn.textContent = "Copy";
      }, 1500);
    });

    li.append(span, btn);
    list.appendChild(li);
  }
}

function setButtonsDisabled(disabled) {
  $("#btn-random").disabled = disabled;
  $("#btn-custom").disabled = disabled;
}

async function handleRandomAlias() {
  clearError();
  hide($("#result"));
  setLoading(true);
  setButtonsDisabled(true);

  try {
    const { id, hash, name } = await getRandomAlias();
    const domain = "kagimail.com";
    await createAlias({ id, hash, name: "", domain });
    const address = `${name}@${domain}`;
    await copyToClipboard(address);
    showResult(address);
    addToRecent(address);
  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
    setButtonsDisabled(false);
  }
}

async function handleCustomAlias() {
  clearError();
  hide($("#result"));

  const name = $("#custom-name").value.trim();
  const domain = $("#custom-domain").value;
  const description = $("#custom-description").value.trim();

  if (!name) {
    showError("Alias name cannot be empty.");
    return;
  }

  setLoading(true);
  setButtonsDisabled(true);

  try {
    await createAlias({ id: "", hash: "", name, domain, description });
    const address = `${name}@${domain}`;
    await copyToClipboard(address);
    showResult(address);
    addToRecent(address);
    $("#custom-name").value = "";
    $("#custom-description").value = "";
  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
    setButtonsDisabled(false);
  }
}

async function init() {
  try {
    const domains = await getDomains();

    const select = $("#custom-domain");
    select.innerHTML = "";
    for (const d of domains) {
      const opt = document.createElement("option");
      opt.value = d;
      opt.textContent = d;
      select.appendChild(opt);
    }

    select.disabled = false;
    $(".select-wrapper").classList.remove("loading");
    $("#btn-custom").disabled = false;
  } catch {
    hide($("#main"));
    show($("#auth-error"));
  }
}

$("#btn-random").addEventListener("click", handleRandomAlias);
$("#btn-custom").addEventListener("click", handleCustomAlias);
$("#btn-copy").addEventListener("click", async () => {
  const text = $("#result-alias").textContent
    .replace(/^\u2713\s*/, "")
    .replace(/\s*\u2014.*$/, "");
  await copyToClipboard(text);
  $("#btn-copy").textContent = "Copied!";
  setTimeout(() => {
    $("#btn-copy").textContent = "Copy";
  }, 1500);
});

init();
