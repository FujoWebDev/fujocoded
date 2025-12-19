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
import rehypeToc from "rehype-toc";
import { sectionLinks } from "./src/components/lib/remark-plugins";

import type { Processor, Transformer } from "unified";
import type { Node } from "unist";
import { h } from "hastscript";

type LegacyPlugin<TOptions, Q extends Node> = (
  this: Processor,
  options?: TOptions,
) => Transformer<Q, Q>;

export function legacyPluginWrapper<
  F extends (this: Processor, options?: any) => Transformer<any, any>,
  TOptions = Parameters<F>[0],
  Q extends Node = ReturnType<F> extends Transformer<infer R, infer R2>
    ? R & R2
    : Node,
>(plugin: F, options: TOptions): (this: Processor) => Transformer<Q, Q> {
  return function attacher(this: Processor) {
    return plugin.call(this, options);
  };
}

// https://astro.build/config
export default defineConfig({
  integrations: [icon(), tailwind(), mdx(), metaTags()],
  markdown: {
    remarkPlugins: [
      [remarkCapitalizeTitles, { special: DEFAULT_CAPITALIZATIONS }],
      remarkAltTextFiles,
      sectionLinks
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "wrap",
        },
      ],
      legacyPluginWrapper(rehypeToc, {
        customizeTOC: (toc) => {
          if (!toc.children?.length) {
            return false;
          }
          toc.children = [h("h2", "In this edition:"), ...toc.children];

          return toc;
        },
        customizeTOCItem: (toc, heading) => {
          function hasChildren(
            node: Node,
          ): node is Node & { children: Node[] } {
            return Array.isArray((node as any).children);
          }
          if (
            hasChildren(toc) &&
            hasChildren(toc.children[0]) &&
            toc.children[0].children.length > 0
          ) {
            return toc;
          }

          return false;
        },
      }),
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
  experimental: {
    contentIntellisense: true
  }
});
