import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { parseInline } from "marked";
import { z } from "zod/v4";

export const collection = defineCollection({
  loader: glob({
    pattern: "*.{yaml,yml}",
    base: "./src/content/fujin",
  }),
  schema: (tools) =>
    z.object({
      name: z.string(),
      avatar: tools.image(),
      order: z.number(),
      description: z
        .string()
        .transform((title) => parseInline(title || "") ?? ""),
    }),
});
