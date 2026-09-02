// ────────────────────────────────────────────────────────────
// DO NOT EDIT — synced from FujoWebDev/contributors @ 305b05cffbce
// Source: contributors/_schema/projects/websites.ts
// Refresh: pnpm sync
// ────────────────────────────────────────────────────────────
import type { Chip } from "../chips.ts";

export const FUJOWEB_DEV_ROLES = {
  Coder: ["Coding"],
  "Copy Writer": ["Writing"],
  "Data Collector": ["Data Entry"],
  "Data Entry": ["Data Entry"],
  Maintainer: ["Coding"],
  "Web Mistress": ["PM"],
} as const satisfies Record<string, readonly Chip[]>;

// This is unused right now
export const FUJOCODED_COM_ROLES = {
  Coder: ["Coding"],
  "Copy Writer": ["Writing"],
  "Data Collector": ["Data Entry"],
  "Data Entry": ["Data Entry"],
  Maintainer: ["Coding"],
  "Web Mistress": ["PM"],
} as const satisfies Record<string, readonly Chip[]>;
