import { defineConfig } from "astro/config";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import remarkCapitalizeTitles, {
  DEFAULT_CAPITALIZATIONS,
} from "@fujocoded/remark-capitalize-titles";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkAltTextFiles from "@fujocoded/remark-alt-text-files";

import metaTags from "astro-meta-tags";

// https://astro.build/config
export default defineConfig({
  integrations: [icon(), tailwind(), mdx(), metaTags()],
  markdown: {
    remarkPlugins: [
      [remarkCapitalizeTitles, { special: DEFAULT_CAPITALIZATIONS }],
      remarkAltTextFiles,
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
        },
      ],
    ],
  },
  redirects: {
    "/store": {
      status: 302,
      destination: "https://store.fujocoded.com",
    },
    "/yearning": {
      status: 302,
      destination:
        "https://docs.google.com/presentation/d/1NRNSL9wheh-wfHHBkjEUoSghPYY5wWWbVGh3_HEMny0/edit?usp=sharing",
    },
  },
});
