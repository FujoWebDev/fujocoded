import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod/v4";

export const collection = defineCollection({
  loader: glob({
    pattern: "*.{yaml,yml}",
    base: "./src/content/images/src",
  }),
  schema: (tools) =>
    z.object({
      image: tools.image(),
      alt: z.string().transform((s) => {
        return s.replaceAll("\n", " ");
      }),
      author: z.string(),
    }),
});
