import { SocialLinks } from "@fujocoded/zod-transform-socials";
import { defineCollection, z } from "astro:content";

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
      websites: SocialLinks,
      description: z
        .string()
        .optional()
        .transform((title) => parseInline(title || "") ?? ""),
    }),
});
