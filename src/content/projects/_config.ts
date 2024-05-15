import { defineCollection, z } from "astro:content";
import { socialsSchema, transformSocial } from "../../lib/socials-transformer";

import { parseInline } from "marked";

const ProjectCategoriesSchema = z.enum([
  "library",
  "software",
  "community",
  "education",
  "commerce",
]);

const ProjectTagsSchema = z.enum([
  "open source",
  "beginner friendly",
  "april 1st",
  "free",
  "paid",
  "contributors welcome",
  "accepting new members",
]);

export const collection = defineCollection({
  type: "data",
  schema: (tools) =>
    z.object({
      name: z.string(),
      preview: tools.image(),
      categories: ProjectCategoriesSchema.array(),
      tags: ProjectTagsSchema.array().default([]),
      graduated: z.boolean().default(false),
      focus: z.boolean().default(false),
      websites: socialsSchema
        .array()
        .transform((contacts) => contacts.map(transformSocial)),
      description: z
        .string()
        .optional()
        .transform((title) => parseInline(title || "") ?? ""),
    }),
});
