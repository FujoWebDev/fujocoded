import { SocialLinks } from "@fujocoded/zod-transform-socials";
import { defineCollection, z } from "astro:content";
import { parseInline } from "marked";

export const collection = defineCollection({
  type: "data",
  schema: (tools) =>
    z.object({
      name: z.string(),
      description: z.string(),
      websites: SocialLinks,
    }),
});
