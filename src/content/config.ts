import { ContributorSchema } from "./contributors/_schema";
import { collection as teamCollection} from "./team/_config.ts"
import { collection as fujinCollection } from "./fujin/_config.ts";
import { collection as projectsCollection } from "./projects/_config.ts";
import { collection as imagesCollection } from "./images/_config.ts";
import { collection as sponsorsCollection } from "./sponsors/_config.ts";
import { collection as snsContactsCollection } from "./contacts/_config.ts";
import { updates } from "./updates/_config.ts";
import { defineCollection, z } from "astro:content";
import { glob, file } from 'astro/loaders';

export const collections = {
  contributors: defineCollection({
    type: "data",
    schema: ContributorSchema
  }),
  team: teamCollection,
  updates,
  fujin: fujinCollection,
  projects: projectsCollection,
  images: imagesCollection,
  sponsors: sponsorsCollection,
  contacts: snsContactsCollection,
};
