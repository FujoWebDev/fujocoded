import { SocialLinks } from "../contributors/_schema/socials";
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod/v4";

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
  loader: glob({
    pattern: "*.{yaml,yml}",
    base: "./src/content/projects",
  }),
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
