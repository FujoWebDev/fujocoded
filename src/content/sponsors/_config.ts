import { SocialLinks } from "@fujocoded/zod-transform-socials";
import { defineCollection, z } from "astro:content";

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
  type: "data",
  schema: (tools) =>
    z.object({
      name: z.string(),
      avatar: tools.image(),
      pledges: Pledge.array(),
      contacts: SocialLinks,
    }),
});
