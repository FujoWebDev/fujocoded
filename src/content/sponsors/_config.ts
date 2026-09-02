import { SocialLinks } from "../contributors/_schema/socials";
import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "zod/v4";

const Pledge = z.union([
  z.object({
    campaign: z.literal("FujoGuide Volume 0"),
    tier: z.enum(["GIT Art", "GIT Help", "GIT Fic", "Sponsor"]),
  }),
  z.object({
    campaign: z.literal("FujoCoded LLC"),
    tier: z.enum(["Bronze Fujin", "Silver Fujin", "Gold Fujin"]),
  }),
]);

export const collection = defineCollection({
  loader: glob({
    pattern: "*.{yaml,yml}",
    base: "./src/content/sponsors",
  }),
  schema: (tools) =>
    z.object({
      name: z.string(),
      avatar: tools.image(),
      pledges: Pledge.array(),
      contacts: SocialLinks,
    }),
});
