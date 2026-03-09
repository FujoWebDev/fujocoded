import { merge } from "node-diff3";
import path from "path";

export const NEWSLETTERS_ROOT = "src/content/updates";
export const BLOCKS = [
  "intro",
  "fujocoded",
  "fujocoded-backerkit",
  "fujoguide",
  "fujoverse",
  "store",
  "hiring",
  "outro",
] as const;

export const CONTENT_BLOCKS = {
  index: [
    "intro",
    "fujocoded",
    "fujocoded-backerkit",
    "fujoguide",
    "fujoverse",
    "store",
    "hiring",
    "outro",
  ],
  buttondown: [
    "intro",
    "fujocoded",
    "fujocoded-backerkit",
    "fujoguide",
    "fujoverse",
    "store",
    "hiring",
    "outro",
  ],
  backerkit: [
    "intro",
    "fujocoded",
    "fujocoded-backerkit",
    "fujoverse",
    "store",
    "hiring",
    "outro",
  ],
  kickstarter: [
    "intro",
    "fujocoded",
    "fujoguide",
    "fujoverse",
    "store",
    "hiring",
    "outro",
  ],
} as const satisfies Record<string, (typeof BLOCKS)[number][]>;
export type PLATFORMS = keyof typeof CONTENT_BLOCKS;

export const PREAMBLES = {
  index: (title: string, createdAt: string, tagline: string | undefined) =>
    `---\ntitle: "${title}"\ntagline: "${tagline ?? "TBD"}"\ncreated_at: ${createdAt}\ntags:\n  - newsletter\nsocials: []\n---\n\n`,
  backerkit: (
    title: string,
    _createdAt: string,
    _tagline: string | undefined,
  ) => `---\ntitle: "${title}"\n---\n\n`,
  kickstarter: (
    title: string,
    _createdAt: string,
    _tagline: string | undefined,
  ) => `---\ntitle: "${title}"\n---\n\n`,
  buttondown: (
    title: string,
    _createdAt: string,
    _tagline: string | undefined,
  ) => `---\ntitle: "${title}"\n---\n\n`,
} as const satisfies Record<PLATFORMS, any>;

export const PLATFORM_LIST = [
  "index",
  "backerkit",
  "buttondown",
  "kickstarter",
] as const;
export type Platform = (typeof PLATFORM_LIST)[number];
export type PromptOption = { value: string; label: string };
export type PlatformKeyMap = Record<string, string>;

export type NewsletterPaths = {
  directory: string;
  blocksDirectory: string;
  lastBuiltDir: string;
};

export type ExistingNewsletterMetadata = {
  originalTitle: string | undefined;
  originalTagline: string | undefined;
  originalCreatedAt: string | undefined;
};

export type NewsletterPromptMetadata = {
  title: string | undefined;
  tagline: string | undefined;
};

export type BuildNewsletterOptions = NewsletterPaths &
  ExistingNewsletterMetadata &
  NewsletterPromptMetadata;

export const parseShellWords = (input: string): string[] => {
  const matches = input.match(/"[^"]*"|'[^']*'|\S+/g) ?? [];
  return matches.map((part) => {
    if (
      (part.startsWith('"') && part.endsWith('"')) ||
      (part.startsWith("'") && part.endsWith("'"))
    ) {
      return part.slice(1, -1);
    }
    return part;
  });
};

export const getEditorCommand = (): { cmd: string; args: string[] } => {
  const raw = (process.env.EDITOR || "code").trim();
  const parts = parseShellWords(raw);
  return {
    cmd: parts[0] || "code",
    args: parts.slice(1),
  };
};

export const throwIfSymbol = (
  text: Symbol | string | undefined,
  error?: Error,
): string | undefined => {
  if (typeof text === "symbol") {
    throw error || new Error(`unexpected symbol: ${String(text)}`);
  }

  return text as string | undefined;
};

export const hasConflictMarkers = (content: string): boolean =>
  /^<{7} |^={7}$|^>{7} /m.test(content);

export const threeWayMerge = (
  current: string,
  base: string,
  updated: string,
): { merged: string; hasConflicts: boolean } => {
  const result = merge(
    current.split("\n"),
    base.split("\n"),
    updated.split("\n"),
  );
  return {
    merged: result.result.join("\n"),
    hasConflicts: result.conflict,
  };
};

export const getNewslettersRootDirectory = (): string =>
  path.resolve(process.cwd(), "..", NEWSLETTERS_ROOT);

export const getNewsletterDirectory = (slugOrPath: string): string =>
  path.resolve(getNewslettersRootDirectory(), slugOrPath);

export const getNewsletterPaths = (directory: string): NewsletterPaths => ({
  directory,
  blocksDirectory: path.resolve(directory, "_blocks"),
  lastBuiltDir: path.resolve(directory, "_blocks", ".last-built"),
});

export const getPlatformFileName = (platform: Platform): string =>
  platform === "index" ? "index.md" : `_${platform}.md`;
