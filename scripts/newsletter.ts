import { text, outro, spinner, select, stream } from "@clack/prompts";
import { Command } from "@commander-js/extra-typings";
import {
  existsSync,
  writeFileSync,
  statSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  watch,
} from "fs";
import path from "path";
const program = new Command();

const NEWSLETTERS_ROOT = "src/content/updates";
const BLOCKS = [
  "intro",
  "fujocoded",
  "fujocoded-backerkit",
  "fujoguide",
  "fujoverse",
  "outro",
] as const;

const CONTENT_BLOCKS = {
  index: [
    "intro",
    "fujocoded",
    "fujocoded-backerkit",
    "fujoguide",
    "fujoverse",
    "outro",
  ],
  buttondown: [
    "intro",
    "fujocoded",
    "fujocoded-backerkit",
    "fujoguide",
    "fujoverse",
    "outro",
  ],
  backerkit: [
    "intro",
    "fujocoded",
    "fujocoded-backerkit",
    "fujoverse",
    "outro",
  ],
  kickstarter: ["intro", "fujocoded", "fujoguide", "fujoverse", "outro"],
} as const satisfies Record<string, (typeof BLOCKS)[number][]>;
type PLATFORMS = keyof typeof CONTENT_BLOCKS;

const throwIfSymbol = (
  text: Symbol | string | undefined,
  error?: Error,
): string | undefined => {
  if (typeof text === "symbol") {
    throw error || new Error(`unexpected symbol: ${String(text)}`);
  }

  return text as string | undefined;
};

const PREAMBLES = {
  index: (title: string, date: Date, tagline: string | undefined) =>
    `---\ntitle: "${title}"\ntagline: "${tagline ?? "TBD"}"\ncreated_at: ${date.toISOString()}\ntags:\n  - monthly newsletter\nsocials: []\n---\n\n`,
  backerkit: (title: string, _date: Date, _tagline: string | undefined) =>
    `---\ntitle: "${title}"\n---\n\n`,
  kickstarter: (title: string, _date: Date, _tagline: string | undefined) =>
    `---\ntitle: "${title}"\n---\n\n`,
  buttondown: (title: string, _date: Date, _tagline: string | undefined) =>
    `---\ntitle: "${title}"\n---\n\n`,
} as const satisfies Record<PLATFORMS, any>;

program.arguments("<action>");

program.parse(process.argv);

const action = program.args[0];

if (action === "create") {
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
  const newsletterRoot = path.resolve(
    process.cwd(),
    "..",
    NEWSLETTERS_ROOT,
    name,
  );
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
}

if (action === "build" || action == "watch") {
  const lastUpdates = (
    await readdirSync(path.resolve(process.cwd(), "..", NEWSLETTERS_ROOT), {
      withFileTypes: true,
    })
  )
    .filter((d) => d.isDirectory())
    .map((d) => ({
      ...d,
      ...statSync(path.resolve(d.parentPath, d.name)),
    }))
    .sort((a, b) => b.birthtimeMs - a.birthtimeMs);
  const options = [];
  lastUpdates[0] &&
    options.push({
      value: path.resolve(lastUpdates[0].parentPath, lastUpdates[0].name),
      label: lastUpdates[0].name,
    });
  lastUpdates[1] &&
    options.push({
      value: path.resolve(lastUpdates[1].parentPath, lastUpdates[1].name),
      label: lastUpdates[1].name,
    });
  lastUpdates[2] &&
    options.push({
      value: path.resolve(lastUpdates[2].parentPath, lastUpdates[2].name),
      label: lastUpdates[2].name,
    });

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

  const fileContent = readFileSync(
    path.resolve(process.cwd(), "..", NEWSLETTERS_ROOT, name, "index.md"),
    "utf-8",
  );

  const originalTitle = fileContent.match(/title: "([^"]+)"/)?.[1] as string;
  const originalTagline = fileContent.match(
    /tagline: "([^"]+)"/,
  )?.[1] as string;

  let tagline: string | Symbol | undefined;
  let title: string | Symbol | undefined;
  title = throwIfSymbol(
    await text({
      message: "What is the newsletter title? (empty for previous)",
      placeholder: originalTitle ?? "Fujocoded Newsletter",
      validate: (value) => {
        if (!title && !!value) {
          return new Error("You need a title");
        }
      },
    }),
    new Error("Please enter a valid title"),
  );

  tagline = throwIfSymbol(
    await text({
      message: "What is the newsletter tagline? (empty for previous)",
      placeholder: originalTagline ?? "TODO",
    }),
    new Error("Please enter a valid tagline"),
  );
  const directory = path.resolve(process.cwd(), "..", NEWSLETTERS_ROOT, name);
  const blocksDirectory = path.resolve(directory, "_blocks");

  const buildNewsletter = async () => {
    const blocksContent = BLOCKS.reduce(
      (acc, block, index) => {
        acc[block] = readFileSync(
          path.resolve(
            blocksDirectory,
            `${index.toString().padStart(2, "0")}-${block}.md`,
          ),
          "utf-8",
        );
        return acc;
      },
      {} as Record<string, string>,
    );

    for (const [contentType, blocks] of Object.entries(CONTENT_BLOCKS)) {
      const content = blocks.map((block) => blocksContent[block]).join("\n\n");
      await writeFileSync(
        path.resolve(
          directory,
          `${contentType == "index" ? contentType : `_${contentType}`}.md`,
        ),
        PREAMBLES[contentType as keyof typeof PREAMBLES](
          title ?? originalTitle,
          new Date(),
          tagline ?? originalTagline ?? "TODO",
        ) + content,
      );
    }
  };
  const s = spinner();
  s.start("Building newsletter content...");
  await buildNewsletter();
  s.stop(`Newsletter content created at ${name}`);
  if (action == "watch") {
    stream.info([
      "Now watching newsletter content...",
      `Find the blocks to edit at ${blocksDirectory}`,
    ]);
    watch(blocksDirectory, async () => {
      s.start("Rebuilding newsletter content...");
      await buildNewsletter();
      s.stop(`Newsletter content updated at ${name}`);
    });
  } else if (action == "build") {
    stream.info("Newsletter built at index.md");
  } else {
    throw Error("unknown action");
  }
}
