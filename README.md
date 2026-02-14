# Kagi Mail Alias Creator

Browser extension for creating Kagi Mail aliases from the browser
toolbar.

## Prerequisites

You need to be logged in to [kagimail.com](https://kagimail.com) in
the same browser. The extension uses your existing session cookie for
auth, nothing is stored or handled separately.

## Install

### Chrome

1. Go to `chrome://extensions` and enable Developer mode
2. Click Load unpacked and select this folder

### Firefox

1. Go to `about:debugging#/runtime/this-firefox`
2. Click Load Temporary Add-on and pick `manifest.json`

## How it works

There's no public Kagi Mail API, so the extension calls the same
internal endpoints the web app uses. All requests go through the popup,
no background worker.

For random aliases on `kagimail.com`, it first fetches a server-signed
id/hash/name triplet from `/settings/aliases/random`, then POSTs that
to `/settings/aliases/add`.

For custom domain aliases it skips the random step and just POSTs
whatever name you typed along with your selected domain.

Available domains are pulled on popup open by parsing the select element
from `/settings/aliases/edit`.

## Disclaimer

This is an unofficial community project, not affiliated with or
endorsed by Kagi. It depends on internal endpoints that could change
at any time.
