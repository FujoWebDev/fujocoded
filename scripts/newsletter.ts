import { text, outro, spinner } from "@clack/prompts";
import { Command } from "commander";
import {
  existsSync,
  writeFileSync,
  statSync,
  mkdirSync,
  readFileSync,
} from "fs";
import path from "path";
const program = new Command();

const BLOCKS = [
  "intro",
  "fujocoded",
  "fujocoded-backerkit",
  "fujoguide",
  "fujoverse",
  "outro",
] as const;

const CONTENT_BLOCKS: Record<string, (typeof BLOCKS)[number][]> = {
  index: [
    "intro",
    "fujocoded",
    "fujocoded-backerkit",
    "fujoguide",
    "fujoverse",
    "outro",
  ],
  "fujocoded-newsletter": [
    "intro",
    "fujocoded",
    "fujocoded-backerkit",
    "fujoverse",
    "outro",
  ],
  fujoguide: ["intro", "fujoguide", "fujoverse", "outro"],
} as const;

const PREAMBLES = {
  index: (title: string, date: Date) =>
    `---\ntitle: "${title}"\ntagline: TBD\ncreated_at: ${date.toISOString()}\ntags:\n  - monthly newsletter\nsocials: []\n---\n\n`,
  "fujocoded-newsletter": (title: string, _date: Date) =>
    `---\ntitle: "${title}"\n---\n\n`,
  fujoguide: (title: string, _date: Date) => `---\ntitle: "${title}"\n---\n\n`,
} as const;

program.argument("<action>", "The action to perform");

program.parse(process.argv);

const action = program.args[0];

if (action === "create") {
  const name = await text({
    message: "Where should we save the newsletter?",
    placeholder: "src/content/updates",
    validate: (value) => {
      if (
        !value ||
        !existsSync(path.join(process.cwd(), "..", value)) ||
        !statSync(path.join(process.cwd(), "..", value)).isDirectory()
      ) {
        return new Error("Please enter a valid path");
      }
      return undefined;
    },
  });
  if (typeof name === "symbol") {
    throw new Error("Please enter a valid path");
  }
  mkdirSync(path.join(process.cwd(), "..", name, "_blocks"), {
    recursive: true,
  });
  let blockIndex = 0;
  for (const block of BLOCKS) {
    writeFileSync(
      path.join(
        process.cwd(),
        "..",
        name,
        `_blocks/${blockIndex.toString().padStart(2, "0")}-${block}.md`,
      ),
      "",
    );
    blockIndex++;
  }
  await outro(`Newsletter blocks created at ../${name}/_blocks`);
}

if (action === "build") {
  const name = await text({
    message: "Where is the newsletter located?",
    placeholder: "src/content/updates",
  });
  if (typeof name === "symbol") {
    throw new Error("Please enter a valid path");
  }

  let title = await text({
    message: "What is the newsletter title? (empty for previous)",
    placeholder: "Fujocoded Newsletter",
  });
  if (typeof title === "symbol") {
    throw new Error("Please enter a valid title");
  }

  const blocksContent = BLOCKS.reduce(
    (acc, block, index) => {
      acc[block] = readFileSync(
        path.join(
          process.cwd(),
          "..",
          name,
          "_blocks",
          `${index.toString().padStart(2, "0")}-${block}.md`,
        ),
        "utf-8",
      );
      return acc;
    },
    {} as Record<string, string>,
  );

  if (!title) {
    title = readFileSync(
      path.join(process.cwd(), "..", name, "index.md"),
      "utf-8",
    ).match(/title: "([^"]+)"/)?.[1] as string;
    if (!title) {
      throw new Error("No title found");
    }
  }

  const s = spinner();
  s.start("Building newsletter content...");
  for (const [contentType, blocks] of Object.entries(CONTENT_BLOCKS)) {
    const content = blocks.map((block) => blocksContent[block]).join("\n\n");
    writeFileSync(
      path.join(
        process.cwd(),
        "..",
        name,
        `${contentType == "index" ? contentType : `_${contentType}`}.md`,
      ),
      PREAMBLES[contentType as keyof typeof PREAMBLES](title, new Date()) +
        content,
    );
  }
  s.stop(`Newsletter content created at ../${name}`);
}
