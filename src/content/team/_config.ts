import { defineCollection, z } from "astro:content";
import { parseInline } from "marked";
import { socialsSchema, transformSocial } from "../../lib/socials-transformer";

const contributorType = z.enum(["founder", "contractor", "community"]);

export const collection = defineCollection({
  type: "data",
  schema: (tools) =>
    z.object({
      name: z.string(),
      avatar: tools.image(),
      type: contributorType,
      contacts: socialsSchema
        .array()
        .transform((contacts) => contacts.map(transformSocial)),
      bio: z
        .string()
        .optional()
        .transform((title) => parseInline(title || "") ?? ""),
    }),
});
