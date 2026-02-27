/// <reference types="@raycast/api">

/* 🚧 🚧 🚧
 * This file is auto-generated from the extension's manifest.
 * Do not modify manually. Instead, update the `package.json` file.
 * 🚧 🚧 🚧 */

/* eslint-disable @typescript-eslint/ban-types */

type ExtensionPreferences = {
  /** Session Cookie - Your kagimail.com Cookie header (e.g. auth=abc123...). */
  "sessionCookie": string,
  /** Domains - Comma-separated list of domains for custom aliases. */
  "domains": string
}

/** Preferences accessible in all the extension's commands */
declare type Preferences = ExtensionPreferences

declare namespace Preferences {
  /** Preferences accessible in the `generate-random-alias` command */
  export type GenerateRandomAlias = ExtensionPreferences & {}
  /** Preferences accessible in the `create-custom-alias` command */
  export type CreateCustomAlias = ExtensionPreferences & {}
}

declare namespace Arguments {
  /** Arguments passed to the `generate-random-alias` command */
  export type GenerateRandomAlias = {}
  /** Arguments passed to the `create-custom-alias` command */
  export type CreateCustomAlias = {}
}

