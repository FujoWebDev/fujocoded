import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod/v4";

const ContactGroup = z.enum(["projects", "stores"]);

const SocialLink = z.object({
  label: z.string(),
  url: z.url(),
  icon: z.string(),
});

export const collection = defineCollection({
  loader: glob({
    pattern: "*.{yaml,yml}",
    base: "./src/content/contacts",
  }),
  schema: (tools) =>
    z.object({
      title: z.string(),
      description: z.string(),
      href: z.url(),
      image: tools.image(),
      imageAlt: z.string(),
      group: ContactGroup,
      order: z.number().int().nonnegative(),
      socials: SocialLink.array(),
    }),
});
