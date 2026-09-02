import { SocialLinks } from "../contributors/_schema/socials";
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod/v4";

export const collection = defineCollection({
  loader: glob({
    pattern: "*.{yaml,yml}",
    base: "./src/content/contacts",
  }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    websites: SocialLinks,
  }),
});
