import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { SocialLinks } from "../contributors/_schema/socials";

import { parseInline } from "marked";
import { z } from "zod/v4";

export const updates = defineCollection({
  loader: glob({
    pattern: "**/index.{md,mdx}",
    base: "./src/content/updates",
    generateId: ({ entry }) => entry.replace(/\/index\.(mdx?)$/, ""),
  }),
  schema: ({ image }) =>
    z.object({
      title: z.string().transform((title) => parseInline(title) ?? ""),
      tagline: z.string().optional(),
      created_at: z.date(),
      unlisted: z.boolean().optional().default(false),
      tags: z.array(z.string()).optional().default([]),
      og_image: image().optional(),
      og_description: z
        .string()
        .optional()
        .transform((text) => text?.replaceAll("\n", " ").trim()),
      og_title: z.string().optional(),
      status: z.enum(["rough-draft", "pre-beta"]).optional(),
      socials: SocialLinks,
    }),
});
