import { defineConfig } from "astro/config";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import remarkCapitalizeTitles, { DEFAULT_CAPITALIZATIONS } from "@fujocoded/remark-capitalize-titles";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import metaTags from "astro-meta-tags";

import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  integrations: [icon(), tailwind(), mdx(), metaTags(), react()],
  markdown: {
    remarkPlugins: [[remarkCapitalizeTitles, {
      special: DEFAULT_CAPITALIZATIONS
    }]],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, {
      behavior: "wrap"
    }]]
  }
});