import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { ContributorSchema } from "./content/contributors/_schema";
import { collection as snsContactsCollection } from "./content/contacts/_config.ts";
import { collection as fujinCollection } from "./content/fujin/_config.ts";
import { collection as imagesCollection } from "./content/images/_config.ts";
import { collection as projectsCollection } from "./content/projects/_config.ts";
import { collection as sponsorsCollection } from "./content/sponsors/_config.ts";
import { updates } from "./content/updates/_config.ts";

export const collections = {
  contributors: defineCollection({
    loader: glob({
      pattern: "*.{yaml,yml}",
      base: "./src/content/contributors",
      generateId: ({ entry }) => entry.replace(/\.(ya?ml)$/, ""),
    }),
    schema: ContributorSchema,
  }),
  updates,
  fujin: fujinCollection,
  projects: projectsCollection,
  images: imagesCollection,
  sponsors: sponsorsCollection,
  contacts: snsContactsCollection,
};
