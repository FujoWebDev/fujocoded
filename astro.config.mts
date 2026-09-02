import { defineConfig } from "astro/config";
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import tailwindcss from "@tailwindcss/vite";
import remarkCapitalizeTitles, {
  DEFAULT_CAPITALIZATIONS,
} from "@fujocoded/remark-capitalize-titles";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkAltTextFiles from "@fujocoded/remark-alt-text-files";
import {
  customRehypeToc,
  sectionLinks,
} from "./src/components/lib/unified-plugins";

// https://astro.build/config
export default defineConfig({
  experimental: {
    contentIntellisense: true,
  },
  integrations: [icon(), mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    remarkPlugins: [
      [remarkCapitalizeTitles, { special: DEFAULT_CAPITALIZATIONS }],
      remarkAltTextFiles,
      sectionLinks,
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
        },
      ],
      // @ts-expect-error - we just don't know
      customRehypeToc,
    ],
  },
  redirects: {
    "/team": "/contributors",
    "/team/[member]": "/contributors/[member]",
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
