import { outro, spinner, stream, text } from "@clack/prompts";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import path from "path";
import { buildNewsletter, readPlatformDiff, saveDiffs } from "./build.js";
import {
  BLOCKS,
  PLATFORM_LIST,
  getNewsletterDirectory,
  getNewsletterPaths,
} from "./core.js";
import {
  promptBuildNewsletterSelection,
  promptDiffNewsletterDirectory,
  promptNewsletterMetadata,
  readNewsletterIndexMetadata,
} from "./prompts.js";
import { runWatchMode } from "./watch.js";

export const runCreate = async (): Promise<void> => {
  let name = await text({
    message: "What's the slug of this newsletter?",
    placeholder: "25-04-20-some-funny-name",
    validate: (value) => {
      if (!value) {
        return new Error("Please enter a slug");
      }
      if (value.trim().match(/\s/)) {
        return new Error("The slug cannot contain spaces");
      }
      return undefined;
    },
  });
  if (typeof name === "symbol") {
    throw new Error("Please enter a valid slug");
  }
  name = name.trim();

  const newsletterRoot = getNewsletterDirectory(name);
  if (existsSync(newsletterRoot)) {
    await stream.error(
      `Newsletter "${name}" already exists at ${newsletterRoot}. Aborting to avoid overwriting existing blocks.`,
    );
    process.exit(1);
  }

  mkdirSync(path.resolve(newsletterRoot, "_blocks"), {
    recursive: true,
  });

  let blockIndex = 0;
  for (const block of BLOCKS) {
    writeFileSync(
      path.resolve(
        newsletterRoot,
        `_blocks/${blockIndex.toString().padStart(2, "0")}-${block}.md`,
      ),
      "",
    );
    blockIndex++;
  }

  await outro(
    `Newsletter blocks created at ${path.resolve(newsletterRoot, "_blocks")}`,
  );
};

export const runBuildOrWatch = async (
  buildAction: "build" | "watch",
): Promise<void> => {
  const name = await promptBuildNewsletterSelection();
  const directory = getNewsletterDirectory(name);
  const { blocksDirectory, lastBuiltDir } = getNewsletterPaths(directory);

  const { originalTitle, originalTagline, originalCreatedAt } =
    readNewsletterIndexMetadata(directory);
  const { title, tagline } = await promptNewsletterMetadata(
    originalTitle,
    originalTagline,
  );

  const runBuild = async () =>
    buildNewsletter({
      directory,
      blocksDirectory,
      lastBuiltDir,
      title,
      tagline,
      originalTitle,
      originalTagline,
      originalCreatedAt,
    });

  const runSaveDiffs = async () =>
    saveDiffs({
      directory,
      lastBuiltDir,
    });

  const s = spinner();
  s.start("Building newsletter content...");
  await runBuild();
  s.stop(`Newsletter content created at ${name}`);
  await runSaveDiffs();

  if (buildAction == "watch") {
    await runWatchMode({
      name,
      directory,
      blocksDirectory,
      lastBuiltDir,
      s,
      runBuild,
      runSaveDiffs,
    });
  } else if (buildAction == "build") {
    await stream.info("Newsletter built at index.md");
  } else {
    throw Error("unknown action");
  }
};

export const runDiff = async (): Promise<void> => {
  const directory = await promptDiffNewsletterDirectory();
  const { lastBuiltDir } = getNewsletterPaths(directory);

  if (!existsSync(lastBuiltDir)) {
    await stream.error("No .last-built directory found. Run build first.");
    process.exit(1);
  }

  let hasDiffs = false;

  for (const platform of PLATFORM_LIST) {
    const result = readPlatformDiff({ directory, lastBuiltDir, platform });
    if (!result || !result.diff.trim()) {
      continue;
    }

    hasDiffs = true;
    console.log(`\n=== ${result.fileName} ===`);
    console.log(result.diff);
  }

  if (!hasDiffs) {
    await stream.info(
      "No differences found between current files and last build.",
    );
  }
};
