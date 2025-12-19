import { type Plugin } from "unified";
import type mdast from "mdast";
import { matches, select, selectAll } from "unist-util-select";
import { toString } from "mdast-util-to-string";
import slugify from "@sindresorhus/slugify";

export const sectionLinks: Plugin<[], mdast.Root> = () => {
  return (tree) => {
    const sectionTitles = selectAll(
      "list > listItem > paragraph > strong:first-child",
      tree,
    );
    for (const title of sectionTitles) {
      const slug = slugify(toString(title));
      // @ts-expect-error
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
      }
    }
  };
};
