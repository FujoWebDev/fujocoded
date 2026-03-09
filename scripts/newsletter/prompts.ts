import { select, stream, text } from "@clack/prompts";
import { existsSync, readFileSync, readdirSync, statSync } from "fs";
import path from "path";
import {
  getNewsletterDirectory,
  getNewslettersRootDirectory,
  throwIfSymbol,
  type ExistingNewsletterMetadata,
  type NewsletterPromptMetadata,
  type PromptOption,
} from "./core.js";

export const getRecentNewsletterOptions = (limit: number): PromptOption[] => {
  const lastUpdates = readdirSync(getNewslettersRootDirectory(), {
    withFileTypes: true,
  })
    .filter((d) => d.isDirectory())
    .map((d) => ({
      ...d,
      ...statSync(path.resolve(d.parentPath, d.name)),
    }))
    .sort((a, b) => b.birthtimeMs - a.birthtimeMs);

  return lastUpdates.slice(0, limit).map((u) => ({
    value: path.resolve(u.parentPath, u.name),
    label: u.name,
  }));
};

export const readNewsletterIndexMetadata = (
  directory: string,
): ExistingNewsletterMetadata => {
  const indexPath = path.resolve(directory, "index.md");
  const fileContent = existsSync(indexPath)
    ? readFileSync(indexPath, "utf-8")
    : "";

  return {
    originalTitle: fileContent.match(/title: "([^"]+)"/)?.[1],
    originalTagline: fileContent.match(/tagline: "([^"]+)"/)?.[1],
    originalCreatedAt: fileContent.match(/created_at: ([^\n]+)/)?.[1],
  };
};

export const promptNewsletterMetadata = async (
  originalTitle: string | undefined,
  originalTagline: string | undefined,
): Promise<NewsletterPromptMetadata> => {
  const title = throwIfSymbol(
    await text({
      message: "What is the newsletter title? (empty for previous)",
      placeholder: originalTitle ?? "Fujocoded Newsletter",
      validate: (value) => {
        if (!originalTitle && !value) {
          return new Error("You need a title");
        }
      },
    }),
    new Error("Please enter a valid title"),
  );

  const tagline = throwIfSymbol(
    await text({
      message: "What is the newsletter tagline? (empty for previous)",
      placeholder: originalTagline ?? "TODO",
    }),
    new Error("Please enter a valid tagline"),
  );

  return { title, tagline };
};

export const promptBuildNewsletterSelection = async (): Promise<string> => {
  const options = getRecentNewsletterOptions(3);
  const A_NEW_ONE = "A_NEW_ONE";

  let name = await select({
    message: "Which newsletter do you want to build?",
    options: [
      ...options,
      { value: "", label: "Another one" },
      { value: A_NEW_ONE, label: "A new one" },
    ],
  });

  if (typeof name === "symbol") {
    throw new Error("Please enter a valid path");
  }
  if (name === A_NEW_ONE) {
    await stream.error(`You should use the "create" command then :P`);
    process.exit();
  }
  if (name === "") {
    name = await text({
      message: "What's the newsletter slug?",
      placeholder: "25-04-20-an-existing-name",
    });
  }
  if (typeof name === "symbol") {
    throw new Error("Please enter a valid path");
  }

  return name;
};

export const promptDiffNewsletterDirectory = async (): Promise<string> => {
  const options = getRecentNewsletterOptions(3);

  let name = await select({
    message: "Which newsletter do you want to diff?",
    options: [...options, { value: "", label: "Another one" }],
  });

  if (typeof name === "symbol") {
    throw new Error("Please select a newsletter");
  }
  if (name === "") {
    name = throwIfSymbol(
      await text({
        message: "What's the newsletter slug?",
        placeholder: "25-04-20-an-existing-name",
      }),
      new Error("Please enter a valid slug"),
    ) as string;
    name = getNewsletterDirectory(name);
  }

  return name;
};
