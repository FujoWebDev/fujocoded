import { defineCollection, z } from "astro:content";
import { parseInline } from "marked";

const contributorType = z.enum(["founder", "contractor", "community"]);

export const collection = defineCollection({
  type: "data",
  schema: (tools) =>
    z.object({
      name: z.string(),
      avatar: tools.image(),
      type: contributorType,
      contacts: z.string().url().array(),
      bio: z
        .string()
        .optional()
        .transform((title) => parseInline(title || "") ?? ""),
    }),
});
