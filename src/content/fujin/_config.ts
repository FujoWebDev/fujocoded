import { defineCollection, z } from "astro:content";
import { parseInline } from "marked";

export const collection = defineCollection({
  type: "data",
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
