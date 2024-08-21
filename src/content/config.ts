import { collection as teamCollection } from "./team/_config.ts";
import { collection as fujinCollection } from "./fujin/_config.ts";
import { collection as projectsCollection } from "./projects/_config.ts";
import { collection as imagesCollection } from "./images/_config.ts";
import { collection as sponsorsCollection } from "./sponsors/_config.ts";
import { updates } from "./updates/_config.ts";

import { defineCollection, z } from "astro:content";

const FaqSchema = z.object({
  title: z.string(),
  order: z.number(),
  draft: z.boolean().optional(),
  success: z.boolean().default(false),
});

export const collections = {
  team: teamCollection,
  updates,
  fujin: fujinCollection,
  projects: projectsCollection,
  images: imagesCollection,
  sponsors: sponsorsCollection,
  faqs: defineCollection({
    type: "content",
    schema: FaqSchema,
  }),
};
