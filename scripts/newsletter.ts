import { Command } from "@commander-js/extra-typings";
import { runBuildOrWatch, runCreate, runDiff } from "./newsletter/commands.js";

const program = new Command();

program.arguments("<action>");

program.parse(process.argv);

const action = program.args[0];

if (action === "create") {
  await runCreate();
}

if (action === "build" || action == "watch") {
  await runBuildOrWatch(action);
}

if (action === "diff") {
  await runDiff();
}
