import { defineCollection, z } from "astro:content";

export const collection = defineCollection({
  type: "data",
  schema: (tools) =>
    z.object({
      image: tools.image(),
      alt: z.string().transform((s) => {
        return s.replaceAll("\n", " ");
      }),
      author: z.string(),
    }),
});
