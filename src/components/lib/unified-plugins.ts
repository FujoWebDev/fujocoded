import { type Plugin } from "unified";
import type mdast from "mdast";
import {selectAll } from "unist-util-select";
import { toString } from "mdast-util-to-string";
import slugify from "@sindresorhus/slugify";
import type { Strong } from "mdast";
import rehypeToc from "rehype-toc";
import { h } from "hastscript";
import type { Processor, Transformer } from "unified";
import type { Node } from "unist";

export const sectionLinks: Plugin<[], mdast.Root> = () => {
  return (tree) => {
    const sectionTitles = selectAll(
      "list > listItem > paragraph > strong:first-child",
      tree,
    ) as Strong[];
    for (const title of sectionTitles) {
      const slug = slugify(toString(title));
      title.children = [
        {
          type: "link",
          url: `#${slug}`,
          children: title.children,
        },
      ];
      title.data = {
        hProperties: {
          id: slug,
        },
      };
    }
  };
};

function legacyPluginWrapper<
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

export const customRehypeToc = legacyPluginWrapper(rehypeToc, {
  customizeTOC: (toc) => {
    if (!toc.children?.length) {
      return false;
    }
    toc.children = [h("h2", "In this edition:"), ...toc.children];

    return toc;
  },
  customizeTOCItem: (toc, heading) => {
    function hasChildren(node: Node): node is Node & { children: Node[] } {
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
});
