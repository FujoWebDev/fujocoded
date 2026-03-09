import { stream } from "@clack/prompts";
import { execSync, spawn } from "child_process";
import { existsSync, watch } from "fs";
import path from "path";
import * as readline from "readline";
import {
  CONTENT_BLOCKS,
  getEditorCommand,
  type PlatformKeyMap,
} from "./core.js";

type SpinnerLike = {
  start: (message: string) => void;
  stop: (message?: string) => void;
};

type WatchKeyboardShortcutsOptions = {
  directory: string;
  lastBuiltDir: string;
  platformKeys: PlatformKeyMap;
};

type WatchBuildSchedulerOptions = {
  s: SpinnerLike;
  name: string;
  keyHints: string;
  runBuild: () => Promise<void>;
  runSaveDiffs: () => Promise<void>;
};

type WatchModeOptions = {
  name: string;
  directory: string;
  blocksDirectory: string;
  lastBuiltDir: string;
  s: SpinnerLike;
  runBuild: () => Promise<void>;
  runSaveDiffs: () => Promise<void>;
};

const createPlatformKeyMap = (): PlatformKeyMap => {
  const platformKeys: PlatformKeyMap = {};
  const usedKeys = new Set<string>();

  for (const platform of Object.keys(CONTENT_BLOCKS)) {
    for (const char of platform) {
      const key = char.toLowerCase();
      if (!usedKeys.has(key)) {
        platformKeys[key] = platform;
        usedKeys.add(key);
        break;
      }
    }
  }

  return platformKeys;
};

const formatPlatformKeyHints = (platformKeys: PlatformKeyMap): string =>
  Object.entries(platformKeys)
    .map(([key, platform]) => {
      const idx = platform.toLowerCase().indexOf(key);
      return `${platform.slice(0, idx)}[${key}]${platform.slice(idx + 1)}`;
    })
    .join(" ");

const openComparison = (
  directory: string,
  lastBuiltDir: string,
  platform: string,
): void => {
  const fileName = platform === "index" ? "index.md" : `_${platform}.md`;
  const currentPath = path.resolve(directory, fileName);
  const baselinePath = path.resolve(lastBuiltDir, fileName);

  if (!existsSync(currentPath) || !existsSync(baselinePath)) {
    console.log(`\nNo files to compare for ${platform}`);
    return;
  }

  const editor = getEditorCommand();
  console.log(`\nOpening ${fileName} comparison in ${editor.cmd}...`);
  spawn(editor.cmd, [...editor.args, "--diff", baselinePath, currentPath], {
    detached: true,
    stdio: "inherit",
  });
};

const unlockFile = (directory: string, platform: string): void => {
  const fileName = platform === "index" ? "index.md" : `_${platform}.md`;
  const filePath = path.resolve(directory, fileName);

  if (!existsSync(filePath)) {
    console.log(`\nNo file found for ${platform}`);
    return;
  }

  execSync(`chmod +w "${filePath}"`);
  console.log(`\nUnlocked ${fileName} for editing`);
};

const isLastBuiltEvent = (filename: string | Buffer | null): boolean => {
  if (!filename) return false;
  const normalized = filename.toString().replace(/\\/g, "/");
  return normalized === ".last-built" || normalized.startsWith(".last-built/");
};

const setupWatchKeyboardShortcuts = ({
  directory,
  lastBuiltDir,
  platformKeys,
}: WatchKeyboardShortcutsOptions): void => {
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
    process.stdin.resume();
  }

  process.stdin.on("keypress", (str, key) => {
    if (key?.ctrl && key?.name === "c") {
      process.exit();
    }
    if (str) {
      const isUpper = str === str.toUpperCase() && str !== str.toLowerCase();
      const platform = platformKeys[str.toLowerCase()];
      if (platform) {
        if (isUpper) {
          unlockFile(directory, platform);
        } else {
          openComparison(directory, lastBuiltDir, platform);
        }
      }
    }
  });
};

const createWatchBuildScheduler = ({
  s,
  name,
  keyHints,
  runBuild,
  runSaveDiffs,
}: WatchBuildSchedulerOptions): (() => void) => {
  let rebuildInProgress = false;
  let rebuildQueued = false;
  let rebuildTimer: NodeJS.Timeout | undefined;

  const runWatchBuild = async () => {
    if (rebuildInProgress) {
      rebuildQueued = true;
      return;
    }

    rebuildInProgress = true;
    try {
      do {
        rebuildQueued = false;
        s.start("Rebuilding newsletter content...");
        try {
          await runBuild();
          s.stop(`Newsletter content updated at ${name}`);
          await runSaveDiffs();
          console.log(`Compare: ${keyHints} | Unlock: Shift+key`);
        } catch (error) {
          s.stop("Newsletter rebuild failed");
          throw error;
        }
      } while (rebuildQueued);
    } finally {
      rebuildInProgress = false;
    }
  };

  return () => {
    if (rebuildTimer) {
      clearTimeout(rebuildTimer);
    }
    rebuildTimer = setTimeout(() => {
      rebuildTimer = undefined;
      void runWatchBuild().catch(async (error) => {
        await stream.error(
          error instanceof Error ? error.message : "Unknown rebuild error",
        );
      });
    }, 150);
  };
};

export const runWatchMode = async ({
  name,
  directory,
  blocksDirectory,
  lastBuiltDir,
  s,
  runBuild,
  runSaveDiffs,
}: WatchModeOptions): Promise<void> => {
  const platformKeys = createPlatformKeyMap();
  const keyHints = formatPlatformKeyHints(platformKeys);

  await stream.info([
    "Now watching newsletter content...",
    `Find the blocks to edit at ${blocksDirectory}`,
    "",
    `Compare: ${keyHints} | Unlock: Shift+key`,
  ]);

  setupWatchKeyboardShortcuts({
    directory,
    lastBuiltDir,
    platformKeys,
  });

  const scheduleWatchBuild = createWatchBuildScheduler({
    s,
    name,
    keyHints,
    runBuild,
    runSaveDiffs,
  });

  watch(blocksDirectory, (_eventType, filename) => {
    if (isLastBuiltEvent(filename)) {
      return;
    }
    scheduleWatchBuild();
  });
};
