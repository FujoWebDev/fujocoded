import { collection as teamCollection } from "./team/_config.ts";
import { collection as fujinCollection } from "./fujin/_config.ts";
import { collection as projectsCollection } from "./projects/_config.ts";
import { updates } from "./updates/_config.ts";

export const collections = {
  team: teamCollection,
  updates,
  fujin: fujinCollection,
  projects: projectsCollection,
};
