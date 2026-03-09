import { stream } from "@clack/prompts";
import { execSync } from "child_process";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import path from "path";
import {
  BLOCKS,
  CONTENT_BLOCKS,
  PLATFORM_LIST,
  PREAMBLES,
  getPlatformFileName,
  hasConflictMarkers,
  threeWayMerge,
  type BuildNewsletterOptions,
  type NewsletterPaths,
  type Platform,
} from "./core.js";

export const readPlatformDiff = ({
  directory,
  lastBuiltDir,
  platform,
}: Pick<NewsletterPaths, "directory" | "lastBuiltDir"> & {
  platform: Platform;
}): { fileName: string; diff: string } | null => {
  const fileName = getPlatformFileName(platform);
  const currentPath = path.resolve(directory, fileName);
  const baselinePath = path.resolve(lastBuiltDir, fileName);

  if (!existsSync(currentPath) || !existsSync(baselinePath)) {
    return null;
  }

  const diff = execSync(`diff -u "${baselinePath}" "${currentPath}" || true`, {
    encoding: "utf-8",
  });

  return { fileName, diff };
};

export const saveDiffs = async ({
  directory,
  lastBuiltDir,
}: Pick<NewsletterPaths, "directory" | "lastBuiltDir">): Promise<void> => {
  const patchDir = path.resolve(lastBuiltDir, ".patches");
  mkdirSync(patchDir, { recursive: true });

  const savedFiles: string[] = [];

  for (const platform of PLATFORM_LIST) {
    const fileName = getPlatformFileName(platform);
    const patchPath = path.resolve(patchDir, `${fileName}.patch`);
    const result = readPlatformDiff({ directory, lastBuiltDir, platform });
    const diff = result?.diff ?? "";

    if (diff.trim()) {
      const patchContent = diff.endsWith("\n") ? diff : `${diff}\n`;
      writeFileSync(patchPath, patchContent);
      savedFiles.push(fileName);
    } else {
      rmSync(patchPath, { force: true });
    }
  }

  if (savedFiles.length > 0) {
    await stream.info(`Diffs saved: ${savedFiles.join(", ")}`);
  }
};

export const buildNewsletter = async ({
  directory,
  blocksDirectory,
  lastBuiltDir,
  title,
  tagline,
  originalTitle,
  originalTagline,
  originalCreatedAt,
}: BuildNewsletterOptions): Promise<void> => {
  mkdirSync(lastBuiltDir, { recursive: true });
  const statusFile = path.resolve(lastBuiltDir, ".status.json");
  const previousStatus: Record<string, string> = existsSync(statusFile)
    ? JSON.parse(readFileSync(statusFile, "utf-8"))
    : {};
  const currentStatus: Record<string, string> = {};

  const blocksContent = BLOCKS.reduce(
    (acc, block, index) => {
      const blockPath = path.resolve(
        blocksDirectory,
        `${index.toString().padStart(2, "0")}-${block}.md`,
      );
      acc[block] = existsSync(blockPath)
        ? readFileSync(blockPath, "utf-8").replaceAll("../images/", "./images/")
        : "";
      return acc;
    },
    {} as Record<string, string>,
  );

  for (const [contentType, blocks] of Object.entries(CONTENT_BLOCKS)) {
    const content = blocks
      .map((block) => blocksContent[block])
      .filter((c) => c.trim())
      .join("\n\n");
    const fileName =
      `${contentType == "index" ? contentType : `_${contentType}`}.md`;
    const filePath = path.resolve(directory, fileName);
    const lastBuiltPath = path.resolve(lastBuiltDir, fileName);

    const warning = `<!-- ⚠️ AUTO-GENERATED — edit _blocks/ instead ⚠️ -->\n\n`;
    const newContent =
      PREAMBLES[contentType as keyof typeof PREAMBLES](
        title ?? originalTitle ?? "Newsletter",
        originalCreatedAt ?? new Date().toISOString(),
        tagline ?? originalTagline ?? "TODO",
      ) + warning + content;

    let finalContent = newContent;

    const prevFileStatus = previousStatus[fileName];
    const checkStatusChange = (newStatus: string) => {
      currentStatus[fileName] = newStatus;
      if (prevFileStatus && prevFileStatus !== newStatus) {
        return `${prevFileStatus} → ${newStatus}`;
      }
      return null;
    };

    if (existsSync(filePath) && existsSync(lastBuiltPath)) {
      const currentContent = readFileSync(filePath, "utf-8");
      const lastBuiltContent = readFileSync(lastBuiltPath, "utf-8");

      if (currentContent !== lastBuiltContent) {
        if (hasConflictMarkers(currentContent)) {
          checkStatusChange("conflict");
          await stream.warn(
            `Unresolved conflicts in ${fileName} - resolve before next build`,
          );
          continue;
        }

        const { merged, hasConflicts } = threeWayMerge(
          currentContent,
          lastBuiltContent,
          newContent,
        );
        finalContent = merged;

        if (hasConflicts) {
          checkStatusChange("conflict");
          await stream.warn(
            `Merge conflicts in ${fileName} - resolve manually`,
          );
        } else {
          const change = checkStatusChange("edited");
          const msg = change
            ? `${fileName}: ${change}`
            : `Preserved manual edits in ${fileName}`;
          await stream.info(msg);
        }
      } else {
        const change = checkStatusChange("clean");
        if (change) {
          await stream.info(`${fileName}: ${change}`);
        }
      }
    } else {
      checkStatusChange("clean");
    }

    if (existsSync(filePath)) {
      execSync(`chmod +w "${filePath}"`);
    }
    writeFileSync(filePath, finalContent);
    execSync(`chmod -w "${filePath}"`);
    writeFileSync(lastBuiltPath, newContent);
  }

  const summary = Object.entries(currentStatus)
    .map(([file, status]) => {
      const prev = previousStatus[file];
      const changed = prev && prev !== status ? ` (was: ${prev})` : "";
      return `  ${file}: ${status}${changed}`;
    })
    .join("\n");
  await stream.info(`Build summary:\n${summary}`);

  writeFileSync(statusFile, JSON.stringify(currentStatus, null, 2));
};
