import { compileMDX } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkGfm from "remark-gfm";
import readingTime from "reading-time";
import { CodeBlock } from "@/components/blog/CodeBlock";
import { PostImage } from "@/components/blog/PostImage";

export interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{1,3})\s+(.+)$/gm;
  const toc: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    // Inline markdown işaretlerini temizle (**, *, `, [text](url) vs.)
    const text = match[2]
      .trim()
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\*(.+?)\*/g, "$1")
      .replace(/`(.+?)`/g, "$1")
      .replace(/\[(.+?)\]\(.+?\)/g, "$1");

    // github-slugger ile aynı algoritma: Türkçe dahil Unicode harfler korunur
    const id = text
      .toLowerCase()
      .trim()
      // eslint-disable-next-line no-useless-escape
      .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,.\/:;<=>?@\[\]^`{|}~]/g, "")
      .replace(/\s+/g, "-");

    toc.push({ id, text, level });
  }

  return toc;
}

export function getReadingTime(content: string): string {
  const stats = readingTime(content);
  return `${Math.ceil(stats.minutes)} dk okuma`;
}

export async function compileMdxContent(source: string) {
  const { content, frontmatter } = await compileMDX({
    source,
    components: { pre: CodeBlock, img: PostImage },
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: "prepend",
              properties: {
                className: ["anchor"],
                ariaHidden: "true",
                tabIndex: -1,
              },
              content: {
                type: "element",
                tagName: "span",
                properties: { className: ["anchor-icon"] },
                children: [],
              },
            },
          ],
          [
            rehypePrettyCode,
            {
              theme: "one-dark-pro",
              keepBackground: true,
            },
          ],
        ],
      },
    },
  });

  return { content, frontmatter };
}
